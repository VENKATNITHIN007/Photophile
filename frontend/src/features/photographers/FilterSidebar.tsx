import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMON_LOCATIONS, COMMON_SPECIALTIES } from "@/features/photographers/constants";

interface FilterSidebarProps {
  location: string;
  specialty: string;
  minPrice: string;
  maxPrice: string;
  onLocationChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  location,
  specialty,
  minPrice,
  maxPrice,
  onLocationChange,
  onSpecialtyChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-blue-600">
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Select value={location} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Location</SelectItem>
                {COMMON_LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Specialty</label>
            <Select value={specialty} onValueChange={onSpecialtyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Specialty</SelectItem>
                {COMMON_SPECIALTIES.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price Starting From ($)</label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(event) => onMinPriceChange(event.target.value)}
                min="0"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(event) => onMaxPriceChange(event.target.value)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export default FilterSidebar;
