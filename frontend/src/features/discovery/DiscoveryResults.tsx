"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { useSuspensePhotographersQuery } from "./photographers.queries";
import { usePhotographerFilters } from "./photographers.store";
import type { BrowsePhotographersParams } from "./photographers.api";

// ── Helpers ────────────────────────────────────────────────────────

function sanitizePrice(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return undefined;
  return trimmed;
}

// ── Component ──────────────────────────────────────────────────────

export function DiscoveryResults() {
  const searchParams = useSearchParams();
  const { reset, hydrateFromURL } = usePhotographerFilters();

  // 1. Sync Store UI with URL (Runs after Suspense resolves)
  useEffect(() => {
    hydrateFromURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Scroll to top on page change
  const urlPageStr = searchParams.get("page");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [urlPageStr]);

  // 3. Derive Query Params directly from URL (Source of Truth)
  // This ensures the VERY FIRST fetch (before Suspense) uses the correct filters.
  const queryParams: BrowsePhotographersParams = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    return {
      search: searchParams.get("search") || undefined,
      location: searchParams.get("location") !== "all" ? (searchParams.get("location") || undefined) : undefined,
      specialty: searchParams.get("specialty") !== "all" ? (searchParams.get("specialty") || undefined) : undefined,
      minPrice: sanitizePrice(searchParams.get("minPrice")),
      maxPrice: sanitizePrice(searchParams.get("maxPrice")),
      page: !Number.isNaN(page) && page >= 1 ? page : 1,
      limit: 12,
    };
  }, [searchParams]);

  // 4. Execute Suspense Query
  const { data } = useSuspensePhotographersQuery(queryParams);
  const photographers = data?.photographers || [];
  const pagination = data?.pagination || null;

  // ── Render Logic ──────────────────────────────────────────────────

  if (photographers.length === 0) {
    return (
      <DataState.Empty
        title="No photographers found"
        description="Try changing your filters or search query."
        action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PhotographerGrid photographers={photographers} />
      {pagination && pagination.totalPages > 1 && (
        <PaginationControls 
          pagination={pagination} 
          page={queryParams.page || 1} 
          onPageChange={(p) => {
            // Note: Store actions update the URL, which triggers useSearchParams to re-render this.
            usePhotographerFilters.getState().setPage(p);
          }} 
        />
      )}
    </div>
  );
}
