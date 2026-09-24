/**
 * POST /api/v1/credit-worth
 * GET  /api/v1/credit-worth   （端点自述，便于技能与调用方发现契约）
 *
 * 输入（application/json）：
 *   {
 *     "asins": ["B0CPMLBV5M", "..."],   // 必填，最多 50 个，10 位大写字母数字
 *     "monthly_credits": 1,             // 可选，本期手上的信用点数，默认 1
 *     "genre_filter": "business",       // 可选，只在命中该分类的书里做比较
 *     "payment_code": "..."             // 可选，付款凭据；带有效凭据则跳免费额度
 *   }
 *
 * 输出：见 CreditWorthResult。核心不是数据，是每条 verdict 与整体 swap 建议。
 *
 * 计费：每一身份每日免费 CREDITWORTH_FREE_DAILY 次（默认 5）。
 *       超出后返回 402，响应头携带一次性付款凭据。
 *       付款后把凭据回填到请求体 payment_code 重试即放行。
 *
 * 说明：本端点只读 data/books.json 与既有的计分函数，不新增数据链路。
 *       公开的 /api/books 保持不变（SEE 与站点导流依赖它）。
 */

import { NextResponse } from 'next/server';
import { errorResponse, successResponse } from '@/lib/api/response';
import { MAX_ASINS, analyzeCreditWorth, normalizeAsins } from '@/lib/api/controllers/credit-worth.controller';
import {
  X402_PROTOCOL,
  X402_RESOURCE,
  consumeQuota,
  createOrder,
  getIdentity,
  paywallMessage,
  peekQuota,
  unitPriceCny,
  verifyPayment,
} from '@/lib/payment/x402';

export const dynamic = 'force-dynamic';

const USAGE = {
  endpoint: X402_RESOURCE,
  method: 'POST',
  protocol: X402_PROTOCOL,
  price_cny: unitPriceCny(),
  billing: 'per_call',
  free_quota: 'CREDITWORTH_FREE_DAILY（默认 5 次/身份/日）',
  request: {
    asins: `string[]，必填，最多 ${MAX_ASINS} 个 ASIN`,
    monthly_credits: 'number，可选，默认 1',
    genre_filter: 'string，可选，分类关键词（小写子串匹配）',
    payment_code: 'string，可选，付款凭据',
  },
  response: {
    results: '逐本结论，含 percentile / rank / verdict / verdictLine',
    recommendation: 'buy / skip / swap_candidates / lines',
    pool: '比较集合的口径与中位数',
  },
  credit_value_usd: 14.95,
};

export async function GET(request: Request) {
  const identity = getIdentity(request);
  return NextResponse.json(
    successResponse({
      ...USAGE,
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

  // ① 有付款凭据就先核销，核销通过则不受免费额度限制
  let paidVia: 'quota' | 'payment' = 'quota';
  const paymentCode = typeof body.payment_code === 'string' ? body.payment_code : null;
  if (paymentCode) {
    const verdict = await verifyPayment(paymentCode);
    if (verdict.paid) {
      paidVia = 'payment';
    } else {
      return NextResponse.json(
        errorResponse('PAYMENT_INVALID', `付款凭据未通过核销：${verdict.reason}`),
        { status: 402, headers: { 'WeixinPay-Required': paymentCode } }
      );
    }
  }

  // ② 没走付款就走免费额度
  let quotaHeaders: Record<string, string> = {};
  if (paidVia === 'quota') {
    const { allowed, quota } = consumeQuota(identity);
    quotaHeaders = {
      'X-Credit-Worth-Quota-Limit': String(quota.limit),
      'X-Credit-Worth-Quota-Remaining': String(quota.remaining),
      'X-Credit-Worth-Quota-Reset': quota.resetAt,
    };
    if (!allowed) {
      try {
        const order = await createOrder({
          identity,
          quantity: 1,
          summary: `credit-worth:${asins.length} asins`,
        });
        return NextResponse.json(
          errorResponse('PAYMENT_REQUIRED', paywallMessage(quota, order.amount)),
          {
            status: 402,
            headers: {
              // 客户端识别到这个头即触发工程化支付；其值即 paymentCode
              'WeixinPay-Required': order.payment_code,
              'X-Payment-Protocol': X402_PROTOCOL,
              'X-Payment-Order-Id': order.order_id,
              'X-Payment-Amount': order.amount,
              'X-Payment-Currency': order.currency,
              'X-Payment-Expires': order.expires_at,
              ...quotaHeaders,
            },
          }
        );
      } catch (err) {
        return NextResponse.json(
          errorResponse('PAYMENT_INIT_FAILED', err instanceof Error ? err.message : '预下单失败'),
          { status: 503 }
        );
      }
    }
  }

  try {
    const result = analyzeCreditWorth({
      asins,
      monthly_credits: body.monthly_credits,
      genre_filter: body.genre_filter,
    });
    return NextResponse.json(
      successResponse(result, `分析 ${result.results.length} 本，未命中 ${result.notFound.length} 个 ASIN`),
      {
        headers: {
          'X-Credit-Worth-Paid-Via': paidVia,
          'X-Credit-Worth-Pool': `${result.pool.scope}:${result.pool.size}`,
          'X-Credit-Worth-Price': unitPriceCny(),
          ...quotaHeaders,
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse('ANALYZE_ERROR', err instanceof Error ? err.message : 'Unknown error'),
      { status: 500 }
    );
  }
}
