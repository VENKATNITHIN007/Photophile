import { apiClient } from "@/lib/api-client";
import type { PhotographerListItem, Pagination, PhotographerProfile, PortfolioItem, ReviewsData } from "@/lib/types/photographer";

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

export async function getPhotographerProfile(username: string) {
  const response = await apiClient.get(`/photographers/${username}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch photographer profile");
  }
  return response.data.data as PhotographerProfile;
}

export async function getPhotographerPortfolio(username: string) {
  const response = await apiClient.get(`/portfolio/${username}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch portfolio");
  }
  return (response.data.data || []) as PortfolioItem[];
}

export async function getPhotographerReviews(username: string) {
  const response = await apiClient.get(`/reviews/${username}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to fetch reviews");
  }
  return response.data.data as ReviewsData;
}

export interface CreatePhotographerProfilePayload {
  username: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export interface UpdatePhotographerProfilePayload {
  bio?: string;
  location?: string;
  specialties?: string[];
  priceFrom?: number;
}

export async function createPhotographerProfile(payload: CreatePhotographerProfilePayload) {
  const response = await apiClient.post("/photographers/create", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to create photographer profile");
  }
  return response.data.data as PhotographerProfile;
}

export async function getMyPhotographerProfile() {
  const response = await apiClient.get("/photographers/profile");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load photographer profile");
  }
  return response.data.data as PhotographerProfile;
}

export async function updatePhotographerProfile(payload: UpdatePhotographerProfilePayload) {
  const response = await apiClient.patch("/photographers/update", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update photographer profile");
  }
  return response.data.data as PhotographerProfile;
}
