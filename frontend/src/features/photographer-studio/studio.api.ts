import { apiClient } from "@/lib/api-client";
import type { PhotographerProfile, PortfolioItem } from "@/lib/types/photographer";

// ── Profile APIs ────────────────────────────────────────────────────────

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

// ── Portfolio APIs ──────────────────────────────────────────────────────

export interface AddPortfolioItemPayload {
  mediaUrl: string;
  mediaType: string;
  category?: string;
}

export interface UpdatePortfolioItemPayload {
  category?: string;
}

export async function getMyPortfolio() {
  const response = await apiClient.get("/portfolio");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load portfolio");
  }
  return (response.data.data || []) as PortfolioItem[];
}

export async function addPortfolioItem(payload: AddPortfolioItemPayload) {
  const response = await apiClient.post("/portfolio/add", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to add portfolio item");
  }
  return response.data.data;
}

export async function updatePortfolioItem(itemId: string, payload: UpdatePortfolioItemPayload) {
  const response = await apiClient.patch(`/portfolio/${itemId}`, payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update portfolio item");
  }
  return response.data.data;
}

export async function deletePortfolioItem(itemId: string) {
  const response = await apiClient.delete(`/portfolio/${itemId}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to delete portfolio item");
  }
  return response.data.data;
}
