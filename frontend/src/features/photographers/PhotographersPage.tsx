"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSidebar } from "@/features/photographers/FilterSidebar";
import { PhotographerGrid } from "@/features/photographers/PhotographerGrid";
import { PaginationControls } from "@/features/photographers/PaginationControls";
import { usePhotographersQuery } from "@/features/photographers/queries/photographers.queries";
import { usePhotographerFilters } from "@/features/photographers/store/photographer-filters.store";
import type { BrowsePhotographersParams } from "@/lib/api/photographers";

export function PhotographersPage() {
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
    }, 500);
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

  const handleResetFilters = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Photographers</h1>

            <div className="relative w-full max-w-md hidden sm:block">
              <Input
                type="text"
                placeholder="Search by name or username..."
                className="pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="py-2 sm:hidden relative">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-2 pt-2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            location={location}
            specialty={specialty}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onLocationChange={(value) => {
              setLocation(value);
            }}
            onSpecialtyChange={(value) => {
              setSpecialty(value);
            }}
            onMinPriceChange={(value) => {
              setMinPrice(value);
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
            }}
            onReset={handleResetFilters}
          />

          <main className="flex-1">
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between">
                <span>{error instanceof Error ? error.message : "An error occurred"}</span>
                <button
                  onClick={() => refetch()}
                  className="text-red-700 underline font-medium text-sm"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
              </div>
            ) : photographers.length === 0 ? (
              <EmptyState
                title="No photographers found"
                description="Try adjusting your filters or search query."
                action={
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear all filters
                  </Button>
                }
                icon={
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
            ) : (
              <>
                <PhotographerGrid photographers={photographers} />
                {pagination ? (
                  <PaginationControls
                    pagination={pagination}
                    page={page}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                ) : null}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default PhotographersPage;
