/**
 * 翻译字典 - 中文
 * 所有界面文案的中文版本
 */
import type { TranslationKeys } from './en';

export const zh: TranslationKeys = {
  // Header / Nav
  nav: {
    topBooks: '排行',
    allBooks: '全部',
    curatedLists: '榜单',
    calculator: '计算器',
    blog: '博客',
    favorites: '收藏',
    toggleMenu: '切换菜单',
    switchToChinese: '切换到中文',
    switchToEnglish: 'Switch to English',
  },

  // Header CTA
  header: {
    freeTrial: '免费 30 天试用',
  },

  // Hero CTA (Home page)
  hero: {
    ctaPrimary: '开启免费 30 天试用',
    ctaSecondary: '免费领 1 本有声书',
    ctaNote: '随时可取消。即使取消，你领到的有声书也永久保留。',
    statBooksLabel: '已分析书籍',
    statCategoriesLabel: '分类数',
    statBountyLabel: '每次推荐赚取',
  },

  // Inline trial banner (Book detail page)
  trialBanner: {
    title: '还不是 Audible 会员？',
    subtitle: '开启免费 30 天试用，我们送你 1 本有声书。随时可取消 —— 那本书永远属于你。',
    cta: '开启免费试用',
    disclaimer: '联盟链接 —— 我们可能获得佣金，对你无任何额外费用。',
  },

  // Trial recommendation card (Book detail page)
  trialRecommend: {
    title: '用你的免费积分换这本书',
    reason1: '30 天试用送你 1 个积分 —— 价值 $14.95，可兑换任何有声书',
    reason2: '此书价格高于积分价值，用积分比现金购买更划算',
    reason3: '有声书永远属于你，即使在第 30 天前取消也会保留',
    reason4: '零承诺 —— 在 Audible 后台一键即可取消',
    cta: '开启免费试用 → 领 1 本书',
  },

  // Footer
  footer: {
    description: 'Audible 积分价值优化器。用数据驱动的价值评分，找到最值得花积分的有声书。',
    explore: '探索',
    topRated: '高分书籍',
    allBooks: '全部书籍',
    creditCalculator: '积分计算器',
    guidesBlog: '指南与博客',
    disclosure: '声明',
    disclosureText: '作为亚马逊联盟成员，{name} 从合格购买中赚取佣金。Audible 是 Amazon.com, Inc. 或其关联公司的商标。本站不隶属于亚马逊，也未获亚马逊认可。',
    about: '关于',
    howItWorks: '工作原理',
    amazon: '亚马逊',
    allRightsReserved: '保留所有权利。',
  },

  // Home page
  home: {
    title: 'Audible 有声书价值排行榜',
    subtitle: '按价值评分排序 —— 综合收听时长、评分和价格，找到最值得花 Audible 积分的有声书。',
    howCalculated: '价值评分如何计算？',
    formulaLabel: '计算公式：',
    formula: '价值评分 = (时长小时 × 星级评分) / 美元价格',
    bullet1: '分数越高，你的积分越划算',
    bullet2: '长篇高评分高价书是最佳积分投资',
    bullet3: '一本 45 小时、4.8 星、$35 的有声书评分远高于 $15 的短篇',
    rankedList: '排名 #1 至 #{limit}',
    emptyMessage: '没有符合条件的书籍。请调整筛选条件。',
  },

  // Books list page
  booksPage: {
    title: '全部有声书',
    subtitle: '浏览全部 {count} 本有声书。使用筛选器找到适合你收听目标的书籍。',
    pageTitle: '全部有声书 - 浏览和比较价值评分',
    pageDescription: '浏览所有有声书的价值评分。按时长、评分和分类筛选，找到最适合 Audible 积分的书籍。',
  },

  // Calculator page
  calculatorPage: {
    title: 'Audible 积分计算器',
    subtitle: '输入你的积分数和订阅方案，查看最值得花积分的有声书（基于价值评分分析）。',
    pageTitle: '积分计算器 - 最大化你的 Audible 积分价值',
    pageDescription: '计算你的 Audible 积分价值，找到最值得花积分的书籍。免费的积分价值优化工具。',
    yourSubscription: '你的订阅',
    numberOfCredits: '积分数',
    audiblePlan: 'Audible 方案',
    creditsToSpend: '待花积分：',
    creditValueEach: '单个积分价值：',
    totalCreditValue: '积分总价值：',
    recommendedBooks: '为你的 {credits} 个积分推荐的书籍',
    valueAnalysis: '价值分析',
    totalBookValue: '书籍总价值',
    creditCost: '积分成本',
    yourSavings: '你的节省',
    savingsPercent: '节省 {value}%',
    noSavings: '无节省',
    savingsSummary: '将 {credits} 个积分花在这些推荐书上，你将获得价值 {total} 的有声书，而积分成本仅 {creditCost}。即节省 {savings}。',
    noSavingsSummary: '根据当前推荐，你的积分可能更适合花在更贵的有声书上。建议浏览完整列表寻找替代方案。',
    fullList: '完整列表',
  },

  // About page
  aboutPage: {
    title: '关于 {name}',
    intro: '{name} 是一个免费工具，帮助 Audible 订阅者找到最值得花积分的有声书。不再是猜测，而是基于透明的价值评分公式获得数据驱动的推荐。',
    howItWorks: '工作原理',
    howItWorksDesc: '每本有声书都用以下公式评分：',
    howItWorksExplain: '此公式奖励那些以更高质量提供更多收听时间的书。一本 45 小时、4.8 星、$35 的史诗书评分会远高于 $15 的 6 小时中篇小说 —— 因为你的积分价值始终是 {value}。',
    whatYouGet: '你将获得',
    feature1: '价值评分排行 —— 每本有声书按真实积分价值排名',
    feature2: '积分计算器 —— 精确看到你的积分价值',
    feature3: '精选榜单 —— 按类型和目标人工挑选的书籍',
    feature4: '每小时成本 —— 精确知道每小时收听成本',
    affiliateTitle: '联盟声明',
    affiliateDesc: '{name} 是亚马逊联盟计划的参与者。作为亚马逊联盟成员，我们从合格购买中赚取佣金。这不影响你支付的价格，同时帮助我们保持工具免费。我们的推荐基于数据而非联盟佣金 —— 我们用同样的方式为每本书评分。',
    dataSources: '数据来源',
    dataSourcesDesc: '书籍数据（价格、评分、时长）来自 Amazon Product Advertising API 5.0 并定期更新。价值评分由我们的算法计算，可能与其他排名系统不同。',
    browseTopBooks: '浏览高分书籍',
    tryCalculator: '试用计算器',
  },

  // BookCard / BookList
  bookCard: {
    useCredit: '花积分',
    details: '详情',
    by: '作者：',
    perHour: '/小时',
    coverAlt: '{title} 的封面',
  },

  // SearchBar
  search: {
    placeholder: '按书名、作者或朗读者搜索...',
    ariaLabel: '搜索有声书',
  },

  // FilterBar
  filter: {
    allDurations: '全部时长',
    allRatings: '全部评分',
    allCategories: '全部分类',
    books: '本书',
    sortBy: '排序方式',
    valueScore: '价值评分',
    rating: '评分',
    duration: '时长',
    price: '价格',
    ascending: '升序',
    descending: '降序',
  },

  // View toggle
  viewToggle: {
    card: '卡片视图',
    table: '列表视图',
    ariaLabel: '切换视图模式',
  },

  // BookTable
  table: {
    rank: '排名',
    title: '书名',
    author: '作者',
    duration: '时长',
    rating: '评分',
    reviews: '评论数',
    price: '价格',
    valueScore: '价值评分',
    costPerHour: '每小时成本',
    action: '操作',
    buy: '购买',
  },

  // Empty state
  empty: {
    noResults: '未找到符合条件的书籍。',
  },

  // Blog list page
  blogPage: {
    title: '指南与技巧',
    subtitle: '学习如何用数据驱动的指南和推荐，最大化你的 Audible 积分价值。',
  },

  // Blog detail page
  blogDetail: {
    allArticles: '全部文章',
    readyToFind: '准备好找下一本有声书了吗？',
    browseData: '浏览我们的数据驱动排行，最大化你的积分价值。',
    viewTopBooks: '查看高分书籍',
  },

  // Curated lists page
  curatedPage: {
    title: '精选有声书榜单',
    subtitle: '为每种类型和收听目标人工挑选的有声书。每本书都为最大积分价值和收听质量而选。',
    booksCount: '{count} 本书',
    updated: '更新于 {date}',
  },

  // Curated detail page
  curatedDetail: {
    allLists: '全部精选榜单',
    updated: '更新于 {date}',
    booksCount: '{count} 本书',
  },

  // Book detail page
  bookDetail: {
    backToTop: '返回排行',
    rating: '评分',
    duration: '时长',
    price: '价格',
    creditWorth: '积分价值',
    reviews: '{count} 条评论',
    useCredit: '在 Audible 花积分',
    narratedBy: '朗读者',
    publisher: '出版社',
    released: '发行日期',
    categories: '分类',
    recommendedCredit: '推荐：使用积分。',
    considerBuying: '建议直接购买。',
    recommendedDesc: '此书价格为 {price}（比积分价值 {creditValue} 高 {percent}%）。使用积分可节省 {savings}。',
    considerBuyingDesc: '此书价格为 {price}，低于积分价值（{creditValue}）。把积分留给更贵的书吧。',
    coverAlt: '{title} 的封面',
  },
};
