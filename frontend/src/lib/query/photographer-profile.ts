import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPhotographerProfile, getMyPhotographerProfile, updatePhotographerProfile } from "@/lib/api/photographers";
import { queryKeys } from "@/lib/query/keys";

export function useMyPhotographerProfileQuery() {
  return useQuery({
    queryKey: queryKeys.myPhotographerProfile(),
    queryFn: getMyPhotographerProfile,
  });
}

export function useCreatePhotographerProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPhotographerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}

export function useUpdatePhotographerProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePhotographerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myPhotographerProfile() });
    },
  });
}
