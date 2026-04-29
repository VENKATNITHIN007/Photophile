import { apiClient } from "@/lib/api-client";
import type { PhotographerListItem, Pagination } from "@/lib/types/photographer";

export interface BrowsePhotographersParams {
  search?: string;
  location?: string;
  specialty?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  limit?: number;
}

export interface BrowsePhotographersResponse {
  photographers: PhotographerListItem[];
  pagination: Pagination;
}

export async function browsePhotographers(params: BrowsePhotographersParams) {
  const response = await apiClient.get("/photographers/browse", { params });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch photographers");
  }
  return response.data.data as BrowsePhotographersResponse;
}
