import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPortfolioItem,
  getMyPortfolio,
  updatePortfolioItem,
  deletePortfolioItem,
  type UpdatePortfolioItemPayload,
} from "@/lib/api/portfolio";
import { queryKeys } from "@/lib/query/keys";

// ── Queries ────────────────────────────────────────────────────────

/** Fetch the current photographer's own portfolio (dashboard). */
export function useMyPortfolioQuery() {
  return useQuery({
    queryKey: queryKeys.myPortfolio(),
    queryFn: getMyPortfolio,
  });
}

// ── Mutations ──────────────────────────────────────────────────────

/** Add a new item to the photographer's portfolio. */
export function useAddPortfolioItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addPortfolioItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPortfolio() });
    },
  });
}

/** Update a portfolio item's category. */
export function useUpdatePortfolioItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdatePortfolioItemPayload;
    }) => updatePortfolioItem(itemId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPortfolio() });
    },
  });
}

/** Delete a portfolio item. */
export function useDeletePortfolioItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deletePortfolioItem(itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPortfolio() });
    },
  });
}
