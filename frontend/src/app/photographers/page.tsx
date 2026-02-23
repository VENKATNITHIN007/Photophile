"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import Link from "next/link";

interface User {
  _id: string;
  fullName: string;
  avatar?: string;
}

interface Photographer {
  _id: string;
  userId: User;
  username: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const COMMON_SPECIALTIES = ["wedding", "portrait", "event", "commercial", "fashion", "nature", "real estate", "food", "sports", "documentary"];
const COMMON_LOCATIONS = ["new york", "los angeles", "chicago", "london", "toronto", "paris", "sydney", "berlin", "tokyo"];

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Data
  const fetchPhotographers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (location) params.append("location", location);
      if (specialty) params.append("specialty", specialty);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("page", page.toString());
      params.append("limit", "12");

      const response = await apiClient.get(`/photographers/browse?${params.toString()}`);
      
      if (response.data.success) {
        setPhotographers(response.data.data.photographers);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || "Failed to fetch photographers");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) { setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "An error occurred"); } else if (err instanceof Error) { setError(err.message); } else { setError("An error occurred"); }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, location, specialty, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchPhotographers();
  }, [fetchPhotographers]);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setSpecialty("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Area */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Photographers</h1>
            
            <div className="relative w-full max-w-md hidden sm:block">
              <input
                type="text"
                placeholder="Search by name or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="py-2 sm:hidden relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-2 pt-2">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button 
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              </div>

              {/* Location Filter */}
              <div className="mb-5">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border bg-white"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Any Location</option>
                  {COMMON_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div className="mb-5">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <select
                  id="specialty"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border bg-white"
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Any Specialty</option>
                  {COMMON_SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Starting From ($)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    min="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex justify-between">
                <span>{error}</span>
                <button onClick={() => fetchPhotographers()} className="text-red-700 underline font-medium text-sm">Retry</button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : photographers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No photographers found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photographers.map((photographer) => (
                    <Link href={`/photographers/${photographer.username}`} key={photographer._id} className="group cursor-pointer">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                        <div className="p-5 flex flex-col items-center border-b border-gray-100">
                          <div className="h-20 w-20 rounded-full bg-gray-200 mb-3 overflow-hidden relative">
                            {photographer.userId?.avatar ? (
                              <Image 
                                src={photographer.userId.avatar} 
                                alt={photographer.userId.fullName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-100 text-xl font-bold uppercase">
                                {photographer.userId?.fullName?.charAt(0) || photographer.username.charAt(0)}
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 text-center truncate w-full group-hover:text-blue-600 transition-colors">
                            {photographer.userId?.fullName || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-500">@{photographer.username}</p>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate capitalize">{photographer.location || 'Location unlisted'}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                            {photographer.bio || "No biography provided."}
                          </p>
                          
                          <div className="mt-auto">
                            {photographer.specialties && photographer.specialties.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {photographer.specialties.slice(0, 3).map((spec, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                                    {spec}
                                  </span>
                                ))}
                                {photographer.specialties.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                    +{photographer.specialties.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <span className="text-sm text-gray-500">Starting at</span>
                              <span className="text-lg font-bold text-gray-900">
                                {photographer.priceFrom ? `$${photographer.priceFrom}` : 'TBD'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.perPage) + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(pagination.currentPage * pagination.perPage, pagination.totalCount)}
                          </span>{" "}
                          of <span className="font-medium">{pagination.totalCount}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!pagination.hasPrevPage}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setPage(i + 1)}
                              aria-current={pagination.currentPage === i + 1 ? "page" : undefined}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 cursor-pointer ${
                                pagination.currentPage === i + 1
                                  ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                  : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.hasNextPage}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
