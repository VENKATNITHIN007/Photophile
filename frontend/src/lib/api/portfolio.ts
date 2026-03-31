import { apiClient } from "@/lib/api-client";
import type { PortfolioItem } from "@/lib/types/photographer";

export interface AddPortfolioItemPayload {
  mediaUrl: string;
  mediaType: string;
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

export interface UpdatePortfolioItemPayload {
  category?: string;
}

export async function updatePortfolioItem(
  itemId: string,
  payload: UpdatePortfolioItemPayload,
) {
  const response = await apiClient.patch(`/portfolio/${itemId}`, payload);
  if (response.data?.success === false) {
    throw new Error(
      response.data?.message || "Failed to update portfolio item",
    );
  }
  return response.data.data;
}

export async function deletePortfolioItem(itemId: string) {
  const response = await apiClient.delete(`/portfolio/${itemId}`);
  if (response.data?.success === false) {
    throw new Error(
      response.data?.message || "Failed to delete portfolio item",
    );
  }
  return response.data.data;
}
