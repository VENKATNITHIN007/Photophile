import { apiClient } from "@/lib/api-client";
import type { Booking } from "@/lib/types/booking";

export interface CreateBookingPayload {
  photographerId: string;
  eventDate: string;
  message: string;
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await apiClient.post("/bookings", payload);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to create booking");
  }
  return response.data.data as Booking;
}

export async function getMyBookings() {
  const response = await apiClient.get("/bookings/my-bookings");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load bookings");
  }
  return (response.data.data || []) as Booking[];
}

export async function cancelBooking(bookingId: string) {
  const response = await apiClient.delete(`/bookings/${bookingId}`);
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to cancel booking");
  }
  return response.data.data;
}

export async function getPhotographerBookings() {
  const response = await apiClient.get("/bookings/requests/all");
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load booking requests");
  }
  return (response.data.data || []) as Booking[];
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const response = await apiClient.patch(`/bookings/${bookingId}/status`, { status });
  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to update booking status");
  }
  return response.data.data;
}
