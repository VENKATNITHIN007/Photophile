import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, createBooking, getMyBookings, getPhotographerBookings, updateBookingStatus } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query/keys";

export function useMyBookingsQuery() {
  return useQuery({
    queryKey: queryKeys.myBookings(),
    queryFn: getMyBookings,
  });
}

export function usePhotographerBookingsQuery() {
  return useQuery({
    queryKey: queryKeys.photographerBookings(),
    queryFn: getPhotographerBookings,
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings() });
    },
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings() });
    },
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.photographerBookings() });
    },
  });
}
