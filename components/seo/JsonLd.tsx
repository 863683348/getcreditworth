import type { Book } from '@/lib/types';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * 注入 JSON-LD 结构化数据
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 书籍详情页 Schema
 */
export function BookJsonLd({ book }: { book: Book }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    bookFormat: 'https://schema.org/AudiobookFormat',
    ...(book.narrator && {
      readBy: {
        '@type': 'Person',
        name: book.narrator,
      },
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.starRating.toString(),
      reviewCount: book.reviewCount.toString(),
    },
    offers: {
      '@type': 'Offer',
      price: book.price.toString(),
      priceCurrency: book.currency,
    },
    ...(book.publisher && { publisher: book.publisher }),
    ...(book.releaseDate && { datePublished: book.releaseDate }),
    url: book.detailPageUrl,
  };
  return <JsonLd data={schema} />;
}

/**
 * 列表页 ItemList Schema
 */
export function ItemListJsonLd({ books, name }: { books: Book[]; name: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: books.slice(0, 50).map((book, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Book',
        name: book.title,
        author: { '@type': 'Person', name: book.author },
        url: `/books/${book.asin}`,
      },
    })),
  };
  return <JsonLd data={schema} />;
}

/**
 * 网站搜索框 Schema（首页用）
 */
export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GetCreditWorth',
    url: 'https://getcreditworth.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://getcreditworth.com/books?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
  return <JsonLd data={schema} />;
}
