export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "completed",
} as const;

export const BOOKING_STATUS_TRANSITIONS = {
  pending: ["accepted", "rejected"],
  accepted: ["completed", "rejected"],
  rejected: [],
  completed: [],
} as const;