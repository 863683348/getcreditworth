/**
 * POST /api/v1/credit-worth
 * GET  /api/v1/credit-worth   （端点自述，便于技能与调用方发现契约）
 *
 * 输入（application/json）：
 *   {
 *     "asins": ["B0CPMLBV5M", "..."],   // 必填，最多 50 个，10 位字母数字
 *     "monthly_credits": 1,             // 可选，本期手上的信用点数，默认 1
 *     "genre_filter": "business"        // 可选，只在命中该分类的书里做比较
 *   }
 *
 * 计费走支付宝 AI 按量付费（A2M）：
 *   ① 无 `Payment-Proof` 头时，先扣本地免费额度（CREDITWORTH_FREE_DAILY，默认 5）。
 *   ② 额度用尽返回 HTTP 402，账单放在 `Payment-Needed` 头。
 *   ③ 用户付款后，客户端携 `Payment-Proof` 重试同一请求，服务端验付并交付。
 *   ④ 交付成功后响应头回填 `Payment-Validation`。
 *
 * 说明：本端点只读 data/books.json 与既有的计分函数，不新增数据链路。
 *       公开的 /api/books 保持不变（SEO 与站点导流依赖它）。
 */

import { NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api/response';
import { MAX_ASINS, analyzeCreditWorth, normalizeAsins } from '@/lib/api/controllers/credit-worth.controller';
import {
  A2M_RESOURCE_PATH,
  PAYMENT_NEEDED_HEADER,
  PAYMENT_PROOF_HEADER,
  PAYMENT_VALIDATION_HEADER,
  authorizeWithProof,
  buildRequestHash,
  createPaymentRequired,
  unitPriceCny,
} from '@/lib/payment/a2m';
import { consumeQuota, getIdentity, peekQuota } from '@/lib/payment/quota';
import type { CreditWorthResult } from '@/lib/api/controllers/credit-worth.controller';

export const dynamic = 'force-dynamic';
/** 账单签名与验付都要用 node:crypto，必须跑在 Node runtime。 */
export const runtime = 'nodejs';

const A2M_PROTOCOL = 'alipay-ai-pay-a2m';

/** 单次调用最多分析的 ASIN 数，用于账单里的商品名展示。 */
const GOODS_BASE = 'Audible 信用值决策';

export async function GET(request: Request) {
  const identity = getIdentity(request);
  return NextResponse.json(
    successResponse({
      endpoint: A2M_RESOURCE_PATH,
      method: 'POST',
      protocol: A2M_PROTOCOL,
      price_cny: unitPriceCny(),
      billing: 'per_call',
      payment_headers: {
        bill: PAYMENT_NEEDED_HEADER,
        proof: PAYMENT_PROOF_HEADER,
        validation: PAYMENT_VALIDATION_HEADER,
      },
      free_quota: 'CREDITWORTH_FREE_DAILY（默认 5 次/身份/日）',
      request: {
        asins: `string[]，必填，最多 ${MAX_ASINS} 个 ASIN`,
        monthly_credits: 'number，可选，默认 1',
        genre_filter: 'string，可选，分类关键词（小写子串匹配）',
      },
      response: {
        results: '逐本结论，含 percentile / rank / verdict / verdictLine',
        recommendation: 'buy / skip / swap_candidates / lines',
        pool: '比较集合的口径与中位数',
      },
      credit_value_usd: 14.95,
      quota: peekQuota(identity),
    })
  );
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(errorResponse('INVALID_JSON', '请求体必须是 JSON'), { status: 400 });
  }

  const { asins, invalid } = normalizeAsins(body.asins);
  if (asins.length === 0) {
    return NextResponse.json(
      errorResponse(
        'INVALID_ASINS',
        invalid.length
          ? `没有合法的 ASIN，收到 ${invalid.slice(0, 5).join(', ')}（需 10 位字母数字）`
          : `asins 必填，最多 ${MAX_ASINS} 个`
      ),
      { status: 400 }
    );
  }

  const identity = getIdentity(request);
  const goodsName = `${GOODS_BASE}（${asins.length} 本）`;
  const requestHash = buildRequestHash({
    asins,
    monthly_credits: body.monthly_credits ?? 1,
    genre_filter: body.genre_filter ?? null,
  });

  const analyze = (): CreditWorthResult =>
    analyzeCreditWorth({
      asins,
      monthly_credits: body.monthly_credits,
      genre_filter: body.genre_filter,
    });

  const paidResponse = (result: CreditWorthResult, tradeNo: string, alreadyFulfilled: boolean, validation: string) =>
    NextResponse.json(
      successResponse(result, `分析 ${result.results.length} 本，未命中 ${result.notFound.length} 个 ASIN`),
      {
        headers: {
          'X-Credit-Worth-Paid-Via': 'payment',
          'X-Credit-Worth-Pool': `${result.pool.scope}:${result.pool.size}`,
          [PAYMENT_VALIDATION_HEADER]: validation,
          'X-Payment-Trade-No': tradeNo,
          'X-Payment-Already-Fulfilled': String(alreadyFulfilled),
        },
      }
    );

  // ── 有 Payment-Proof：走支付宝验付与履约 ────────────────────────────────
  const proofHeader = request.headers.get(PAYMENT_PROOF_HEADER);
  if (proofHeader) {
    const issueNewBill = async (): Promise<string> => {
      const bill = await createPaymentRequired({ goodsName, requestHash, identity });
      return bill.neededHeader;
    };

    const outcome = await authorizeWithProof({
      proofHeader,
      requestHash,
      createResource: () => JSON.stringify(analyze()),
      issueNewBill,
    });

    if (outcome.status === 'paid') {
      return paidResponse(
        JSON.parse(outcome.payload) as CreditWorthResult,
        outcome.tradeNo,
        outcome.alreadyFulfilled,
        outcome.validationHeader
      );
    }

    if (outcome.status === 'fulfillment_pending') {
      return NextResponse.json(
        errorResponse('FULFILLMENT_CONFIRM_FAILED', outcome.message),
        {
          status: 502,
          headers: {
            'X-Payment-Trade-No': outcome.tradeNo,
            'X-Payment-Out-Trade-No': outcome.outTradeNo,
            'Retry-After': '3',
          },
        }
      );
    }

    return NextResponse.json(errorResponse('PAYMENT_INVALID', outcome.reason), {
      status: 402,
      headers: outcome.neededHeader ? { [PAYMENT_NEEDED_HEADER]: outcome.neededHeader } : {},
    });
  }

  // ── 无 Payment-Proof：先扣免费额度 ──────────────────────────────────────
  const { allowed, quota } = consumeQuota(identity);
  const quotaHeaders = {
    'X-Credit-Worth-Quota-Limit': String(quota.limit),
    'X-Credit-Worth-Quota-Remaining': String(quota.remaining),
    'X-Credit-Worth-Quota-Reset': quota.resetAt,
  };

  if (!allowed) {
    try {
      const bill = await createPaymentRequired({ goodsName, requestHash, identity });
      return NextResponse.json(
        errorResponse(
          'PAYMENT_REQUIRED',
          `今日 ${quota.limit} 次免费额度已用完。本次调用需支付 ¥${bill.amount}，` +
            `请按 ${PAYMENT_NEEDED_HEADER} 头完成付款后，携 ${PAYMENT_PROOF_HEADER} 重试同一请求。`
        ),
        {
          status: 402,
          headers: {
            [PAYMENT_NEEDED_HEADER]: bill.neededHeader,
            'X-Payment-Order-Id': bill.outTradeNo,
            'X-Payment-Amount': bill.amount,
            'X-Payment-Currency': 'CNY',
            'X-Payment-Service-Id': A2M_RESOURCE_PATH,
            'X-Payment-Pay-Before': bill.payBefore,
            ...quotaHeaders,
          },
        }
      );
    } catch (err) {
      return NextResponse.json(
        errorResponse(
          'PAYMENT_INIT_FAILED',
          err instanceof Error ? err.message : '账单生成失败，请检查服务端支付宝配置'
        ),
        { status: 503, headers: quotaHeaders }
      );
    }
  }

  try {
    const result = analyze();
    return NextResponse.json(
      successResponse(result, `分析 ${result.results.length} 本，未命中 ${result.notFound.length} 个 ASIN`),
      {
        headers: {
          'X-Credit-Worth-Paid-Via': 'quota',
          'X-Credit-Worth-Pool': `${result.pool.scope}:${result.pool.size}`,
          'X-Credit-Worth-Price': unitPriceCny(),
          ...quotaHeaders,
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse('ANALYZE_ERROR', err instanceof Error ? err.message : 'Unknown error'),
      { status: 500, headers: quotaHeaders }
    );
  }
}
