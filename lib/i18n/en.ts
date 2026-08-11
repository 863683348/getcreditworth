/**
 * Translations Dictionary - English
 * All English UI strings
 */
export const en = {
  // Header / Nav
  nav: {
    topBooks: 'Top Books',
    allBooks: 'All Books',
    curatedLists: 'Curated Lists',
    categories: 'Categories',
    series: 'Series',
    calculator: 'Calculator',
    blog: 'Blog',
    favorites: 'Favorites',
    compare: 'Compare',
    dataset: 'Dataset',
    toggleMenu: 'Toggle menu',
    switchToChinese: 'Switch to Chinese',
    switchToEnglish: 'Switch to English',
  },

  // Header CTA
  header: {
    freeTrial: 'Free 30-Day Trial',
  },

  // Hero CTA (Home page)
  hero: {
    ctaPrimary: 'Start Your Free 30-Day Trial',
    ctaSecondary: 'Get 1 Free Book',
    ctaNote: 'Cancel anytime. Keep the audiobook even if you cancel.',
    statBooksLabel: 'Books Analyzed',
    statCategoriesLabel: 'Categories',
    statBountyLabel: 'Earned per Referral',
  },

  // Inline trial banner (Book detail page)
  trialBanner: {
    title: 'Not an Audible member yet?',
    subtitle: 'Start a free 30-day trial and get 1 audiobook on us. Cancel anytime —your book is yours to keep.',
    cta: 'Start Free Trial',
    disclaimer: 'Affiliate link —we may earn a commission at no extra cost to you.',
  },

  // Trial recommendation card (Book detail page)
  trialRecommend: {
    title: 'Use your free credit on this book',
    reason1: 'A 30-day trial gives you 1 credit —worth $14.95 toward any audiobook',
    reason2: 'This book is priced above the credit value, so you\'d save money versus paying cash',
    reason3: 'You keep the audiobook forever, even if you cancel before day 30',
    reason4: 'No commitment —cancel in one click from your Audible dashboard',
    cta: 'Start Free Trial →Get 1 Book',
  },

  // Footer
  footer: {
    description: 'Audible credit value optimizer. Find audiobooks worth your credits with data-driven value scores.',
    explore: 'Explore',
    topRated: 'Top Rated Books',
    allBooks: 'All Books',
    creditCalculator: 'Credit Calculator',
    guidesBlog: 'Guides & Blog',
    disclosure: 'Disclosure',
    disclosureText: 'As an Amazon Associate, {name} earns from qualifying purchases. Audible is a trademark of Amazon.com, Inc. or its affiliates. This site is not affiliated with or endorsed by Amazon. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates in the United States and other countries.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact',
    about: 'About',
    howItWorks: 'How It Works',
    amazon: 'Amazon',
    allRightsReserved: 'All rights reserved.',
  },

  // Home page
  home: {
    title: 'How Much Is an Audible Credit Worth? Top Value-Score Audiobooks',
    subtitle: 'Ranked by Value Score —a formula combining listening hours, rating, and price to find the best audiobooks to spend your Audible credits on.',
    howCalculated: 'How is Value Score calculated?',
    formulaLabel: 'The formula:',
    formula: 'Value Score = (Duration in hours × Star Rating) / Price in USD',
    bullet1: 'Higher scores mean better value for your credit',
    bullet2: 'Long, highly-rated books at higher prices are the best credit investments',
    bullet3: 'A $35 audiobook with 4.8 stars and 45 hours scores much higher than a $15 short book',
    rankedList: 'Ranked #1 to #{limit} of #{total}',
    emptyMessage: 'No books match your filters. Try adjusting them.',
  },

  // Books list page
  booksPage: {
    title: 'All Audiobooks',
    subtitle: 'Browse every audiobook ranked by Value Score. Use filters to find the perfect match for your listening goals.',
    pageTitle: 'All Audiobooks - Browse and Compare Value Scores',
    pageDescription: 'Browse all audiobooks with Value Scores. Filter by duration, rating, and category to find the best books for your Audible credits.',
    curatedTitle: 'Curated Lists',
    viewAll: 'View all',
  },

  // Calculator page

  // Pagination
  pagination: {
    showing: 'Showing {from}-{to} of {total}',
    page: 'Page {page}',
    prev: 'Previous',
    next: 'Next',
    perPage: 'Per page',
  },
  calculatorPage: {
    title: 'Audible Credit Calculator',
    subtitle: 'Enter your credits and subscription plan to see the best audiobooks to spend them on, based on Value Score analysis.',
    pageTitle: 'Credit Calculator - Maximize Your Audible Credit Value',
    pageDescription: 'Calculate how much your Audible credits are worth and find the best books to spend them on. Free credit value optimizer tool.',
    yourSubscription: 'Your Subscription',
    numberOfCredits: 'Number of Credits',
    audiblePlan: 'Audible Plan',
    creditsToSpend: 'Credits to spend:',
    creditValueEach: 'Credit value (each):',
    totalCreditValue: 'Total credit value:',
    recommendedBooks: 'Recommended Books for Your {credits} {credits, plural, one {Credit} other {Credits}}',
    valueAnalysis: 'Value Analysis',
    totalBookValue: 'Total Book Value',
    creditCost: 'Credit Cost',
    yourSavings: 'Your Savings',
    savingsPercent: '{value}% savings',
    noSavings: 'No savings',
    savingsSummary: 'By spending {credits} {credits, plural, one {credit} other {credits}} on these recommended books, you get {total} worth of audiobooks for {creditCost} in credit value. That\'s a savings of {savings}.',
    noSavingsSummary: 'Based on current recommendations, your credits may be better spent on more expensive audiobooks. Consider browsing the full list for alternatives.',
    fullList: 'full list',

    similarAudiobooksTitle: 'Similar Audiobooks Worth Your Credit',
    guideTitle: 'How the Audible Credit Calculator Works',
    guideP1: 'Every Audible credit is worth {creditValue} - this is your monthly cost. But not all books give you the same value.',
    guideP2: 'This calculator uses the Value Score formula:',
    guideFormula: 'Value Score = (Duration in hours x Star Rating) / Price in USD',
    guideP3: 'Enter your credits below and see the best books to spend them on.',
    exampleTitle: 'Real Example: How Much Can You Save?',
    exampleP1: 'Let us walk through a real example with {credits} credits.',
    exampleCalcTitle: 'Example Calculation:',
    exampleCalc1: '{credits} credits x {creditValue} = {total} {totalValueLabel}',
    exampleCalc2: 'If you pick {n} books worth {price} each = {totalValue} retail value',
    totalValueLabel: 'total value',
    exampleCalc3: 'Your savings: {savings}',
    exampleCalc4: 'Cost per hour: as low as {rate}/hour',
    exampleP2: 'The recommendation engine picks the books that maximize your savings.',
    criteriaTitle: 'What Makes a Book Worth a Credit?',
    tableScenario: 'Scenario',
    tableUseCredit: 'Use Credit?',
    tableWhy: 'Why',
    tableExpensive: 'Book costs > {price}',
    tableExpensiveResult: 'Yes',
    tableExpensiveWhy: 'You save money vs buying directly',
    tableCheap: 'Book costs < {price}',
    tableCheapResult: 'No',
    tableCheapWhy: 'Buy directly, save the credit for a pricier book',
    tableShort: 'Short book (< 8 hours)',
    tableShortResult: 'Consider',
    tableShortWhy: 'Cost per hour will be high',
    tableLong: 'Long book (> 20 hours)',
    tableLongResult: 'Yes',
    tableLongWhy: 'Excellent cost per hour',
    tableRated: 'Highly rated (4.5+ stars)',
    tableRatedResult: 'Yes',
    tableRatedWhy: 'Quality listening + great value',
    browseTop: 'Browse Top Audiobooks',
    bestLong: 'Best Long Audiobooks (30h+)',
    classicPicks: 'Classic Literature Picks',
  },

  // About page
  aboutPage: {
    title: 'About {name}',
    intro: '{name} is a free tool that helps Audible subscribers find the best audiobooks to spend their credits on. Instead of guessing, you get data-driven recommendations based on a transparent Value Score formula.',
    howItWorks: 'How It Works',
    howItWorksDesc: 'Every audiobook is scored using this formula:',
    howItWorksExplain: 'This formula rewards books that give you more listening time at higher quality. A 45-hour epic rated 4.8 stars at $35 will score far higher than a 6-hour novella at $15 —because your credit is worth the same {value} either way.',
    whatYouGet: 'What You Get',
    feature1: 'Value Score ranking —every audiobook ranked by true credit value',
    feature2: 'Credit Calculator —see exactly how much your credits are worth',
    feature3: 'Curated lists —hand-picked books by genre and goal',
    feature4: 'Cost per hour —know exactly what each listening hour costs',
    affiliateTitle: 'Affiliate Disclosure',
    affiliateDesc: '{name} is a participant in the Amazon Associates Program. As an Amazon Associate, we earn from qualifying purchases. This does not affect the price you pay, and it helps us keep this tool free. Our recommendations are based on data, not affiliate commissions —we score every book the same way.',
    dataSources: 'Data Sources',
    dataSourcesDesc: 'Book data (prices, ratings, runtime) is sourced from the Amazon Product Advertising API 5.0 and updated regularly. Value Scores are calculated by our algorithm and may differ from other ranking systems.',
    browseTopBooks: 'Browse Top Books',
    tryCalculator: 'Try the Calculator',
  },

  // BookCard / BookList
  bookCard: {
    useCredit: 'Use a Credit',
    details: 'Details',
    by: 'by',
    perHour: '/h',
    coverAlt: 'Cover of {title}',
  },

  // SearchBar
  search: {
    placeholder: 'Search by title, author, or narrator...',
    ariaLabel: 'Search audiobooks',
  },

  // FilterBar
  filter: {
    allDurations: 'All Durations',
    allRatings: 'All Ratings',
    allCategories: 'All Categories',
    books: 'books',
    sortBy: 'Sort by',
    valueScore: 'Value Score',
    rating: 'Rating',
    duration: 'Duration',
    price: 'Price',
    ascending: 'Ascending',
    descending: 'Descending',
  },

  // View toggle
  viewToggle: {
    card: 'Card View',
    table: 'Table View',
    ariaLabel: 'Switch view mode',
  },

  // BookTable
  table: {
    rank: 'Rank',
    title: 'Title',
    author: 'Author',
    duration: 'Duration',
    rating: 'Rating',
    reviews: 'Reviews',
    price: 'Price',
    valueScore: 'Value Score',
    costPerHour: 'Cost/Hr',
    action: 'Action',
    buy: 'Buy',
  },

  // Empty state
  empty: {
    noResults: 'No books found matching your filters.',
  },

  // Blog list page
  blogPage: {
    title: 'Guides & Tips',
    subtitle: 'Learn how to maximize your Audible credit value with data-driven guides and recommendations.',
  },

  // Blog detail page
  blogDetail: {
    allArticles: 'All Articles',
    readyToFind: 'Ready to find your next audiobook?',
    browseData: 'Browse our data-driven rankings to maximize your credit value.',
    viewTopBooks: 'View Top Books',
  },

  // Curated lists page
  curatedPage: {
    title: 'Curated Audiobook Lists',
    subtitle: 'Hand-picked audiobooks for every genre and listening goal. Each book is selected for maximum credit value and listening quality.',
    booksCount: '{count} books',
    updated: 'Updated {date}',
  },

  // Curated detail page
  curatedDetail: {
    allLists: 'All Curated Lists',
    updated: 'Updated {date}',
    booksCount: '{count} books',
  },

  // Book detail page
  bookDetail: {
    backToTop: 'Back to Top Books',
    rating: 'Rating',
    duration: 'Duration',
    price: 'Price',
    creditWorth: 'Credit Worth',
    reviews: '{count} reviews',
    useCredit: 'Use a Credit on Audible',
    narratedBy: 'Narrated by',
    publisher: 'Publisher',
    released: 'Released',
    categories: 'Categories',
    similarAudiobooksTitle: 'Similar Audiobooks Worth Your Credit',
    recommendedCredit: 'Recommended: Use a credit.',
    considerBuying: 'Consider buying directly.',
    recommendedDesc: 'This book costs {price} ({percent}% more than a credit\'s {creditValue} value). You save {savings} by using a credit.',
    considerBuyingDesc: 'This book costs {price} which is less than a credit\'s value ({creditValue}). Save your credit for a more expensive book.',
    coverAlt: 'Cover of {title}',
    lowValueTitle: 'Low credit value — buy directly instead',
    lowValueDesc: 'Value Score {vs} is below 2. This book is short relative to its price, so spending a credit here wastes {waste} of credit value. Buy it directly on Amazon and save your credit for a longer book.',
    lowValueAction: 'Buy on Amazon directly',
    lowValueAlt: 'Browse high-value books instead',
  },
  // FAQ
  faq: {
    q1: "How is the Audible Credit Value Score calculated?",
    a1: "Value Score = (Duration in hours x Star Rating) / Price in USD. This rewards long, highly-rated books that give you the most listening time per dollar.",
    q2: "What are the best audiobooks to spend credits on?",
    a2: "The best audiobooks for your Audible credits are typically longer titles (20+ hours) with high ratings (4.5+ stars) priced above 20 USD.",
    q3: "How much is an Audible credit worth?",
    a3: "Each Audible credit is worth approximately 14.95 USD with the Premium Plus plan.",
    q4: "Is an Audible membership worth it?",
    a4: "An Audible membership is worth it if you listen to at least one audiobook per month. With credits worth 14.95 each, heavy listeners get exceptional value.",
  },
};

export type TranslationKeys = typeof en;
