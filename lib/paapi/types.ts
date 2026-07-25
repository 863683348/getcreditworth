/**
 * PA-API 5.0 类型定义
 *
 * 参考: https://webservices.amazon.com/paapi5/documentation/
 */

export interface PaapiConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  partnerType: "Associates";
  host?: string;
  region?: string;
}

export interface SearchItemsRequest {
  Keywords: string;
  SearchIndex?: string;
  ItemCount?: number;
  ItemPage?: number;
  Resources: string[];
  PartnerTag: string;
  PartnerType: string;
  Marketplace?: string;
}

export interface GetItemsRequest {
  ItemIds: string[];
  Resources: string[];
  PartnerTag: string;
  PartnerType: string;
  Marketplace?: string;
}

export interface PaapiResponse<T> {
  ItemsResult?: {
    Items: T[];
    TotalResultCount?: number;
  };
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
}

export interface PaapiItem {
  ASIN: string;
  DetailPageURL?: string;
  ItemInfo?: {
    Title?: { DisplayValue?: string };
    ByLineInfo?: {
      Brand?: { DisplayValue?: string };
      Contributors?: Array<{ Name?: string; Role?: string }>;
    };
    Features?: { DisplayValues?: string[] };
    ProductInfo?: { ItemDimensions?: Record<string, unknown> };
  };
  Images?: {
    Primary?: {
      Large?: { URL?: string };
      Medium?: { URL?: string };
      Small?: { URL?: string };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount?: number;
        Currency?: string;
        DisplayAmount?: string;
      };
      MerchantInfo?: { Name?: string };
      DeliveryInfo?: {
        IsAmazonFulfilled?: boolean;
        IsFreeShippingEligible?: boolean;
      };
    }>;
  };
  CustomerReviews?: {
    Count?: number;
    StarRating?: { DoubleValue?: number };
  };
}

/** PA-API 可用资源列表（用于请求时指定 Resources 字段） */
export const PAAPI_RESOURCES = {
  ITEM_INFO_TITLE: "ItemInfo.Title",
  ITEM_INFO_BY_LINE: "ItemInfo.ByLineInfo",
  ITEM_INFO_FEATURES: "ItemInfo.Features",
  ITEM_INFO_PRODUCT_INFO: "ItemInfo.ProductInfo",
  OFFERS_LISTINGS: "Offers.Listings.Price",
  OFFERS_LISTINGS_MERCHANT: "Offers.Listings.MerchantInfo",
  OFFERS_LISTINGS_SAVING_BASIS: "Offers.Listings.SavingBasis",
  OFFERS_LISTINGS_DELIVERY: "Offers.Listings.DeliveryInfo",
  CUSTOMER_REVIEWS: "CustomerReviews.StarRating",
  CUSTOMER_REVIEWS_COUNT: "CustomerReviews.Count",
  IMAGES_PRIMARY: "Images.Primary.Medium",
  IMAGES_PRIMARY_LARGE: "Images.Primary.Large",
  BROWSE_NODE_INFO: "BrowseNodeInfo.BrowseNodes",
  DETAIL_PAGE_URL: "DetailPageURL",
} as const;
