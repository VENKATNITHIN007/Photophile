import { create } from "zustand";

// ── Types ──────────────────────────────────────────────────────────

/** Data-only slice (no actions). Used for defaults, URL sync, and partials. */
interface FilterValues {
  search: string;
  location: string;
  specialty: string;
  minPrice: string;
  maxPrice: string;
  page: number;
}

interface PhotographerFiltersState extends FilterValues {
  setSearch: (value: string) => void;
  setLocation: (value: string) => void;
  setSpecialty: (value: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setPage: (value: number) => void;
  reset: () => void;
  /** Hydrate the store from the current URL search params. */
  hydrateFromURL: () => void;
  /** Helper to check if any filters are active (excluding page). */
  hasActiveFilters: boolean;
}

// ── Defaults ───────────────────────────────────────────────────────
const DEFAULTS: FilterValues = {
  search: "",
  location: "all",
  specialty: "all",
  minPrice: "",
  maxPrice: "",
  page: 1,
};

// ── URL helpers ────────────────────────────────────────────────────

/** Read filter state from the current URL search params. */
function readFiltersFromURL(): Partial<FilterValues> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const parsed: Partial<FilterValues> = {};

  const search = params.get("search");
  if (search) parsed.search = search;

  const location = params.get("location");
  if (location) parsed.location = location;

  const specialty = params.get("specialty");
  if (specialty) parsed.specialty = specialty;

  const minPrice = params.get("minPrice");
  if (minPrice) parsed.minPrice = minPrice;

  const maxPrice = params.get("maxPrice");
  if (maxPrice) parsed.maxPrice = maxPrice;

  const page = params.get("page");
  if (page) {
    const n = parseInt(page, 10);
    if (!Number.isNaN(n) && n >= 1) parsed.page = n;
  }

  return parsed;
}

/**
 * Push filter state into the URL search params (replaceState, no navigation).
 * Only writes non-default values so the URL stays clean.
 */
function writeFiltersToURL(state: FilterValues) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();

  if (state.search)                   params.set("search", state.search);
  if (state.location !== "all")       params.set("location", state.location);
  if (state.specialty !== "all")      params.set("specialty", state.specialty);
  if (state.minPrice)                 params.set("minPrice", state.minPrice);
  if (state.maxPrice)                 params.set("maxPrice", state.maxPrice);
  if (state.page > 1)                params.set("page", String(state.page));

  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;

  window.history.replaceState(null, "", url);
}

// ── Store ──────────────────────────────────────────────────────────

/** Helper: set state + sync URL in one shot. */
function setAndSync(
  set: (partial: Partial<PhotographerFiltersState>) => void,
  get: () => PhotographerFiltersState,
  partial: Partial<FilterValues>,
) {
  set(partial);
  // Build snapshot from the store *after* the set
  const next = get();
  
  // Update active status
  const hasActive = 
    next.search !== DEFAULTS.search ||
    next.location !== DEFAULTS.location ||
    next.specialty !== DEFAULTS.specialty ||
    next.minPrice !== DEFAULTS.minPrice ||
    next.maxPrice !== DEFAULTS.maxPrice;

  set({ hasActiveFilters: hasActive } as Partial<PhotographerFiltersState>);

  writeFiltersToURL({
    search: next.search,
    location: next.location,
    specialty: next.specialty,
    minPrice: next.minPrice,
    maxPrice: next.maxPrice,
    page: next.page,
  });
}

export const usePhotographerFilters = create<PhotographerFiltersState>(
  (set, get) => ({
    ...DEFAULTS,
    hasActiveFilters: false,

    setSearch:    (value) => setAndSync(set, get, { search: value, page: 1 }),
    setLocation:  (value) => setAndSync(set, get, { location: value, page: 1 }),
    setSpecialty: (value) => setAndSync(set, get, { specialty: value, page: 1 }),
    setMinPrice:  (value) => setAndSync(set, get, { minPrice: value, page: 1 }),
    setMaxPrice:  (value) => setAndSync(set, get, { maxPrice: value, page: 1 }),
    setPage:      (value) => setAndSync(set, get, { page: value }),

    reset: () => {
      set({ ...DEFAULTS, hasActiveFilters: false });
      writeFiltersToURL(DEFAULTS);
    },

    hydrateFromURL: () => {
      const fromURL = readFiltersFromURL();
      if (Object.keys(fromURL).length > 0) {
        set(fromURL);
        // Also update hasActiveFilters after hydration
        const next = get();
        const hasActive = 
          next.search !== DEFAULTS.search ||
          next.location !== DEFAULTS.location ||
          next.specialty !== DEFAULTS.specialty ||
          next.minPrice !== DEFAULTS.minPrice ||
          next.maxPrice !== DEFAULTS.maxPrice;
        set({ hasActiveFilters: hasActive } as Partial<PhotographerFiltersState>);
      }
    },
  }),
);
