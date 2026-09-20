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
      // -----------------------------------------------------------------------
      // 2026-09-11：清掉 7 个「站内被大量引用但已 404」的历史 slug（GSC 仍有残留
      // 展示，如 /blog/audible-credits-expiration-policy 近 28 天 94 展示 / 排名
      // 11.39，却返回 404）。全部 301 到现存最接近的正文，收回残留索引权重。
      // -----------------------------------------------------------------------
      {
        source: "/blog/audible-credits-expiration-policy",
        destination: "/blog/how-to-spend-audible-credits-before-expiry",
        permanent: true,
      },
      {
        source: "/blog/do-audible-credits-expire",
        destination: "/blog/how-to-spend-audible-credits-before-expiry",
        permanent: true,
      },
      {
        source: "/blog/stop-audible-credits-expiring",
        destination: "/blog/how-to-spend-audible-credits-before-expiry",
        permanent: true,
      },
      {
        source: "/blog/audible-credit-expiration-extension",
        destination: "/blog/how-to-spend-audible-credits-before-expiry",
        permanent: true,
      },
      {
        source: "/blog/audible-pause-membership-keep-credits",
        destination: "/blog/how-to-cancel-audible-and-keep-your-books",
        permanent: true,
      },
      {
        source: "/blog/best-fantasy-audiobooks-for-credits",
        destination: "/blog/best-epic-fantasy-audiobooks-over-40-hours",
        permanent: true,
      },
      {
        source: "/blog/how-to-sample-audible-books",
        destination: "/blog/how-to-get-a-free-30-day-audible-trial",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // 1-B/1-D（2026-09-20）：客户端懒加载的数据分片。
      // 文件名带 8 位内容 md5（books-chunk-000.a1b2c3d4.json），内容变则文件名变，
      // 因此可安全用 immutable —— 浏览器与 Vercel Edge 可永久缓存，永不回源。
      // 这同时解决 Deployment Storage：文件名稳定 → 跨部署复用同一对象 → 不重复计入配额。
      {
        source: "/data/books-(chunk|idxchunk|cmpchunk)-:n([0-9]{3}).:hash([0-9a-f]{8}).json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // 兼容旧版单文件 compare（若某次回滚仍产出该文件名）
      {
        source: "/data/books-compare.:hash([0-9a-f]{8}).json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // manifest 是唯一入口，文件名固定但内容每天变（8KB）→ 短缓存 + 长 SWR。
      // 浏览器最长可容忍 1 天前清单（分片 URL 变化只影响是否拿到当天新增书）。
      {
        source: "/data/books-manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
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
