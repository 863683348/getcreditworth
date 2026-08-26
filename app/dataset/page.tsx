import { getAllBooks, getBookCount } from "@/lib/data/books";
import { buildCanonicalUrl } from "@/lib/utils/affiliate";
import { AUDIBLE_CREDIT_VALUE, SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  const total = getBookCount().toLocaleString();
  return {
    title: `Audible Audiobooks Dataset (${total}+ Books) - Free CSV Download | GetCreditWorth`,
    description:
      `Download our free open dataset of ${total}+ Audible audiobooks with Value Score, cost per hour, credit worth ratio, ratings, and runtime. CSV format, updated 2026, MIT licensed.`,
    keywords: [
      'audible books dataset csv',
      'audible audiobook data download',
      'audible value score dataset',
      'audiobook credit value data',
      'audible books open dataset',
      'audible credit worth csv',
      'best audiobooks dataset',
      'audiobook cost per hour data',
    ],
    alternates: { canonical: buildCanonicalUrl("/dataset") },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `Audible Audiobooks Dataset (${total}+ Books) - Free CSV Download`,
      description:
        `Free open dataset of ${total}+ Audible audiobooks with Value Score, cost per hour, and credit worth. CSV format, MIT licensed.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Audible Audiobooks Dataset (${total}+ Books) - Free CSV Download`,
      description:
        `${total}+ Audible audiobooks with Value Score, cost per hour, and credit worth. Free CSV download, MIT licensed.`,
    },
  };
}

export default function DatasetPage() {
  const books = getAllBooks();
  const totalBooks = books.length;
  const worthCredit = books.filter((b) => b.price > AUDIBLE_CREDIT_VALUE).length;
  const longBooks = books.filter((b) => b.runtimeHours >= 20).length;
  const veryLongBooks = books.filter((b) => b.runtimeHours >= 30).length;
  const highRated = books.filter((b) => b.starRating >= 4.8).length;
  const avgValueScore =
    books.reduce((s, b) => s + b.valueScore, 0) / totalBooks;
  const top10 = [...books]
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 10);

  const fields = [
    { name: 'asin', type: 'string', desc: 'Audible ASIN (unique identifier)' },
    { name: 'title', type: 'string', desc: 'Book title' },
    { name: 'author', type: 'string', desc: 'Author name(s), comma-separated if multiple' },
    { name: 'narrator', type: 'string', desc: 'Narrator name(s)' },
    { name: 'runtime_minutes', type: 'integer', desc: 'Total runtime in minutes' },
    { name: 'runtime_hours', type: 'float', desc: 'Total runtime in hours (2 decimal)' },
    { name: 'price_usd', type: 'float', desc: 'Direct purchase price in USD (2 decimal)' },
    { name: 'star_rating', type: 'float', desc: 'Audible star rating 1.0 - 5.0' },
    { name: 'review_count', type: 'integer', desc: 'Number of Audible reviews' },
    { name: 'value_score', type: 'float', desc: 'Value Score = (runtime_hours x star_rating) / price_usd' },
    { name: 'cost_per_hour_usd', type: 'float', desc: 'Cost per listening hour = price_usd / runtime_hours' },
    { name: 'credit_worth_ratio', type: 'float', desc: 'Credit worth ratio = price_usd / $14.95 (credit value)' },
    { name: 'worth_using_credit', type: 'string', desc: 'Yes if price > $14.95 (credit saves money), No otherwise' },
    { name: 'categories', type: 'string', desc: 'Audible categories, pipe-separated (|)' },
    { name: 'cover_image_url', type: 'string', desc: 'Amazon CDN cover image URL (SL500 size)' },
    { name: 'detail_page_url', type: 'string', desc: 'Amazon product page URL' },
  ];

  return (
    <div className="container-content py-6 md:py-10 max-w-5xl">
      {/* Header */}
      <header className="mb-8">
        <p className="text-sm text-text-secondary mb-2">Open Dataset</p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Audible Audiobooks Dataset ({totalBooks.toLocaleString()}+ Books)
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          A free, open dataset of {totalBooks} Audible audiobooks with Value Score, cost per hour,
          credit worth ratio, ratings, and runtime. CSV format, MIT licensed, ready for analysis.
        </p>
      </header>

      {/* Download CTA */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-1">Download the dataset</h2>
          <p className="text-sm text-text-secondary">
            CSV file, ~70 KB, {totalBooks} rows x 16 columns. Updated August 2026.
          </p>
        </div>
        <a
          href="/dataset/audible-books-dataset.csv"
          download
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download CSV
        </a>
      </div>

      {/* Stats Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Dataset summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total books', value: totalBooks, sub: 'audiobooks' },
            { label: 'Worth a credit', value: worthCredit, sub: `of ${totalBooks} (> $${AUDIBLE_CREDIT_VALUE})` },
            { label: 'Long books (20h+)', value: longBooks, sub: 'extended listening' },
            { label: 'Very long (30h+)', value: veryLongBooks, sub: 'epic length' },
            { label: 'High rated (4.8+)', value: highRated, sub: 'top reviews' },
            { label: 'Avg Value Score', value: avgValueScore.toFixed(2), sub: 'across dataset' },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-text-primary mt-1">{s.label}</p>
              <p className="text-xs text-text-secondary">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schema / Field Definitions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Schema: 16 fields</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-surface">
              <tr>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">Field</th>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">Type</th>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.name} className="border-b border-border last:border-b-0">
                  <td className="p-3 font-mono text-text-primary whitespace-nowrap">{f.name}</td>
                  <td className="p-3 text-text-secondary whitespace-nowrap">{f.type}</td>
                  <td className="p-3 text-text-secondary">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Preview: Top 10 by Value Score */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-1">Preview: Top 10 by Value Score</h2>
        <p className="text-sm text-text-secondary mb-4">
          A snapshot of the highest-value audiobooks in the dataset. Download the CSV for all {totalBooks} rows.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-surface">
              <tr>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">#</th>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">Title</th>
                <th className="text-left p-3 font-semibold text-text-primary border-b border-border">Author</th>
                <th className="text-right p-3 font-semibold text-text-primary border-b border-border">Hours</th>
                <th className="text-right p-3 font-semibold text-text-primary border-b border-border">Price</th>
                <th className="text-right p-3 font-semibold text-text-primary border-b border-border">Rating</th>
                <th className="text-right p-3 font-semibold text-text-primary border-b border-border">Value Score</th>
                <th className="text-right p-3 font-semibold text-text-primary border-b border-border">$/hr</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((b, i) => (
                <tr key={b.asin} className="border-b border-border last:border-b-0 hover:bg-surface">
                  <td className="p-3 text-text-secondary">{i + 1}</td>
                  <td className="p-3 text-text-primary font-medium">
                    <Link href={`/books/${b.asin}`} className="hover:underline text-primary">{b.title}</Link>
                  </td>
                  <td className="p-3 text-text-secondary">{b.author.split(',')[0]}</td>
                  <td className="p-3 text-right text-text-secondary">{b.runtimeHours.toFixed(1)}</td>
                  <td className="p-3 text-right text-text-secondary">${b.price.toFixed(2)}</td>
                  <td className="p-3 text-right text-text-secondary">{b.starRating.toFixed(1)}</td>
                  <td className="p-3 text-right font-semibold text-primary">{b.valueScore.toFixed(2)}</td>
                  <td className="p-3 text-right text-text-secondary">${b.costPerHour.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-8 bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-3">Methodology</h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Value Score</strong> measures how much listening value you get per dollar:
          </p>
          <pre className="bg-background border border-border rounded p-3 text-xs overflow-x-auto text-text-primary">{`Value Score = (Runtime in hours x Star rating) / Price in USD`}</pre>
          <p>
            A book with a Value Score above 8.0 is considered excellent value for an Audible credit.
            A score above 5.0 is good value. Below 3.0 suggests the book may be better purchased directly
            rather than using a credit.
          </p>
          <p>
            <strong className="text-text-primary">Credit Worth Ratio</strong> shows how many times the credit value
            (${AUDIBLE_CREDIT_VALUE}) you get in purchase price. A ratio above 1.0 means using a credit saves you money.
          </p>
        </div>
      </section>

      {/* License + Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">License &amp; usage</h2>
        <div className="bg-surface border border-border rounded-xl p-6 space-y-3 text-sm text-text-secondary">
          <p>
            <strong className="text-text-primary">License:</strong> MIT. You are free to use, modify, and distribute
            this dataset for any purpose, including commercial use, with attribution.
          </p>
          <p>
            <strong className="text-text-primary">Citation:</strong> If you use this dataset in a project or analysis,
            please link back to <code className="bg-background px-1.5 py-0.5 rounded text-xs">{SITE_CONFIG.url}/dataset</code>.
          </p>
          <p>
            <strong className="text-text-primary">Data source:</strong> Book metadata (title, author, narrator, runtime,
            price, rating, review count) sourced from Audible and Amazon product pages. Value Score, cost per hour, and
            credit worth ratio are derived metrics calculated by GetCreditWorth.
          </p>
          <p>
            <strong className="text-text-primary">Disclaimer:</strong> Prices and ratings reflect the data collection
            date (July 2026) and may change over time. Amazon and Audible are trademarks of their respective owners;
            this dataset is not affiliated with or endorsed by Amazon or Audible.
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Explore more</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/books" className="inline-flex items-center gap-1 px-4 py-2 bg-surface border border-border rounded-lg hover:border-primary text-text-primary">
            Browse all {totalBooks} books
          </Link>
          <Link href="/calculator" className="inline-flex items-center gap-1 px-4 py-2 bg-surface border border-border rounded-lg hover:border-primary text-text-primary">
            Credit value calculator
          </Link>
          <Link href="/blog/50-best-audiobooks-to-use-credit-on" className="inline-flex items-center gap-1 px-4 py-2 bg-surface border border-border rounded-lg hover:border-primary text-text-primary">
            50 best audiobooks for credits
          </Link>
        </div>
      </section>
    </div>
  );
}