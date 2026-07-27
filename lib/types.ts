/**
 * 閺嶇绺剧猾璇茬€风€规矮绠?
 * 閹碘偓閺堝鏆熼幑顔剧波閺嬪嫬婀銈夋肠娑擃厼鐣炬稊澶涚礉绾喕绻氱猾璇茬€风€瑰鍙?
 */

/** PA-API 閸樼喎顫愰弫鐗堝祦閿涘牊濯洪崣鏍ф倵閵嗕浇顓哥粻妤€澧犻敍?*/
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
  detailPageUrl: string; // Amazon 鐠囷附鍎忔い纰夌礄閸?affiliate tag閿?
  categories: string[];
  releaseDate?: string; // ISO date
  publisher?: string;
}

/** 鐠侊紕鐣婚崥搴ｆ畱娑旓妇鐫勯弫鐗堝祦閿涘牆鎯?Value Score 缁涘瀵氶弽鍥风礆 */
export interface Book extends BookRawData {
  runtimeHours: number;
  valueScore: number;
  costPerHour: number;
  creditWorth: number; // price / 14.95
  adjustedValueScore: number; // 鑴?log(reviewCount + 1)
}

/** Value Score 鐠囧嫬鍨庣粵澶岄獓 */
export type ScoreGrade = 'excellent' | 'good' | 'fair' | 'poor';

/** 缁箖鈧顪侀崡?*/
export interface CuratedList {
  slug: string;
  title: string;
  description: string;
  category: string;
  bookAsins: string[]; // 瀵洜鏁?Book.asin
  updatedAt: string;
}

/** 缁涙盯鈧寮弫?*/
export interface BookFilter {
  keyword: string;
  durationRange: string; // 'all' | '0-8' | '8-20' | '20-40' | '40-999'
  minRating: number; // 0 | 4.0 | 4.5
  category: string; // 'all' | 閸忚渹缍嬮崚鍡欒閸?
}

/** 閹烘帒绨柅澶愩€?*/
export type SortOption = 'valueScore' | 'rating' | 'duration' | 'price';

/** 缁夘垰鍨庣拋锛勭暬閸ｃ劏绶崗?*/
export interface CalculatorInput {
  credits: number;
  plan: 'monthly' | 'monthly2' | 'annual';
}