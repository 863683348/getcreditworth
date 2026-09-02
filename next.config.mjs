import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
    ],
  },
  // ---------------------------------------------------------------------------
  // SEO: 合并自我竞争页面（同主题多 URL 分散排名信号）
  //
  // 背景：2026-08-18 Google spam update 后全站展示量下跌 97.6%。GSC 显示退货/退款、
  // 取消会员两个主题各有 2 个 URL 同时竞争，合计 1,070 次展示被分散在 4 个 URL 上。
  // 合并后信号集中到主文，被合并页以 301 永久重定向传出权重。
  //
  // 注意：Next.js 的 redirects 在 filesystem / 动态路由之前匹配，
  // 因此即使 posts.tsx 中仍存在对应条目，重定向也优先生效。
  // ---------------------------------------------------------------------------
  async redirects() {
    return [
      // 退货/退款：主文 483 展示 / 排名 16.82；被合并页 193 展示 / 排名 15.25
      {
        source: "/blog/audible-return-policy-guide",
        destination: "/blog/audible-return-refund-policy",
        permanent: true,
      },
      // 取消会员：主文 315 展示 / 排名 24.43；被合并页 79 展示 / 排名 10.54
      // （被合并页排名更靠前但展示少，其独有内容「各套餐取消政策表 + 年付退款计算
      //   示例 + 挽留优惠」已并入主文，避免 301 后信息丢失）
      {
        source: "/blog/audible-cancellation-fees",
        destination: "/blog/how-to-cancel-audible-subscription",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // 客户端懒加载的全量书籍 JSON（prebuild 生成，替代原 force-static API 路由）。
      // 1 天新鲜 + 7 天 SWR；daily expand 每天更新时文件名不变，浏览器/CDN 最多拿 1 天前数据。
      {
        source: "/data/books-:file(list|compare).json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), display-capture=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'report-sample'",
              "style-src 'self' 'unsafe-inline' 'report-sample'",
              "img-src 'self' https://m.media-amazon.com https://images-na.ssl-images-amazon.com data: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "manifest-src 'self'",
            ].join("; "),
          },
        ],
      },
      // Embed/iframes denied
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      // #13 FOT 修复：Next.js 对 ISR 页面默认 max-age=0（每次回源验证 → ISR Reads/FOT 持续高）。
      // 所有公开页（含 sitemap.xml/robots.txt）加 1 天边缘缓存 + 7 天后台刷新。
      // 负向前瞻排除：/api（动态接口）、/favorites（用户收藏）、/compare（对比工具）。
      {
        source: "/:path((?!api|favorites|compare).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    extension: /\.(md|mdx)$/,
  },
});

export default withMDX(nextConfig);
