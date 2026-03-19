import { privateApiClient } from "@/lib/api-client";
import type { PortfolioItem } from "@/lib/types/photographer";

export interface AddPortfolioItemPayload {
  mediaUrl: string;
  mediaType: string;
  category?: string;
}

export async function getMyPortfolio() {
  const response = await privateApiClient.get("/portfolio");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load portfolio");
  }
  return (response.data.data || []) as PortfolioItem[];
}

export async function addPortfolioItem(payload: AddPortfolioItemPayload) {
  const response = await privateApiClient.post("/portfolio/add", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to add portfolio item");
  }
  return response.data.data;
}
