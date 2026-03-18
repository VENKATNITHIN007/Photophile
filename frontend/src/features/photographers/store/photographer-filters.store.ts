import { create } from "zustand";

interface PhotographerFiltersState {
  search: string;
  location: string;
  specialty: string;
  minPrice: string;
  maxPrice: string;
  page: number;
  setSearch: (value: string) => void;
  setLocation: (value: string) => void;
  setSpecialty: (value: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setPage: (value: number) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  location: "all",
  specialty: "all",
  minPrice: "",
  maxPrice: "",
  page: 1,
};

export const usePhotographerFilters = create<PhotographerFiltersState>((set) => ({
  ...initialState,
  setSearch: (value) => set({ search: value, page: 1 }),
  setLocation: (value) => set({ location: value, page: 1 }),
  setSpecialty: (value) => set({ specialty: value, page: 1 }),
  setMinPrice: (value) => set({ minPrice: value, page: 1 }),
  setMaxPrice: (value) => set({ maxPrice: value, page: 1 }),
  setPage: (value) => set({ page: value }),
  reset: () => set(initialState),
}));
