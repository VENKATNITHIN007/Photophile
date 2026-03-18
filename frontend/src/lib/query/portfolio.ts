import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPortfolioItem, getMyPortfolio } from "@/lib/api/portfolio";
import { queryKeys } from "@/lib/query/keys";

export function useMyPortfolioQuery() {
  return useQuery({
    queryKey: queryKeys.myPortfolio(),
    queryFn: getMyPortfolio,
  });
}

export function useAddPortfolioItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPortfolio() });
    },
  });
}
