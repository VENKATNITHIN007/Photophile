import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPhotographerProfile,
  getMyPhotographerProfile,
  updatePhotographerProfile,
} from "@/lib/api/photographers";
import { queryKeys } from "@/lib/query/keys";
import type { User } from "@/lib/types/auth";
import type { PhotographerProfile } from "@/lib/types/photographer";

// ── Queries ────────────────────────────────────────────────────────

/** Fetch the current photographer's own profile (dashboard). */
export function useMyProfileQuery() {
  return useQuery({
    queryKey: queryKeys.myPhotographerProfile(),
    queryFn: getMyPhotographerProfile,
  });
}

// ── Mutations ──────────────────────────────────────────────────────

/** Onboarding – create a new photographer profile. */
export function useCreateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPhotographerProfile,
    onSuccess: (createdProfile) => {
      qc.setQueryData<PhotographerProfile>(
        queryKeys.myPhotographerProfile(),
        createdProfile,
      );

      qc.setQueryData<User | null>(queryKeys.session(), (currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          role: "photographer",
        };
      });

      qc.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
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
