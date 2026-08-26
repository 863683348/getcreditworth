"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-3JBN9YBJN8";

/**
 * Tracks page views on App Router route changes.
 * useSearchParams() must be wrapped in Suspense.
 */
function GaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url =
      pathname +
      (searchParams?.toString() ? "?" + searchParams.toString() : "");

    // gtag is defined by the init script
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4 event tracking helper for affiliate clicks.
 * Events tracked:
 * - affiliate_click: when user clicks an Amazon/Audible affiliate link
 *   params: link_type (product/trial/coupon), region, asin
 * - page_view: enhanced page view with additional params
 */
export function trackAffiliateClick(params: {
  linkType: "product" | "trial" | "coupon";
  region?: string;
  asin?: string;
}) {
  if (typeof window === "undefined" || !(window as any).gtag) return;
  (window as any).gtag("event", "affiliate_click", {
    link_type: params.linkType,
    region: params.region || "us",
    asin: params.asin || "",
    engagement_time_msec: 1,
  });
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GaPageViewTracker />
      </Suspense>
    </>
  );
}
