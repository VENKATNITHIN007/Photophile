/**
 * PHOTOGRAPHER CONSTANTS
 * 
 * This is the single source of truth for photographer attributes
 * across the frontend (Discovery, Onboarding, Studio).
 */

export const PHOTOGRAPHER_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
  "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
] as const;

export const PHOTOGRAPHER_SPECIALTIES = [
  "Wedding", "Portrait", "Event", "Commercial", "Fashion",
  "Nature", "Real Estate", "Food", "Sports", "Product",
  "Newborn", "Maternity", "Corporate", "Concert",
] as const;

// Reusable { label, value } format for Form.Select / Form.MultiSelect
export const CITY_OPTIONS = PHOTOGRAPHER_CITIES.map((city) => ({
  label: city,
  value: city.toLowerCase(),
}));

export const SPECIALTY_OPTIONS = PHOTOGRAPHER_SPECIALTIES.map((spec) => ({
  label: spec,
  value: spec.toLowerCase(),
}));

// Raw lowercase arrays for simpler filtering logic
export const COMMON_LOCATIONS = PHOTOGRAPHER_CITIES.map(c => c.toLowerCase());
export const COMMON_SPECIALTIES = PHOTOGRAPHER_SPECIALTIES.map(s => s.toLowerCase());
