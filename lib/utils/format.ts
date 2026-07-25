/**
 * 格式化工具
 * 集中管理数字/时长/价格的显示格式
 */

/**
 * 格式化时长（分钟 → Xh Ym）
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * 格式化时长（小时，1位小数）
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}

/**
 * 格式化价格（美元）
 */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * 格式化数字（千分位 + 缩写）
 * 1234 → 1.2k, 12345 → 12.3k
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

/**
 * 格式化评分（1位小数）
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * 格式化日期（ISO → "Jul 25, 2026"）
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}
