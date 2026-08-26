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
    logo: {
      "@type": "ImageObject",
      url: "https://getcreditworth.com/favicon.svg",
    },
  };
  return <JsonLd data={schema} />;
}

export function SoftwareApplicationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GetCreditWorth — Audible Credit Value Calculator",
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Calculator",
    operatingSystem: "Web",
    url: "https://getcreditworth.com",
    description:
      "Free web tool to calculate how much an Audible credit is worth and find the best audiobooks to spend credits on using a transparent Value Score formula.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "GetCreditWorth",
      url: "https://getcreditworth.com",
      logo: {
        "@type": "ImageObject",
        url: "https://getcreditworth.com/favicon.svg",
      },
    },
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

export function AboutPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://getcreditworth.com/about",
        url: "https://getcreditworth.com/about",
        name: "About GetCreditWorth - Audible Credit Value Optimizer",
        description:
          "Free tool to maximize your Audible credits. Transparent Value Score formula, credit calculator, and curated book lists.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://getcreditworth.com" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://getcreditworth.com/about" },
          ],
        },
        mainEntity: {
          "@type": "Person",
          name: "GetCreditWorth Team",
          url: "https://getcreditworth.com/about",
          knowsAbout: ["Audible", "audiobooks", "credit optimization", "value scoring"],
        },
      },
    ],
  };
  return <JsonLd data={schema} />;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  publishedDate,
  modifiedDate,
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedDate,
    dateModified: modifiedDate ?? publishedDate,
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
    image: image ?? "https://getcreditworth.com/favicon.svg",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
  return <JsonLd data={schema} />;
}
