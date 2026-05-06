import { Suspense } from "react";
import type { Metadata } from "next";
import { Page } from "@/components/Page";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { Discovery } from "@/features/discovery/Discovery";



import { PhotographerGridSkeleton } from "@/features/discovery/PhotographerCardSkeleton";

// ── Item #14: SEO metadata ─────────────────────────────────────────
export const metadata: Metadata = {
  title: "Browse Photographers | Photophile",
  description:
    "Discover professional photographers by specialty, location, and budget. View portfolios and contact them directly.",
  openGraph: {
    title: "Browse Photographers | Photophile",
    description:
      "Discover professional photographers by specialty, location, and budget. View portfolios and contact them directly.",
    type: "website",
  },
};

// ── Page ───────────────────────────────────────────────────────────
export default function PhotographersRoutePage() {
  return (
    <Page>
      <Page.Header>
        <Page.Stack className="gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Discovery</p>
          <Page.Title>Find photographers</Page.Title>
          <Page.Description>
            Browse by category, location, and budget. Open profiles to view full portfolio and contact details.
          </Page.Description>
        </Page.Stack>

        <div className="mt-4">
          <Discovery.Search />
          <Discovery.Summary />
        </div>
      </Page.Header>

      <Page.Body>
        <Page.Aside className="hidden md:flex">
          <Discovery.Filters />
        </Page.Aside>


        {/* Item #15: Suspense boundary — page shell renders instantly,
            results show skeleton until the client component mounts + fetches. */}
        <Page.Section>
          <QueryErrorBoundary>
            <Suspense fallback={<PhotographerGridSkeleton />}>
              <Discovery.Results />
            </Suspense>
          </QueryErrorBoundary>
        </Page.Section>
      </Page.Body>
    </Page>
  );
}
