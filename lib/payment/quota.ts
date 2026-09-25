/**
 * 免费额度与调用方识别。
 *
 * 注意：额度计数是进程内 Map。Serverless 每个实例独立计数、冷启动清零，
 * 只能挡误用，挡不住刷量。付费判断不依赖它，所以不影响收费正确性。
 * 要真正限住需要接 KV，与订单仓储共用同一套 KV 配置即可。
 */

import { freeDailyQuota } from './a2m/config';

export interface QuotaState {
  identity: string;
  limit: number;
  used: number;
  remaining: number;
  resetAt: string;
}

const quotaBuckets = new Map<string, { used: number; day: string }>();

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function nextMidnightUtc(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
}

/** 只做额度分桶，不采集用户身份。 */
export function getIdentity(request: Request): string {
  const explicit =
    request.headers.get('x-client-id') ||
    request.headers.get('x-skillhub-client') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';
  return explicit.slice(0, 120);
}

export function peekQuota(identity: string, now = new Date()): QuotaState {
  const limit = freeDailyQuota();
  const bucket = quotaBuckets.get(identity);
  const used = bucket && bucket.day === todayKey(now) ? bucket.used : 0;
  return {
    identity,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetAt: nextMidnightUtc(now),
  };
}

export function consumeQuota(
  identity: string,
  now = new Date()
): { allowed: boolean; quota: QuotaState } {
  const state = peekQuota(identity, now);
  if (state.used >= state.limit) {
    return { allowed: false, quota: state };
  }
  quotaBuckets.set(identity, { used: state.used + 1, day: todayKey(now) });
  return {
    allowed: true,
    quota: { ...state, used: state.used + 1, remaining: state.remaining - 1 },
  };
}
