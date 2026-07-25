/**
 * Value Score 核心算法
 *
 * 公式: Value Score = (时长小时 × 评分) / 价格美元
 * 辅助: Cost per Hour = 价格 / 时长
 *       Credit Worth = 价格 / 积分价值(14.95)
 *       Adjusted Value = Value Score × log(评论数 + 1)
 *
 * 设计逻辑:
 * - 时长权重: 积分等价交换，长篇 = 更低每小时成本
 * - 评分权重: 好书的时间投入更值得
 * - 价格分母: 积分等价 $14.95，价格越高用积分越划算
 */

import type { Book, BookRawData, ScoreGrade } from '@/lib/types';
import { AUDIBLE_CREDIT_VALUE } from '@/lib/config';

/**
 * 保留指定小数位数
 */
function round(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * 计算书籍的各项价值指标
 */
export function calculateScores(book: BookRawData): Book {
  const runtimeHours = book.runtimeMinutes / 60;

  // 核心: Value Score = (时长 × 评分) / 价格
  const valueScore = (runtimeHours * book.starRating) / book.price;

  // 辅助: 每小时成本
  const costPerHour = book.price / runtimeHours;

  // 辅助: 积分价值倍数（价格 / 积分等价美元）
  // creditWorth > 1 表示用积分比直接买更划算
  const creditWorth = book.price / AUDIBLE_CREDIT_VALUE;

  // 加权: 评论数少的书降低权重（防止3条五星刷分）
  // log(reviewCount + 1):
  //   10条评论 → log(11) ≈ 2.4
  //   100条评论 → log(101) ≈ 4.6
  //   1000条评论 → log(1001) ≈ 6.9
  const adjustedValueScore = valueScore * Math.log(book.reviewCount + 1);

  return {
    ...book,
    runtimeHours: round(runtimeHours, 1),
    valueScore: round(valueScore, 2),
    costPerHour: round(costPerHour, 2),
    creditWorth: round(creditWorth, 2),
    adjustedValueScore: round(adjustedValueScore, 2),
  };
}

/**
 * 批量计算
 */
export function calculateAllScores(books: BookRawData[]): Book[] {
  return books.map(calculateScores);
}

/**
 * Value Score 评分等级
 * >=8.0 Excellent (绿)
 * 5.0-7.9 Good (琥珀)
 * 3.0-4.9 Fair (警告)
 * <3.0 Poor (红)
 */
export function getScoreGrade(valueScore: number): ScoreGrade {
  if (valueScore >= 8.0) return 'excellent';
  if (valueScore >= 5.0) return 'good';
  if (valueScore >= 3.0) return 'fair';
  return 'poor';
}

/**
 * 评分等级对应的显示标签
 */
export function getScoreLabel(grade: ScoreGrade): string {
  const labels: Record<ScoreGrade, string> = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor Value',
  };
  return labels[grade];
}

/**
 * 判断是否值得用积分（vs 直接购买）
 * creditWorth > 1 表示价格高于积分价值，用积分更划算
 */
export function isCreditWorth(price: number): boolean {
  return price > AUDIBLE_CREDIT_VALUE;
}

/**
 * 格式化 Value Score 显示
 */
export function formatValueScore(score: number): string {
  return score.toFixed(2);
}
