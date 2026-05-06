"use client";

import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { FilterSidebar } from "./FilterSidebar";
import { PhotographerGrid } from "./PhotographerGrid";
import { PhotographerGridSkeleton } from "./PhotographerCardSkeleton";
import { PaginationControls } from "./PaginationControls";
import { useSuspensePhotographersQuery } from "./photographers.queries";
import { usePhotographerFilters } from "./photographers.store";
import { useDebounce } from "@/hooks/useDebounce";
import type { BrowsePhotographersParams } from "./photographers.api";

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Sanitize a price string: return `undefined` if the value is empty, NaN,
 * negative, or not a finite number. Otherwise return the trimmed string.
 */
function sanitizePrice(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) return undefined;

  return trimmed;
}

// ── Sub-components ─────────────────────────────────────────────────

export function DiscoverySearchInput() {
  const { search, setSearch } = usePhotographerFilters();
  return (
    <Input
      type="text"
      variant="search"
      placeholder="Search by name or username"
      className="max-w-xl"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export function DiscoveryFilters() {
  return <FilterSidebar />;
}

export function DiscoveryResults() {
  const { search, location, specialty, minPrice, maxPrice, page, setPage, reset, hydrateFromURL } =
    usePhotographerFilters();

  // Hydrate filters from URL on first mount
  useEffect(() => {
    hydrateFromURL();
  }, [hydrateFromURL]);

  const debouncedSearch = useDebounce(search, 350);
  const safeMinPrice = sanitizePrice(minPrice);
  const safeMaxPrice = sanitizePrice(maxPrice);

  const queryParams: BrowsePhotographersParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      location: location !== "all" ? location : undefined,
      specialty: specialty !== "all" ? specialty : undefined,
      minPrice: safeMinPrice,
      maxPrice: safeMaxPrice,
      page,
      limit: 12,
    }),
    [debouncedSearch, location, specialty, safeMinPrice, safeMaxPrice, page],
  );

  const { data } = useSuspensePhotographersQuery(queryParams);
  const photographers = data?.photographers || [];
  const pagination = data?.pagination || null;


  if (photographers.length === 0) {
    return (
      <DataState.Empty
        title="No photographers found"
        description="Try changing your filters or search query."
        action={
          <Button variant="outline" onClick={reset}>
            Clear filters
          </Button>
        }
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
