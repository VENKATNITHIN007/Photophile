/**
 * Centralized Route Map for Photophile.
 * Eliminates magic strings and ensures type-safe navigation across the app.
 */
export const ROUTES = {
  HOME: "/",
  DISCOVERY: "/photographers",
  
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    VERIFY_PENDING: "/verify-email/pending",
  },
  
  STUDIO: {
    PROFILE: "/profile",
    ONBOARD: "/photographer/onboard",
    MANAGE: "/photographer/dashboard",
    PORTFOLIO: "/photographer/portfolio",
    SETTINGS: "/photographer/settings",
  },
  
  PUBLIC_PROFILE: (username: string) => `/photographers/${username}`,
} as const;

export type AppRoutes = typeof ROUTES;
