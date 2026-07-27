import type { Book } from "@/lib/types";

// Blog author name (pending multi-author support)
const BLOG_AUTHOR = "GetCreditWorth";
const BLOG_AUTHOR_URL = "https://getcreditworth.com/about";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BookJsonLd({ book }: { book: Book }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    bookFormat: "https://schema.org/AudiobookFormat",
    ...(book.narrator && {
      readBy: {
        "@type": "Person",
        name: book.narrator,
      },
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: book.starRating.toString(),
      reviewCount: book.reviewCount.toString(),
    },
    offers: {
      "@type": "Offer",
      price: book.price.toString(),
      priceCurrency: book.currency,
    },
    ...(book.publisher && { publisher: book.publisher }),
    ...(book.releaseDate && { datePublished: book.releaseDate }),
    url: book.detailPageUrl,
  };
  return <JsonLd data={schema} />;
}

export function ItemListJsonLd({
  books,
  name,
}: {
  books: Book[];
  name: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: books.slice(0, 50).map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: book.author },
        url: `/books/${book.asin}`,
      },
    })),
  };
  return <JsonLd data={schema} />;
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GetCreditWorth",
    url: "https://getcreditworth.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://getcreditworth.com/books?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={schema} />;
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetCreditWorth",
    url: "https://getcreditworth.com",
    description:
      "Audible credit value optimizer — find the best audiobooks to spend your credits on with data-driven value scores.",
    foundingDate: "2024",
  };
  return <JsonLd data={schema} />;
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://getcreditworth.com${item.url}`,
    })),
  };
  return <JsonLd data={schema} />;
}

export function FaqPageJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
  return <JsonLd data={schema} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  publishedDate,
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedDate,
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR,
      url: BLOG_AUTHOR_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "GetCreditWorth",
      url: "https://getcreditworth.com",
    },
    ...(image && { image }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
  return <JsonLd data={schema} />;
}
