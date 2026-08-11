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
    ];
  },
};

const withMDX = createMDX({
  options: {
    extension: /\.(md|mdx)$/,
  },
});

export default withMDX(nextConfig);
