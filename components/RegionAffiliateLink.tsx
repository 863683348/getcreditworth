/**
 * 区域感知的 Amazon 购买链接
 *
 * 内部读取 RegionProvider 的当前区域，生成带 ?region= 的中转链接：
 *   /api/redirect/{asin}?region={region} → 301 → 对应 Amazon 商店（TLD + tag）
 *
 * 适用于 server 组件（无法直接调用 useRegion）以及任何需要统一 Buy 链接的地方，
 * 确保整站 affiliate 链接都跟随用户选择的区域。
 */
"use client";

import type { ReactNode } from "react";
import { useRegion } from "@/components/RegionProvider";
import { buildRedirectUrl } from "@/lib/utils/affiliate";

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
