import type { User } from "@/lib/types/auth";

/**
 * Centralized utility to determine the correct redirect path based on user state.
 * This is the SINGLE SOURCE OF TRUTH for authentication redirects.
 * 
 * @param user - The authenticated user object
 * @returns The target path string
 */
export function getAuthRedirect(user: User | null): string {
  // 1. If no user, always go to login
  if (!user) return "/login";

  // 2. If email is not verified, they must go to the pending page
  // (Exception: Logout should still work, but that's handled by buttons)
  if (!user.isEmailVerified) {
    return "/verify-email/pending";
  }

  // 3. Role-based dashboards
  if (user.role === "photographer") {
    return "/photographer/dashboard";
  }

  // 4. Default for regular users (sent to their profile page)
  return "/profile";
}

/**
 * Checks if a redirect path is safe (not a full URL to another domain)
 * to prevent open-redirect attacks.
 */
export function getSafeRedirectPath(redirect: string | null): string | null {
  if (!redirect) return null;

  try {
    // "http://local" is a dummy base to handle relative paths
    const normalized = new URL(redirect, "http://local");
    
    // If the origin is not our dummy base, it's an external URL
    if (normalized.origin !== "http://local") return null;
    
    // Prevent redirecting back to auth pages
    const isAuthPath = ["/login", "/register"].some(path => 
      normalized.pathname === path || normalized.pathname.startsWith(`${path}/`)
    );
    
    if (isAuthPath) return null;
    
    return `${normalized.pathname}${normalized.search}`;
  } catch {
    return null;
  }
}
