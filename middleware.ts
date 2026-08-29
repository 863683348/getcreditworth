import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 爬虫分层拦截中间件
 *
 * 策略：只拦「白嫖数据、不带来任何流量」的爬虫，放行所有能带来流量/曝光的对象。
 *
 * 必须放行的三类：
 *  1. 搜索引擎（Googlebot / Bingbot ...）—— 禁掉等于放弃搜索流量
 *  2. AI 搜索爬虫（OAI-SearchBot / PerplexityBot / Claude-SearchBot / ChatGPT-User）
 *     —— 会带来 AI 引荐流量，站内 GEO 优化（结构化数据、可引用内容）依赖它们
 *  3. 社交平台爬虫（facebookexternalhit / Twitterbot / LinkedInBot）
 *     —— 影响分享卡片；且 /api/og 已在 matcher 中整体排除，不受影响
 *
 * 拦截两类：
 *  1. AI 训练爬虫（GPTBot / ClaudeBot / CCBot / Google-Extended / Bytespider ...）
 *     —— 抓取仅用于模型训练，不会产生任何回访流量
 *  2. SEO 工具与裸抓取库（AhrefsBot / SemrushBot / scrapy / python-requests ...）
 *     —— 竞品分析或批量抓取，直接搬走站内数据
 *
 * 重要区分：GPTBot（训练）与 OAI-SearchBot（搜索）是两个不同的 UA，
 * 拦截前者不影响 ChatGPT 联网搜索引用本站内容。
 *
 * 调试：设置环境变量 BOT_BLOCK_DEBUG=1 可打印被拦截的请求（默认关闭，避免日志费用）。
 */

/** 需要拦截的 UA 特征（小写子串匹配） */
const BLOCKED_UA_PATTERNS: string[] = [
  // ---- AI 训练型：抓取不带来任何回访流量 ----
  "gptbot",
  "chatgptbot",
  "claudebot",
  "anthropic-ai",
  "ccbot",
  "google-extended",
  "applebot-extended",
  "meta-externalagent",
  "meta-externalfetcher",
  "bytespider",
  "amazonbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "diffbot",
  "omgili",
  "omgilibot",
  "youbot",
  "imagesiftbot",
  "timpibot",
  "ai2bot",

  // ---- SEO / 竞品分析工具：拿数据做分析和对标 ----
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "dotbot",
  "screaming frog",
  "screamingfrogseospider",
  "seokicks",
  "linkpadbot",
  "cocolyzebot",
  "serpstatbot",
  "sitecheckerbotc",
  "spyfu",
  "spyonweb",

  // ---- 裸抓取库 / 扫描器：非浏览器的批量抓取 ----
  "scrapy",
  "python-requests",
  "python-urllib",
  "go-http-client",
  "libwww-perl",
  "java/1.",
  "zgrab",
  "masscan",
];

const DEBUG = process.env.BOT_BLOCK_DEBUG === "1";

function blocked(matched: string, pathname: string): NextResponse {
  if (DEBUG) {
    console.log(`[bot-block] ${matched} ${pathname}`);
  }
  return new NextResponse("Forbidden", {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // 明确告知合规爬虫不要索引、不要跟随
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function middleware(request: NextRequest) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const { pathname } = request.nextUrl;

  // 空 UA：仅在 /api/ 下拦截，避免误伤部分合法客户端
  if (!ua) {
    return pathname.startsWith("/api/") ? blocked("empty-ua", pathname) : NextResponse.next();
  }

  for (const pattern of BLOCKED_UA_PATTERNS) {
    if (ua.includes(pattern)) {
      return blocked(pattern, pathname);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * 排除项说明：
     *  - _next/static、_next/image：构建产物
     *  - api/og：OG 图，社交平台分享卡片必须可抓
     *  - robots.txt、sitemap.xml：搜索引擎入口，必须可抓
     *  - 静态文件后缀：图片/字体/样式/脚本
     * 注意：未排除 .json，因此 /data/books-*.json 受本中间件保护，爬虫无法批量拉取。
     */
    "/((?!_next/static|_next/image|api/og|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|txt|xml)$).*)",
  ],
};
