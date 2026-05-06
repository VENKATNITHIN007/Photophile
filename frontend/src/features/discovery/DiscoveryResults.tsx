"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { useSuspensePhotographersQuery } from "./photographers.queries";
import { usePhotographerFilters } from "./photographers.store";
import { useDebounce } from "@/hooks/useDebounce";
import type { BrowsePhotographersParams } from "./photographers.api";

function sanitizePrice(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return undefined;
  return trimmed;
}

export function DiscoveryResults() {
  const { search, location, specialty, minPrice, maxPrice, page, setPage, reset, hydrateFromURL } = usePhotographerFilters();

  useEffect(() => { hydrateFromURL(); }, [hydrateFromURL]);

  const debouncedSearch = useDebounce(search, 350);
  const safeMinPrice = sanitizePrice(minPrice);
  const safeMaxPrice = sanitizePrice(maxPrice);

  const queryParams: BrowsePhotographersParams = useMemo(() => ({
    search: debouncedSearch || undefined,
    location: location !== "all" ? location : undefined,
    specialty: specialty !== "all" ? specialty : undefined,
    minPrice: safeMinPrice,
    maxPrice: safeMaxPrice,
    page,
    limit: 12,
  }), [debouncedSearch, location, specialty, safeMinPrice, safeMaxPrice, page]);

  const { data } = useSuspensePhotographersQuery(queryParams);
  const photographers = data?.photographers || [];
  const pagination = data?.pagination || null;

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
        <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />
      )}
    </div>
  );
}
