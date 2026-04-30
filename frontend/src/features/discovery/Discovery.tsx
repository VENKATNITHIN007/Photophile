"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/DataState";
import { FilterSidebar } from "./FilterSidebar";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { usePhotographersQuery } from "./photographers.queries";
import { usePhotographerFilters } from "./photographers.store";
import type { BrowsePhotographersParams } from "./photographers.api";

// --- SUB-COMPONENTS ---
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { search, location, specialty, minPrice, maxPrice, page, setPage, reset } = usePhotographerFilters();

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const queryParams: BrowsePhotographersParams = {
    search: debouncedSearch || undefined,
    location: location !== "all" ? location : undefined,
    specialty: specialty !== "all" ? specialty : undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    page,
    limit: 12,
  };

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
