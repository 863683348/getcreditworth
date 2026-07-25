/**
 * 核心类型定义
 * 所有数据结构在此集中定义，确保类型安全
 */

/** PA-API 原始数据（拉取后、计算前） */
export interface BookRawData {
  asin: string;
  title: string;
  author: string;
  narrator?: string;
  runtimeMinutes: number;
  price: number;
  currency: string;
  starRating: number; // 0-5
  reviewCount: number;
  coverImageUrl: string;
  detailPageUrl: string; // Amazon 详情页（含 affiliate tag）
  categories: string[];
  releaseDate?: string; // ISO date
  publisher?: string;
}

/** 计算后的书籍数据（含 Value Score 等指标） */
export interface Book extends BookRawData {
  runtimeHours: number;
  valueScore: number;
  costPerHour: number;
  creditWorth: number; // price / 14.95
  adjustedValueScore: number; // × log(reviewCount + 1)
}

/** Value Score 评分等级 */
export type ScoreGrade = 'excellent' | 'good' | 'fair' | 'poor';

/** 精选榜单 */
export interface CuratedList {
  slug: string;
  title: string;
  description: string;
  category: string;
  narrator?: string;
  narrator?: string; // narrator name filter
  bookAsins: string[]; // 引用 Book.asin
  updatedAt: string;
}

/** 筛选参数 */
export interface BookFilter {
  keyword: string;
  durationRange: string; // 'all' | '0-8' | '8-20' | '20-40' | '40-999'
  minRating: number; // 0 | 4.0 | 4.5
  category: string; // 'all' | 具体分类名
}

/** 排序选项 */
export type SortOption = 'valueScore' | 'rating' | 'duration' | 'price';

/** 积分计算器输入 */
export interface CalculatorInput {
  credits: number;
  plan: 'monthly' | 'monthly2' | 'annual';
}