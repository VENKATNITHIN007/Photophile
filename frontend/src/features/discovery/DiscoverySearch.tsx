"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { usePhotographerFilters } from "./photographers.store";

export function DiscoverySearch() {
  const { search, setSearch } = usePhotographerFilters();
  return (
    <Input
      type="text"
      variant="search"
      placeholder="Search by name or username"
      className="max-w-xl"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
