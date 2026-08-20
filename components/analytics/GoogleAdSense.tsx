"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * AdSense 发布商 ID（Client ID）
 * 环境变量 NEXT_PUBLIC_ADSENSE_CLIENT 可覆盖；缺省使用站点主账号。
 * 注意：ads.txt 中的 pub-XXXX 与这里的 ca-pub-XXXX 是同一账号，
 * 前缀 ca- 是 AdSense 前端脚本要求的格式。
 */
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9043592188127461";

/**
 * Auto Ads 收敛策略（P0-3，桌面 CWV）：
 * 自动广告由 Google 后台在页面随机注入位置，无法预留高度，是页面
 * CLS（累积布局偏移）的主要来源。为了让桌面端 Core Web Vitals 达标
 * （桌面排名 25.5 远差于移动 11.2 的根因之一），这里把 Auto Ads 收敛到
 * 高浏览价值的内容页加载：
 *   - 加载（有手动/自动广告变现 + 长滚动页面）：
 *     /books、/books/*、/blog、/blog/*、/curated、/category、/compare
 *   - 不加载（交互密集/短页/品牌页，避免广告插入引起布局抖动）：
 *     /（首页）、/calculator、/about、/all-books 等
 */
const CONTENT_PAGE_PREFIXES = ["/books", "/blog", "/curated", "/category", "/compare"];

/** 全站手动广告位尚未配置（slot 为空）时，是否仍允许 Auto Ads 兜底变现 */
const FALLBACK_AUTO_ADS_ON_CONTENT_PAGES = true;

function isContentPage(pathname: string): boolean {
  return CONTENT_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Google AdSense 自动广告（Auto Ads）加载器，按页面收敛。
 *
 * 手动广告位（AdUnit）就绪后可把 FALLBACK 关掉，改用手动 slot（已预留 minHeight，
 * 不产生 CLS）。
 */
export function GoogleAdSense() {
  const pathname = usePathname() || "/";
  if (!ADSENSE_CLIENT) return null;

  const shouldLoad =
    FALLBACK_AUTO_ADS_ON_CONTENT_PAGES && isContentPage(pathname);

  if (!shouldLoad) return null;

  return (
    <Script
      id="adsbygoogle-client"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
