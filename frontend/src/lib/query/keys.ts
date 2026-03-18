export const queryKeys = {
  photographersList: (params: Record<string, unknown>) => ["photographers", "list", params] as const,
  photographerProfile: (username: string) => ["photographers", "profile", username] as const,
  photographerPortfolio: (username: string) => ["photographers", "portfolio", username] as const,
  photographerReviews: (username: string) => ["photographers", "reviews", username] as const,
  myBookings: () => ["bookings", "me"] as const,
  photographerBookings: () => ["bookings", "photographer"] as const,
  myPortfolio: () => ["portfolio", "me"] as const,
  myPhotographerProfile: () => ["photographers", "me"] as const,
};
