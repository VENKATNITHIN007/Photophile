import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  browsePhotographers,
  getPhotographerPortfolio,
  getPhotographerProfile,
  type BrowsePhotographersParams,
} from "@/lib/api/photographers";
import { queryKeys } from "@/lib/query/keys";

/** Browse / search the public photographer directory. */
export function usePhotographersQuery(params: BrowsePhotographersParams) {
  return useQuery({
    queryKey: queryKeys.photographersList(params),
    queryFn: () => browsePhotographers(params),
    placeholderData: keepPreviousData,
  });
}

/** Fetch a single photographer's public profile by username. */
export function usePhotographerProfileQuery(username: string) {
  return useQuery({
    queryKey: queryKeys.photographerProfile(username),
    queryFn: () => getPhotographerProfile(username),
    enabled: Boolean(username),
  });
}

/** Fetch a photographer's public portfolio by username. */
export function usePhotographerPortfolioQuery(username: string) {
  return useQuery({
    queryKey: queryKeys.photographerPortfolio(username),
    queryFn: () => getPhotographerPortfolio(username),
    enabled: Boolean(username),
  });
}
