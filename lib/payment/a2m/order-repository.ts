/**
 * 订单仓储实现。
 *
 * A2M 契约要求「订单持久化、本地订单匹配、金额一致性、资源防串、幂等履约」，
 * 并明确禁止回退到进程内内存订单（Serverless 实例回收即丢失）。
 *
 * 提供两个实现：
 * - UpstashOrderRepository：生产用。走 Upstash / Vercel KV 的 REST 接口，零额外依赖。
 * - FileOrderRepository：仅本地与沙箱联调用。Vercel 运行时会拒绝启动。
 *
 * 选择顺序：显式 A2M_ORDER_STORE → 检测到 KV 变量则 upstash → 否则 file。
 */

import { mkdir, open, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { normalizeAmount } from './bill';
import type {
  A2mOrder,
  OrderRepository,
  PrepareFulfillmentInput,
  PrepareFulfillmentResult,
} from './types';

export class OrderStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderStoreError';
  }
}

const ORDER_TTL_SECONDS = 48 * 60 * 60;

function keyOf(outTradeNo: string): string {
  return `a2m:order:${outTradeNo}`;
}

function lockKeyOf(outTradeNo: string): string {
  return `a2m:lock:${outTradeNo}`;
}

function isFulfilling(order: A2mOrder): boolean {
  return order.fulfillStatus === 'PENDING_CONFIRM' || order.fulfillStatus === 'FULFILLED';
}

// ─────────────────────────────────────────────────────────────
// Upstash / Vercel KV
// ─────────────────────────────────────────────────────────────

class UpstashOrderRepository implements OrderRepository {
  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async command(body: unknown[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new OrderStoreError(`KV 调用失败：HTTP ${res.status} ${await res.text()}`);
    }
    const payload = (await res.json()) as { result?: unknown; error?: string };
    if (payload.error) throw new OrderStoreError(`KV 返回错误：${payload.error}`);
    return payload.result;
  }

  private async readOrder(outTradeNo: string): Promise<A2mOrder | null> {
    const raw = (await this.command(['GET', keyOf(outTradeNo)])) as string | null;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as A2mOrder;
    } catch {
      throw new OrderStoreError(`订单 ${outTradeNo} 存储内容不是合法 JSON`);
    }
  }

  private async writeOrder(order: A2mOrder): Promise<void> {
    order.updatedAt = new Date().toISOString();
    await this.command([
      'SET',
      keyOf(order.outTradeNo),
      JSON.stringify(order),
      'EX',
      ORDER_TTL_SECONDS,
    ]);
  }

  async createPending(order: A2mOrder): Promise<void> {
    const created = (await this.command([
      'SET',
      keyOf(order.outTradeNo),
      JSON.stringify(order),
      'EX',
      ORDER_TTL_SECONDS,
      'NX',
    ])) as string | null;
    if (created === null) {
      throw new OrderStoreError(`订单号 ${order.outTradeNo} 已存在，拒绝覆盖`);
    }
  }

  async findByOutTradeNo(outTradeNo: string): Promise<A2mOrder | null> {
    return this.readOrder(outTradeNo);
  }

  async prepareFulfillment(input: PrepareFulfillmentInput): Promise<PrepareFulfillmentResult> {
    const token = randomUUID();
    const lock = (await this.command([
      'SET',
      lockKeyOf(input.outTradeNo),
      token,
      'NX',
      'EX',
      20,
    ])) as string | null;

    if (lock === null) {
      // 另一个实例正在履约，等它写完再读，避免重复生成资源
      for (let attempt = 0; attempt < 10; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const existing = await this.readOrder(input.outTradeNo);
        if (existing && isFulfilling(existing) && existing.serviceResult) {
          return { state: existing.fulfillStatus as 'PENDING_CONFIRM' | 'FULFILLED', serviceResult: existing.serviceResult };
        }
      }
      throw new OrderStoreError(`订单 ${input.outTradeNo} 履约被并发占用且未在等待窗口内完成`);
    }

    try {
      const order = await this.readOrder(input.outTradeNo);
      if (!order) throw new OrderStoreError(`订单 ${input.outTradeNo} 不存在`);

      if (isFulfilling(order) && order.serviceResult) {
        return {
          state: order.fulfillStatus as 'PENDING_CONFIRM' | 'FULFILLED',
          serviceResult: order.serviceResult,
        };
      }

      assertOrderMatches(order, input);

      const serviceResult = input.createResource();
      order.tradeNo = input.tradeNo;
      order.fulfillStatus = 'PENDING_CONFIRM';
      order.orderStatus = 'PAID';
      order.serviceResult = serviceResult;
      await this.writeOrder(order);

      return { state: 'PENDING_CONFIRM', serviceResult };
    } finally {
      await this.command(['DEL', lockKeyOf(input.outTradeNo)]);
    }
  }

  async markFulfilled(outTradeNo: string, tradeNo: string): Promise<void> {
    const order = await this.readOrder(outTradeNo);
    if (!order) throw new OrderStoreError(`订单 ${outTradeNo} 不存在，无法标记履约完成`);
    order.fulfillStatus = 'FULFILLED';
    order.orderStatus = 'PAID';
    order.tradeNo = tradeNo;
    await this.writeOrder(order);
  }
}

// ─────────────────────────────────────────────────────────────
// 本地文件（仅开发与沙箱联调）
// ─────────────────────────────────────────────────────────────

class FileOrderRepository implements OrderRepository {
  constructor(private readonly dir: string) {}

  private pathOf(outTradeNo: string): string {
    return join(this.dir, `${outTradeNo}.json`);
  }

  private async readOrder(outTradeNo: string): Promise<A2mOrder | null> {
    try {
      return JSON.parse(await readFile(this.pathOf(outTradeNo), 'utf8')) as A2mOrder;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw err;
    }
  }

  private async writeOrder(order: A2mOrder): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    order.updatedAt = new Date().toISOString();
    const tmp = `${this.pathOf(order.outTradeNo)}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(order, null, 2), 'utf8');
    await rename(tmp, this.pathOf(order.outTradeNo));
  }

  async createPending(order: A2mOrder): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    let handle: Awaited<ReturnType<typeof open>>;
    try {
      handle = await open(this.pathOf(order.outTradeNo), 'wx');
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
        throw new OrderStoreError(`订单号 ${order.outTradeNo} 已存在，拒绝覆盖`);
      }
      throw err;
    }
    try {
      await handle.writeFile(JSON.stringify(order, null, 2), 'utf8');
    } finally {
      await handle.close();
    }
  }

  async findByOutTradeNo(outTradeNo: string): Promise<A2mOrder | null> {
    return this.readOrder(outTradeNo);
  }

  async prepareFulfillment(input: PrepareFulfillmentInput): Promise<PrepareFulfillmentResult> {
    const order = await this.readOrder(input.outTradeNo);
    if (!order) throw new OrderStoreError(`订单 ${input.outTradeNo} 不存在`);

    if (isFulfilling(order) && order.serviceResult) {
      return {
        state: order.fulfillStatus as 'PENDING_CONFIRM' | 'FULFILLED',
        serviceResult: order.serviceResult,
      };
    }

    assertOrderMatches(order, input);

    const serviceResult = input.createResource();
    order.tradeNo = input.tradeNo;
    order.fulfillStatus = 'PENDING_CONFIRM';
    order.orderStatus = 'PAID';
    order.serviceResult = serviceResult;
    await this.writeOrder(order);

    return { state: 'PENDING_CONFIRM', serviceResult };
  }

  async markFulfilled(outTradeNo: string, tradeNo: string): Promise<void> {
    const order = await this.readOrder(outTradeNo);
    if (!order) throw new OrderStoreError(`订单 ${outTradeNo} 不存在，无法标记履约完成`);
    order.fulfillStatus = 'FULFILLED';
    order.orderStatus = 'PAID';
    order.tradeNo = tradeNo;
    await this.writeOrder(order);
  }
}

function assertOrderMatches(order: A2mOrder, input: PrepareFulfillmentInput): void {
  if (normalizeAmount(order.amount) !== normalizeAmount(input.expectedAmount)) {
    throw new OrderStoreError(
      `金额不一致：本地订单 ${order.amount}，支付凭证 ${input.expectedAmount}`
    );
  }
  if (order.resourceId !== input.expectedResourceId) {
    throw new OrderStoreError(
      `资源不一致：本地订单 ${order.resourceId}，当前请求 ${input.expectedResourceId}`
    );
  }
  if (order.requestHash !== input.requestHash) {
    throw new OrderStoreError('请求指纹不匹配，该订单绑定的是另一次请求，拒绝用旧凭证换取当前结果');
  }
}

// ─────────────────────────────────────────────────────────────

let repository: OrderRepository | null = null;

export function getOrderRepository(): OrderRepository {
  if (repository) return repository;

  const explicit = (process.env.A2M_ORDER_STORE || '').trim().toLowerCase();
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  const onVercel = Boolean(process.env.VERCEL);

  const useUpstash = explicit === 'upstash' || (explicit !== 'file' && kvUrl && kvToken);

  if (useUpstash) {
    if (!kvUrl || !kvToken) {
      throw new OrderStoreError(
        'A2M_ORDER_STORE=upstash 需要 KV_REST_API_URL + KV_REST_API_TOKEN（或 UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN）'
      );
    }
    repository = new UpstashOrderRepository(kvUrl, kvToken);
    return repository;
  }

  if (onVercel) {
    throw new OrderStoreError(
      '生产环境必须配置订单持久化。请在 Vercel 配置 KV_REST_API_URL 与 KV_REST_API_TOKEN，' +
        '文件存储无法在 Serverless 上保证幂等。'
    );
  }

  repository = new FileOrderRepository(join(process.cwd(), '.a2m-orders'));
  return repository;
}
