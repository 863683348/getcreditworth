/**
 * 鏍稿績绫诲瀷瀹氫箟
 * 鎵€鏈夋暟鎹粨鏋勫湪姝ら泦涓畾涔夛紝纭繚绫诲瀷瀹夊叏
 */

/** PA-API 鍘熷鏁版嵁锛堟媺鍙栧悗銆佽绠楀墠锛?*/
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
  detailPageUrl: string; // Amazon 璇︽儏椤碉紙鍚?affiliate tag锛?
  categories: string[];
  releaseDate?: string; // ISO date
  publisher?: string;
}

/** 璁＄畻鍚庣殑涔︾睄鏁版嵁锛堝惈 Value Score 绛夋寚鏍囷級 */
export interface Book extends BookRawData {
  runtimeHours: number;
  valueScore: number;
  costPerHour: number;
  creditWorth: number; // price / 14.95
  adjustedValueScore: number; // 脳 log(reviewCount + 1)
}

/** Value Score 璇勫垎绛夌骇 */
export type ScoreGrade = 'excellent' | 'good' | 'fair' | 'poor';

/** 绮鹃€夋鍗?*/
export interface CuratedList {
  slug: string;
  title: string;
  description: string;
  category: string;
  bookAsins: string[]; // 寮曠敤 Book.asin
  updatedAt: string;
}

/** 绛涢€夊弬鏁?*/
export interface BookFilter {
  keyword: string;
  durationRange: string; // 'all' | '0-8' | '8-20' | '20-40' | '40-999'
  minRating: number; // 0 | 4.0 | 4.5
  category: string; // 'all' | 鍏蜂綋鍒嗙被鍚?
}

/** 鎺掑簭閫夐」 */
export type SortOption = 'valueScore' | 'rating' | 'duration' | 'price';

/** 绉垎璁＄畻鍣ㄨ緭鍏?*/
export interface CalculatorInput {
  credits: number;
  plan: 'monthly' | 'monthly2' | 'annual';
}