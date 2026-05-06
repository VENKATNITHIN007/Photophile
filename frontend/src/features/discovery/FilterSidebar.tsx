import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Page } from "@/components/Page";
import { COMMON_LOCATIONS, COMMON_SPECIALTIES } from "./constants";

// ── Helpers ────────────────────────────────────────────────────────

/** Capitalize each word: "real estate" → "Real Estate" */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ── Component ──────────────────────────────────────────────────────

import { usePhotographerFilters } from "./photographers.store";

// ... (capitalizeWords stays same)

export function FilterSidebar() {
  const {
    location,
    specialty,
    minPrice,
    maxPrice,
    setLocation,
    setSpecialty,
    setMinPrice,
    setMaxPrice,
    reset,
  } = usePhotographerFilters();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b">
          <Page.Row className="justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <Button variant="ghost" size="sm" onClick={reset} className="h-8 px-2 text-blue-600">
              Reset
            </Button>
          </Page.Row>
        </CardHeader>

        <CardContent className="pt-5">
          <Page.Stack className="gap-5">
            {/* Location */}
            <Page.Stack className="gap-2">
              <Label htmlFor="filter-location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="filter-location">
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Location</SelectItem>
                  {COMMON_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {capitalizeWords(loc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Page.Stack>

            {/* Specialty */}
            <Page.Stack className="gap-2">
              <Label htmlFor="filter-specialty">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="filter-specialty">
                  <SelectValue placeholder="Any Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Specialty</SelectItem>
                  {COMMON_SPECIALTIES.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {capitalizeWords(spec)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Page.Stack>

            {/* Price range */}
            <Page.Stack className="gap-2">
              <Label>Price Range ($)</Label>
              <Page.Row className="gap-2">
                <Input
                  id="filter-min-price"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span className="text-gray-500">–</span>
                <Input
                  id="filter-max-price"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />

              </Page.Row>
            </Page.Stack>
          </Page.Stack>
        </CardContent>
      </Card>
    </aside>
  );
}
