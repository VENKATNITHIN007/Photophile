import { useQuery } from "@tanstack/react-query";
import {
  getPhotographerPortfolio,
  getPhotographerProfile,
} from "./public-profile.api";
import { queryKeys } from "@/lib/query/keys";

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
