import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-content py-20 md:py-28 text-center">
      <p className="text-sm font-semibold text-primary mb-3">Error 404</p>
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
        This page doesn&apos;t exist
      </h1>
      <p className="text-text-secondary max-w-xl mx-auto mb-10">
        The link may be broken, or the page may have been moved. Here are a few
        useful places to keep going:
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary font-medium hover:text-primary transition-colors"
        >
          Top Audiobooks
        </Link>
        <Link
          href="/books"
          className="px-5 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary font-medium hover:text-primary transition-colors"
        >
          Browse All Books
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary font-medium hover:text-primary transition-colors"
        >
          Audible Guides
        </Link>
        <Link
          href="/calculator"
          className="px-5 py-2.5 rounded-lg bg-bg-surface border border-border text-text-primary font-medium hover:text-primary transition-colors"
        >
          Credit Value Calculator
        </Link>
      </div>
      <p className="text-sm text-text-secondary">
        Looking for a specific audiobook? Use the search box on the{" "}
        <Link href="/books" className="text-primary hover:underline">
          book database
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
