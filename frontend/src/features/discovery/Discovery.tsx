import { DiscoverySearch } from "./DiscoverySearch";
import { DiscoveryFilters } from "./DiscoveryFilters";
import { DiscoveryResults } from "./DiscoveryResults";
import { ActiveFiltersSummary } from "./ActiveFiltersSummary";

/**
 * DISCOVERY FEATURE - Production Barrel Export
 * 
 * This follows the Compound Component pattern for cleaner imports
 * while maintaining strict modularity in separate files.
 */
export const Discovery = {
  Search: DiscoverySearch,
  Filters: DiscoveryFilters,
  Results: DiscoveryResults,
  Summary: ActiveFiltersSummary,
};
