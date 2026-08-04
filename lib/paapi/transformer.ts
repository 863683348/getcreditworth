/**
 * PA-API 响应转换器
 * 将 PA-API 返回的 PaapiItem 转换为我们的 BookRawData 格式
 */

import type { PaapiItem } from "./types";
import type { BookRawData } from "@/lib/types";

/**
 * 将单个 PA-API Item 转换为 BookRawData
 *
 * PA-API 对有声书的支持有限（Audible ASIN ≠ Amazon ASIN），
 * 所以这个方法主要用于获取价格/评分更新，而不是全量数据。
 */
export function transformPaapiItem(item: PaapiItem): Partial<BookRawData> {
  const result: Partial<BookRawData> = {
    asin: item.ASIN,
  };

  // 书名
  if (item.ItemInfo?.Title?.DisplayValue) {
    result.title = item.ItemInfo.Title.DisplayValue;
  }

  // 作者/朗读者
  if (item.ItemInfo?.ByLineInfo?.Contributors) {
    const authors = item.ItemInfo.ByLineInfo.Contributors.filter(
      (c) => c.Role === "Author" || c.Role === "Creator",
    ).map((c) => c.Name || "");
    if (authors.length > 0) {
      result.author = authors.join(", ");
    }

    const narrators = item.ItemInfo.ByLineInfo.Contributors.filter(
      (c) => c.Role === "Narrator",
    ).map((c) => c.Name || "");
    if (narrators.length > 0) {
      result.narrator = narrators.join(", ");
    }
  }

  // 价格
  if (item.Offers?.Listings) {
    const price = item.Offers.Listings[0]?.Price?.Amount;
    if (price !== undefined && price > 0) {
      result.price = price;
      result.currency = item.Offers.Listings[0]?.Price?.Currency || "USD";
    }
  }

  // 评分
  if (item.CustomerReviews?.StarRating?.DoubleValue !== undefined) {
    result.starRating = item.CustomerReviews.StarRating.DoubleValue;
  }

  // 评论数
  if (item.CustomerReviews?.Count !== undefined) {
    result.reviewCount = item.CustomerReviews.Count;
  }

  // 封面图
  if (item.Images?.Primary?.Medium?.URL) {
    result.coverImageUrl = item.Images.Primary.Medium.URL;
  } else if (item.Images?.Primary?.Large?.URL) {
    result.coverImageUrl = item.Images.Primary.Large.URL;
  }

  // Amazon 详情页链接
  if (item.DetailPageURL) {
    result.detailPageUrl = item.DetailPageURL;
  }

  return result;
}

/**
 * 用 PA-API 数据更新现有书数据
 * 只覆盖 PA-API 能提供的字段，保留已有的字段
 */
export function mergePaapiData(
  existing: BookRawData,
  updateData: Partial<BookRawData>,
): BookRawData {
  return {
    ...existing,
    asin: updateData.asin || existing.asin,
    title: updateData.title || existing.title,
    author: updateData.author || existing.author,
    narrator: updateData.narrator !== undefined ? updateData.narrator : existing.narrator,
    price: updateData.price != null && updateData.price > 0 ? updateData.price : existing.price,
    currency: updateData.currency || existing.currency,
    starRating: updateData.starRating != null && updateData.starRating > 0 ? updateData.starRating : existing.starRating,
    reviewCount: updateData.reviewCount != null && updateData.reviewCount > 0 ? updateData.reviewCount : existing.reviewCount,
    coverImageUrl: updateData.coverImageUrl || existing.coverImageUrl,
    detailPageUrl: updateData.detailPageUrl || existing.detailPageUrl,
  };
}

/**
 * 判断 PA-API 返回的结果是否有意义（含价格或评分）
 */
export function hasValidData(item: Partial<BookRawData>): boolean {
  return (item.price !== undefined && item.price > 0) ||
    (item.starRating !== undefined && item.starRating > 0);
}
