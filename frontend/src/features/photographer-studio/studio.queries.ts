import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyPhotographerProfile,
  createPhotographerProfile,
  updatePhotographerProfile,
  getMyPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type UpdatePortfolioItemPayload,
} from "./studio.api";
import { queryKeys } from "@/lib/query/keys";

// ── Profile Queries & Mutations ────────────────────────────────────────────

/** Fetch the current photographer's own profile (dashboard). */
export function useMyProfileQuery() {
  return useQuery({
    queryKey: queryKeys.myPhotographerProfile(),
    queryFn: getMyPhotographerProfile,
  });
}

/** Onboarding – create a new photographer profile. */
export function useCreateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPhotographerProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
      // Role may change after becoming a photographer
      qc.invalidateQueries({ queryKey: queryKeys.session() });
    },
  });
}

/** Update the current photographer's profile (bio, location, price). */
export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePhotographerProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

// ── Portfolio Queries & Mutations ──────────────────────────────────────────

/** Fetch the current photographer's own portfolio (dashboard). */
export function useMyPortfolioQuery() {
  return useQuery({
    queryKey: queryKeys.myPortfolio(),
    queryFn: getMyPortfolio,
  });
}

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
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdatePortfolioItemPayload }) =>
      updatePortfolioItem(itemId, payload),
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
