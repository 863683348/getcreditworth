import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

/**
 * 分层 robots 策略
 *
 * 与 middleware.ts 的 UA 硬拦截配合：robots.txt 是「声明式」约定，
 * 遵守规则的爬虫会自行退出；不遵守的由 middleware 直接 403。
 *
 * 放行（带来流量/曝光）：
 *  - 搜索引擎：Googlebot / Bingbot / DuckDuckBot ...
 *  - AI 搜索：OAI-SearchBot / ChatGPT-User / Claude-User / Claude-SearchBot / PerplexityBot
 *  - 社交平台：facebookexternalhit / Twitterbot / LinkedInBot（分享卡片需要）
 *
 * 拦截（白嫖数据）：
 *  - AI 训练：GPTBot / ClaudeBot / CCBot / Google-Extended / Applebot-Extended ...
 *  - SEO 工具：AhrefsBot / SemrushBot / MJ12bot / DotBot ...
 *
 * 注意：GPTBot（训练）与 OAI-SearchBot（搜索）是不同 UA，
 * 拦截 GPTBot 不影响 ChatGPT 联网搜索引用本站。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ---- 放行：搜索引擎（禁止抓 /api/）----
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
        disallow: ['/api/'],
      },

      // ---- 放行：AI 搜索与用户触发型（会带来 AI 引荐流量）----
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-User',
          'Claude-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
        ],
        allow: '/',
        disallow: ['/api/'],
      },

      // ---- 放行：社交平台（分享卡片依赖 OG 抓取）----
      {
        userAgent: [
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'Slackbot',
          'Discordbot',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: '/',
        disallow: ['/api/'],
      },

      // ---- 拦截：AI 训练 ----
      {
        userAgent: [
          'GPTBot',
          'ChatGPTBot',
          'ClaudeBot',
          'anthropic-ai',
          'CCBot',
          'Google-Extended',
          'Applebot-Extended',
          'meta-externalagent',
          'meta-externalfetcher',
          'Bytespider',
          'Amazonbot',
          'cohere-ai',
          'Diffbot',
          'Omgilibot',
          'YouBot',
          'ImagesiftBot',
          'Timpibot',
          'AI2Bot',
        ],
        disallow: '/',
      },

      // ---- 拦截：SEO / 竞品分析工具 ----
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'Screaming Frog SEO Spider',
          'SEOkicks',
          'LinkpadBot',
          'Cocolyzebot',
          'Serpstatbot',
          'SiteCheckerBotC',
          'Spyfu',
        ],
        disallow: '/',
      },

      // ---- 默认规则 ----
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
