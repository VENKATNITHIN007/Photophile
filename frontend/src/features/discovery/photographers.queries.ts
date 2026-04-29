import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { browsePhotographers, type BrowsePhotographersParams } from "./photographers.api";
import { queryKeys } from "@/lib/query/keys";

/** Browse / search the public photographer directory. */
export function usePhotographersQuery(params: BrowsePhotographersParams) {
  return useQuery({
    queryKey: queryKeys.photographersList(params),
    queryFn: () => browsePhotographers(params),
    placeholderData: keepPreviousData,
  });
}
