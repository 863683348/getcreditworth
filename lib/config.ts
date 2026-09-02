/**
 * 站点全局配置
 * 集中管理，避免硬编码散落各处
 */

export const SITE_CONFIG = {
  name: 'GetCreditWorth',
  title: 'GetCreditWorth - Audible Credit Value Optimizer',
  description:
    'Find the best audiobooks to spend your Audible credits on. Compare value scores, cost per hour, and credit worth to maximize every credit.',
  url: 'https://getcreditworth.com',
  locale: 'en_US',
  twitter: '@getcreditworth',
} as const;

export const AUDIBLE_CREDIT_VALUE = 14.95; // 1 积分等价美元

/**
 * P0-2: 低质量书籍页 noindex 门禁（对抗 2026-08-18 spam update 薄内容判定）
 * 仅对「真正低质」页 noindex，避免误伤整站信号：
 *  - requireDescription: 缺独特编辑描述（模板薄内容）→ noindex
 *  - minStarRating: 星标低于阈值（劣质书）→ noindex
 *  - zeroReviewIsLowQuality: 评价数为 0（占位/未抓取数据）→ noindex
 * 阈值可配置；默认保守，仅约 1.6% 书籍（缺描述 82 + 星标<3 的 53）命中，
 * 不会把整站误判为薄内容。需要更激进收紧时改此处即可。
 */
export const LOW_QUALITY_BOOK = {
  requireDescription: true,
  minStarRating: 3,
  zeroReviewIsLowQuality: true,
} as const;

export const NAV_ITEMS = [
  { label: 'Top Books', href: '/', icon: 'Trophy' as const },
  { label: 'All Books', href: '/books', icon: 'BookOpen' as const },
  { label: 'Curated Lists', href: '/curated', icon: 'ListChecks' as const },
  { label: 'Categories', href: '/category', icon: 'FolderOpen' as const },
  { label: 'Series', href: '/series', icon: 'BookOpen' as const },
  { label: 'Calculator', href: '/calculator', icon: 'Calculator' as const },
  { label: 'Blog', href: '/blog', icon: 'FileText' as const },
  { label: 'Guides', href: '/guide/audible-credit-value', icon: 'Compass' as const },
  { label: 'Favorites', href: '/favorites', icon: 'Bookmark' as const },
  { label: 'Compare', href: '/compare', icon: 'GitCompare' as const },
] as const;

export const FILTER_OPTIONS = {
  duration: [
    { label: 'All Durations', value: 'all' },
    { label: '< 8 hours', value: '0-8' },
    { label: '8 - 20 hours', value: '8-20' },
    { label: '20 - 40 hours', value: '20-40' },
    { label: '> 40 hours', value: '40-999' },
  ],
  rating: [
    { label: 'All Ratings', value: '0' },
    { label: '4.0+', value: '4.0' },
    { label: '4.5+', value: '4.5' },
  ],
} as const;
