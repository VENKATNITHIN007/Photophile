"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { FilterSidebar } from "./FilterSidebar";
import { PhotographerGrid } from "./PhotographerGrid";
import { PaginationControls } from "./PaginationControls";
import { usePhotographersQuery } from "./photographers.queries";
import { usePhotographerFilters } from "./photographers.store";
import type { BrowsePhotographersParams } from "./photographers.api";

export function DiscoveryPage() {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const {
    search,
    location,
    specialty,
    minPrice,
    maxPrice,
    page,
    setSearch,
    setLocation,
    setSpecialty,
    setMinPrice,
    setMaxPrice,
    setPage,
    reset,
  } = usePhotographerFilters();

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

  return (
    <Page>
      <Page.Header>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Discovery</p>
          <Page.Title>Find photographers</Page.Title>
          <Page.Description>
            Browse by category, location, and budget. Open profiles to view full portfolio and contact details.
          </Page.Description>
        </div>

        <Input
          type="text"
          placeholder="Search by name or username"
          className="max-w-xl bg-white"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Page.Header>

      <Page.Body>
        <Page.Aside>
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

        </Page.Aside>

        <Page.Section>
          {error ? (
            <DataState.Error 
              message={error instanceof Error ? error.message : "Failed to load photographers"} 
              onRetry={() => refetch()} 
            />
          ) : null}

          {isLoading ? (
            <DataState.Loading />
          ) : photographers.length === 0 ? (
            <DataState.Empty
              title="No photographers found"
              description="Try changing your filters or search query."
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <PhotographerGrid photographers={photographers} />
              {pagination ? (
                <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />
              ) : null}
            </>
          )}
        </Page.Section>
      </Page.Body>
    </Page>
  );
}

export default DiscoveryPage;
