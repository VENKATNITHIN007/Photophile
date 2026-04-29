import { apiClient } from "@/lib/api-client";
import type { PhotographerProfile, PortfolioItem } from "@/lib/types/photographer";

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
