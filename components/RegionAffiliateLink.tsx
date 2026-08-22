/**
 * 区域感知的 Audible 购买链接
 *
 * 内部读取 RegionProvider 的当前区域，生成带 affiliate tag 的 Audible 产品页直链：
 *   https://www.audible.{tld}/pd/{asin}?tag={tag} → 直达该书产品页（少一跳）
 *
 * 适用于 server 组件（无法直接调用 useRegion）以及任何需要统一 Buy 链接的地方，
 * 确保整站 affiliate 链接都跟随用户选择的区域。
 */
"use client";

import type { ReactNode } from "react";
import { useRegion } from "@/components/RegionProvider";
import { buildAudibleProductUrl } from "@/lib/utils/affiliate";

interface RegionAffiliateLinkProps {
  asin: string;
  className?: string;
  children: ReactNode;
}

export function RegionAffiliateLink({ asin, className, children }: RegionAffiliateLinkProps) {
  const { region } = useRegion();
  return (
    <a
      href={buildRedirectUrl(asin, region)}
      rel="nofollow sponsored"
      className={className}
    >
      {children}
    </a>
  );
}
