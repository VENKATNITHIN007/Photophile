"use client";

import React, { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { FilterSidebar } from "./FilterSidebar";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { usePhotographersQuery } from "./photographers.queries";
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
  const {
    location,
    specialty,
    minPrice,
    maxPrice,
    setLocation,
    setSpecialty,
    setMinPrice,
    setMaxPrice,
    reset,
  } = usePhotographerFilters();

  return (
    <FilterSidebar
      location={location}
      specialty={specialty}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onLocationChange={setLocation}
      onSpecialtyChange={setSpecialty}
      onMinPriceChange={setMinPrice}
      onMaxPriceChange={setMaxPrice}
      onReset={reset}
    />
  );
}

export function DiscoveryResults() {
  const { search, location, specialty, minPrice, maxPrice, page, setPage, reset, hydrateFromURL } =
    usePhotographerFilters();

  // Hydrate filters from URL on first mount (makes the page refresh-safe)
  useEffect(() => {
    hydrateFromURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Priority 1.1: Extracted useDebounce hook ---
  const debouncedSearch = useDebounce(search, 350);

  // --- Priority 1.4: Validate price before API call ---
  const safeMinPrice = sanitizePrice(minPrice);
  const safeMaxPrice = sanitizePrice(maxPrice);

  // --- Priority 1.2: Memoize queryParams to prevent React Query cache churn ---
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

  const { data, isLoading, error, refetch } = usePhotographersQuery(queryParams);
  const photographers = data?.photographers || [];
  const pagination = data?.pagination || null;

  if (error) {
    return (
      <DataState.Error
        message={error instanceof Error ? error.message : "Failed to load photographers"}
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <DataState.Loading />;
  }

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
