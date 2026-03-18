export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface BookingPhotographerSummary {
  _id: string;
  username?: string;
  location?: string;
  priceFrom?: number;
  userId?: {
    _id?: string;
    fullName?: string;
    avatar?: string | null;
  };
}

export interface BookingUserSummary {
  _id?: string;
  fullName?: string;
  email?: string;
}

export interface Booking {
  _id: string;
  photographerId: BookingPhotographerSummary | string;
  userId: BookingUserSummary | string;
  eventDate: string;
  status: BookingStatus;
  message?: string;
  createdAt?: string;
}
