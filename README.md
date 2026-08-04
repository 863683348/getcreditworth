# GetCreditWorth 🎧💰

> **Audible Credit Value Optimizer** — Find the best audiobooks to spend your credits on, backed by data.

**Live site:** [getcreditworth.com](https://getcreditworth.com)

---

## What Is This?

Every Audible subscriber knows the pain: you get one credit per month, and you want to make it count. But which book gives you the most value? A 5-hour novella costs the same credit as a 45-hour epic.

**GetCreditWorth** solves this with a transparent **Value Score** formula:

```
Value Score = (Duration in hours × Star Rating) / Price in USD
```

We've scored **338 audiobooks** across **61 categories** so you can instantly see which books are worth your credits and which ones you should buy directly.

---

## Features

### 🔢 Value Score Ranking
Every audiobook ranked by a fair, transparent formula. Higher score = better credit value.

### 📚 338 Audiobooks Analyzed
Covering Fantasy, Sci-Fi, Mystery, Romance, Non-Fiction, Business, Self-Help, and more.

### 🧮 Credit Calculator
Enter your credits and subscription plan to see the best books to spend them on, with real savings calculations.

### 📝 21+ Expert Guides
Data-driven blog posts covering credit strategy, plan comparisons, and genre deep dives.

### 📋 Curated Lists (10 Topics)
Hand-picked recommendations for every genre: Fantasy, Sci-Fi, Biography, Business, Classics, Horror, and more.

### 🔍 Category Exploration
Browse any of 61 genres with unique editorial descriptions and pro tips.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Rendering | SSG + ISR |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Content | MDX + Programmatic |
| Deployment | Vercel |
| Analytics | Google Analytics |
| Schema | JSON-LD (8 types) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/863683348/getcreditworth.git
cd getcreditworth

# Install
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

The dev server runs at `http://localhost:3000`.

---

## Project Structure

```
getcreditworth/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page (E-E-A-T)
│   ├── blog/               # 21 SEO-optimized blog posts
│   ├── books/              # 338 book detail pages
│   ├── calculator/         # Credit value calculator
│   ├── category/           # 61 category pages
│   ├── curated/            # 10 curated book lists
│   └── api/                # API routes
├── components/
│   ├── seo/                # JSON-LD Schema components
│   ├── layout/             # Header, Footer
│   └── ...                 # UI components
├── data/
│   ├── books.json          # 338 books with scores + descriptions
│   ├── curated-lists.json  # 10 curated lists
│   └── categories.json     # Category metadata
├── lib/
│   ├── api/controllers/    # Business logic layer
│   ├── calc/               # Value Score calculation
│   ├── data/               # Data access layer
│   ├── i18n/               # Client-side internationalization
│   ├── types.ts            # TypeScript types
│   └── utils/              # Affiliate links, formatting
└── scripts/                # Data pipeline scripts
```

---

## Data Pipeline

Books data is sourced via the **Amazon Product Advertising API (PAAPI)** and the **Audible API**:

1. `npm run fetch-books` — Fetch new releases and categories
2. `npm run update-prices` — Refresh prices via PAAPI
3. `npm run update-all` — Full data refresh

The pipeline runs daily via GitHub Actions to keep pricing current.

---

## SEO Architecture

| Schema Type | Coverage |
|------------|----------|
| Website + Organization | Global layout |
| Book + Product | 338 detail pages |
| FAQPage (differentiated) | 338 detail pages |
| Article (with author) | 21 blog posts |
| BreadcrumbList | Blog + Book + Category |
| AboutPage + Person | /about (E-E-A-T) |
| ItemList | Category + Curated pages |

All pages are **SSG pre-rendered** for instant load and optimal Core Web Vitals.

---

## Roadmap

- [x] 338 audiobooks with unique descriptions
- [x] FAQ Schema differentiation per book
- [x] E-E-A-T signals (Author + Person Schema)
- [x] 13 category pages with editorial content
- [x] 10 curated book lists
- [x] Calculator with tutorial content
- [ ] Dynamic OG image generation
- [ ] AggregateRating Schema enhancement
- [ ] Multi-language support (/zh)
- [ ] Programmatic blog from data pipeline

---

## Contributing

This is a solo project, but feedback and suggestions are welcome! Open an issue or submit a PR.

---

## License

MIT

---

## Disclaimer

GetCreditWorth is an **independent tool** and is not affiliated with, endorsed by, or sponsored by Audible or Amazon. We use affiliate links — if you purchase through our links, we may earn a commission at no extra cost to you. All book data is sourced from publicly available Amazon and Audible APIs.

---

<p align="center">
  <sub>Made with ❤️ for Audible subscribers who want to stop wasting credits.</sub>
</p>
