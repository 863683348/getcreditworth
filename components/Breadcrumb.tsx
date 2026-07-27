"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-text-secondary mb-4 overflow-x-auto" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors flex-shrink-0">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 min-w-0">
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary truncate font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
