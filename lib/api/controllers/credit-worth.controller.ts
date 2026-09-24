/**
 * 信用点决策控制器
 *
 * 职责：给定一批候选书 + 用户手上的信用点数，回答「该买哪本、该不该用信用点、
 *       有没有更划算的替代品」——交付的是一句可执行的判断，不是一串数字。
 *
 * 与 /api/books 的区别：
 *   /api/books        返回排好序的原始数据，让用户自己判断
 *   credit-worth      返回带结论的判断，并把「相对全站同类的位置」一并算出
 *
 * 计分口径全部复用 lib/calc/value-score.ts，不另起一套：
 *   valueScore         = 时长小时 × 评分 / 价格
 *   costPerHour        = 价格 / 时长小时
 *   creditWorth        = 价格 / 14.95（>1 表示用信用点比直接买划算）
 *   adjustedValueScore = valueScore × ln(评论数 + 1)
 */

import { getAllBooks } from '@/lib/data/books';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';
import type { Book } from '@/lib/types';

/** 单次请求最多分析多少本 */
export const MAX_ASINS = 50;

export type Verdict = 'use_credit' | 'marginal' | 'skip' | 'use_cash';

export interface CreditWorthRequestInput {
  asins?: unknown;
  monthly_credits?: unknown;
  genre_filter?: unknown;
}

export interface CreditWorthItem {
  asin: string;
  title: string;
  author: string;
  narrator?: string;
  runtimeHours: number;
  price: number;
  currency: string;
  starRating: number;
  reviewCount: number;
  valueScore: number;
  costPerHour: number;
  creditWorth: number;
  adjustedValueScore: number;
  /** 在比较集合中的百分位，100 = 最划算 */
  percentile: number;
  /** 在比较集合中的排名，1 = 第一 */
  rank: number;
  /** 这组 percentile / rank 是在哪个口径下算的：all_catalog 或 category:<关键词> */
  compared_against: string;
  /** 该口径下的样本数 */
  compared_size: number;
  verdict: Verdict;
  verdictLine: string;
  /** 相对同集合中位每小时成本，省下百分之多少（负数表示更贵） */
  savingVsMedianPercent: number;
  detailPageUrl: string;
}

export interface SwapCandidate {
  asin: string;
  title: string;
  valueScore: number;
  percentile: number;
  gainPercent: number;
  reason: string;
}

export interface CreditWorthResult {
  results: CreditWorthItem[];
  notFound: string[];
  recommendation: {
    monthly_credits: number;
    credits_value_usd: number;
    buy: string[];
    skip: string[];
    /** 同样一个信用点，换成本书能多拿多少价值 */
    swap_candidates: SwapCandidate[];
    lines: string[];
  };
  pool: {
    scope: string;
    size: number;
    medianCostPerHour: number;
    medianValueScore: number;
    medianRuntimeHours: number;
  };
  generated_at: string;
}

function round(n: number, d: number): number {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

/** 在比较集合中排到「全站最划算」的百分位，100 表示第一 */
function percentileOf(sorted: number[], value: number): number {
  if (sorted.length === 0) return 0;
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= value) lo = mid + 1;
    else hi = mid;
  }
  return round((lo / sorted.length) * 100, 1);
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** 规范化并校验入参里的 ASIN 列表 */
export function normalizeAsins(input: unknown): { asins: string[]; invalid: string[] } {
  const raw = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const asins: string[] = [];
  const invalid: string[] = [];
  for (const item of raw) {
    const code = String(item || '').trim().toUpperCase();
    if (!code) continue;
    if (!/^[A-Z0-9]{10}$/.test(code)) {
      invalid.push(code);
      continue;
    }
    if (seen.has(code)) continue;
    seen.add(code);
    asins.push(code);
    if (asins.length >= MAX_ASINS) break;
  }
  return { asins, invalid };
}

/**
 * 一个比较口径下的统计量。
 *
 * 必须按口径成组计算：给了 genre_filter 时，落在该分类之外的书如果仍拿
 * 分类的中位数去比，会得出「在商业类里排前 100%」这种没有意义的结论。
 * 所以每本书都用在它自己所属的口径下算出来的一组数字来判。
 */
interface ScopeStats {
  scope: string;
  size: number;
  valueIndex: Map<string, number>;
  sortedByValue: Book[];
  valueSorted: number[];
  medianCostPerHour: number;
  medianValueScore: number;
  medianRuntimeHours: number;
}

function buildScopeStats(books: Book[], scope: string): ScopeStats {
  const sortedByValue = [...books].sort((a, b) => b.valueScore - a.valueScore);
  const valueIndex = new Map<string, number>();
  sortedByValue.forEach((b, i) => valueIndex.set(b.asin, i));
  return {
    scope,
    size: books.length,
    valueIndex,
    sortedByValue,
    valueSorted: books.map((b) => b.valueScore).sort((a, b) => a - b),
    medianCostPerHour: round(median(books.map((b) => b.costPerHour).sort((a, b) => a - b)), 2),
    medianValueScore: round(median(books.map((b) => b.valueScore).sort((a, b) => a - b)), 2),
    medianRuntimeHours: round(median(books.map((b) => b.runtimeHours).sort((a, b) => a - b)), 1),
  };
}

function resolveGenre(genre: unknown): string {
  return typeof genre === 'string' ? genre.trim().toLowerCase() : '';
}

function judge(
  book: Book,
  percentile: number,
  medianCostPerHour: number
): { verdict: Verdict; line: string; saving: number } {
  const saving =
    medianCostPerHour > 0
      ? round(((medianCostPerHour - book.costPerHour) / medianCostPerHour) * 100, 1)
      : 0;

  // 价格低于一个信用点的现金价值 → 直接买比烧信用点便宜，这条最容易被忽略
  if (book.creditWorth < 1) {
    return {
      verdict: 'use_cash',
      saving,
      line: `价格 $${book.price} 低于一个信用点的 $${AUDIBLE_CREDIT_VALUE}，直接买更便宜，别用信用点。`,
    };
  }
  if (percentile >= 80) {
    return {
      verdict: 'use_credit',
      saving,
      line: `值得用信用点：${book.runtimeHours}h × ${book.starRating} 星换来 ${book.valueScore} 分，比同类中位每小时成本省 ${saving}%。`,
    };
  }
  if (percentile >= 45) {
    return {
      verdict: 'marginal',
      saving,
      line: `中规中矩：在同类里排前 ${round(100 - percentile, 1)}%，每小时 $${book.costPerHour}，没有明显亏也不占便宜。`,
    };
  }
  return {
    verdict: 'skip',
    saving,
    line: `不建议花信用点：${book.runtimeHours}h 换 $${book.price}，每小时 $${book.costPerHour}，比同类中位贵 ${Math.abs(saving)}%。`,
  };
}

export function analyzeCreditWorth(input: CreditWorthRequestInput): CreditWorthResult {
  const { asins } = normalizeAsins(input.asins);
  const creditsRaw = Number(input.monthly_credits);
  const monthlyCredits =
    Number.isFinite(creditsRaw) && creditsRaw > 0 ? Math.min(20, Math.floor(creditsRaw)) : 1;
  const genre = resolveGenre(input.genre_filter);

  const catalog = getAllBooks();
  const byGlobalAsin = new Map(catalog.map((b) => [b.asin, b]));

  // 主口径：给了 genre_filter 且该分类下样本够多（≥20 本）就在分类内比较
  const genrePool = genre
    ? catalog.filter((b) => b.categories.some((c) => c.toLowerCase().includes(genre)))
    : [];
  const primary =
    genrePool.length >= 20 ? buildScopeStats(genrePool, `category:${genre}`) : buildScopeStats(catalog, 'all_catalog');
  // 备口径：候选落在主口径之外时，退回全站口径，绝不用不属于它的中位数去评判
  const fallback =
    primary.scope === 'all_catalog' ? primary : buildScopeStats(catalog, 'all_catalog');

  const results: CreditWorthItem[] = [];
  const notFound: string[] = [];

  for (const asin of asins) {
    const book = byGlobalAsin.get(asin);
    if (!book) {
      notFound.push(asin);
      continue;
    }
    const scope = primary.valueIndex.has(asin) ? primary : fallback;
    const pct = percentileOf(scope.valueSorted, book.valueScore);
    const rank = (scope.valueIndex.get(book.asin) ?? -1) + 1;
    const { verdict, line, saving } = judge(book, pct, scope.medianCostPerHour);
    results.push({
      asin: book.asin,
      title: book.title,
      author: book.author,
      narrator: book.narrator,
      runtimeHours: book.runtimeHours,
      price: book.price,
      currency: book.currency,
      starRating: book.starRating,
      reviewCount: book.reviewCount,
      valueScore: book.valueScore,
      costPerHour: book.costPerHour,
      creditWorth: book.creditWorth,
      adjustedValueScore: book.adjustedValueScore,
      percentile: pct,
      rank: rank > 0 ? rank : 0,
      compared_against: scope.scope,
      compared_size: scope.size,
      verdict,
      verdictLine: line,
      savingVsMedianPercent: saving,
      detailPageUrl: `https://getcreditworth.com/books/${book.asin}`,
    });
  }

  results.sort((a, b) => b.valueScore - a.valueScore);

  const buyable = results.filter((r) => r.verdict === 'use_credit' || r.verdict === 'marginal');
  const buy = buyable.slice(0, monthlyCredits).map((r) => r.asin);
  const skip = results.filter((r) => !buy.includes(r.asin)).map((r) => r.asin);

  // 换书建议：在候选之外找更划算的同类替代，用候选里最好那本所属的口径
  const topProvided = results[0];
  const swapScope = topProvided?.compared_against === primary.scope ? primary : fallback;
  const candidateAsins = new Set(results.map((r) => r.asin));
  const bestProvided = topProvided?.valueScore ?? 0;
  const swapCandidates: SwapCandidate[] =
    bestProvided > 0
      ? swapScope.sortedByValue
          .filter((b) => !candidateAsins.has(b.asin) && b.valueScore > bestProvided * 1.15)
          .slice(0, 3)
          .map((b) => {
            const gain = round(((b.valueScore - bestProvided) / bestProvided) * 100, 1);
            return {
              asin: b.asin,
              title: b.title,
              valueScore: b.valueScore,
              percentile: percentileOf(swapScope.valueSorted, b.valueScore),
              gainPercent: gain,
              reason: `${b.runtimeHours}h / $${b.price} / ${b.starRating} 星，同样一个信用点能多拿到 ${gain}% 的价值`,
            };
          })
      : [];

  const lines: string[] = [];
  if (results.length === 0) {
    lines.push('给出的 ASIN 在站内都没有命中。可先用 /api/books?keyword= 按书名检索，确认 ASIN 后再来。');
  } else {
    lines.push(
      `你手上有 ${monthlyCredits} 个信用点（约 $${round(monthlyCredits * AUDIBLE_CREDIT_VALUE, 2)}）。候选里最划算的是《${topProvided.title}》，${topProvided.verdictLine}`
    );
    const cashOnly = results.filter((r) => r.verdict === 'use_cash');
    if (cashOnly.length) {
      lines.push(
        `有 ${cashOnly.length} 本建议直接花钱买而不是烧信用点：${cashOnly
          .map((r) => `《${r.title}》$${r.price}`)
          .join('、')}。`
      );
    }
    const skipped = results.filter((r) => r.verdict === 'skip');
    if (skipped.length) {
      lines.push(`有 ${skipped.length} 本在这批里性价比垫底，不建议占信用点。`);
    }
    if (swapCandidates.length) {
      lines.push(`若可换书，${swapCandidates[0].reason}，见 /books/${swapCandidates[0].asin}。`);
    }
  }

  return {
    results,
    notFound,
    recommendation: {
      monthly_credits: monthlyCredits,
      credits_value_usd: round(monthlyCredits * AUDIBLE_CREDIT_VALUE, 2),
      buy,
      skip,
      swap_candidates: swapCandidates,
      lines,
    },
    pool: {
      scope: primary.scope,
      size: primary.size,
      medianCostPerHour: primary.medianCostPerHour,
      medianValueScore: primary.medianValueScore,
      medianRuntimeHours: primary.medianRuntimeHours,
    },
    generated_at: new Date().toISOString(),
  };
}
