import { useQuery } from "@tanstack/react-query";
import {
  browsePhotographers,
  getPhotographerPortfolio,
  getPhotographerProfile,
  getPhotographerReviews,
  type BrowsePhotographersParams,
} from "@/lib/api/photographers";
import { queryKeys } from "@/lib/query/keys";

export function usePhotographersQuery(params: BrowsePhotographersParams) {
  return useQuery({
    queryKey: queryKeys.photographersList(params),
    queryFn: () => browsePhotographers(params),
    keepPreviousData: true,
  });
}

export function usePhotographerProfileQuery(username: string) {
  return useQuery({
    queryKey: queryKeys.photographerProfile(username),
    queryFn: () => getPhotographerProfile(username),
    enabled: Boolean(username),
  });
}

export function usePhotographerPortfolioQuery(username: string) {
  return useQuery({
    queryKey: queryKeys.photographerPortfolio(username),
    queryFn: () => getPhotographerPortfolio(username),
    enabled: Boolean(username),
  });
}

export function usePhotographerReviewsQuery(username: string) {
  return useQuery({
    queryKey: queryKeys.photographerReviews(username),
    queryFn: () => getPhotographerReviews(username),
    enabled: Boolean(username),
  });
}
