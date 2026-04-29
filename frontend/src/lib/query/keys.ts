import type { BrowsePhotographersParams } from "@/features/discovery/photographers.api";


export const queryKeys = {
  session: () => ["auth", "session"] as const,

  // ── Browsing (public) ────────────────────────────────────────────
  photographersList: (params: BrowsePhotographersParams) =>
    ["photographers", "list", params] as const,
  photographerProfile: (username: string) =>
    ["photographers", "profile", username] as const,
  photographerPortfolio: (username: string) =>
    ["photographers", "portfolio", username] as const,

  // ── Photographer Dashboard (private / "me") ──────────────────────
  myPhotographerProfile: () => ["photographers", "me"] as const,
  myPortfolio: () => ["portfolio", "me"] as const,
};
