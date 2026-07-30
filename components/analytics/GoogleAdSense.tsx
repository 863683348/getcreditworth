"use client";

import Script from "next/script";

/**
 * AdSense 发布商 ID（Client ID）
 * 环境变量 NEXT_PUBLIC_ADSENSE_CLIENT 可覆盖；缺省使用站点主账号。
 * 注意：ads.txt 中的 pub-XXXX 与这里的 ca-pub-XXXX 是同一账号，
 * 前缀 ca- 是 AdSense 前端脚本要求的格式。
 */
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9043592188127461";

/**
 * Google AdSense 自动广告（Auto Ads）加载器。
 *
 * 自动广告由 Google 在账号后台开启后，自动在页面合适位置插入广告，
 * 无需手动创建广告单元（ad slot）。适合内容站快速接入。
 *
 * 若需要在特定位置手动放置广告位，请使用同目录的 AdUnit 组件。
 */
export function GoogleAdSense() {
  if (!ADSENSE_CLIENT) return null;

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
