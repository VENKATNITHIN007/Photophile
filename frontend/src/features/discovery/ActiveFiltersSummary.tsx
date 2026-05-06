"use client";

import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePhotographerFilters } from "./photographers.store";

export function ActiveFiltersSummary() {
  const { 
    location, specialty, minPrice, maxPrice, hasActiveFilters,
    setLocation, setSpecialty, setMinPrice, setMaxPrice, reset 
  } = usePhotographerFilters();

  if (!hasActiveFilters) return null;

  const filters = [];
  if (location !== "all") filters.push({ id: "loc", label: `Loc: ${location}`, onRemove: () => setLocation("all") });
  if (specialty !== "all") filters.push({ id: "spec", label: `Spec: ${specialty}`, onRemove: () => setSpecialty("all") });
  if (minPrice) filters.push({ id: "min", label: `Min: $${minPrice}`, onRemove: () => setMinPrice("") });
  if (maxPrice) filters.push({ id: "max", label: `Max: $${maxPrice}`, onRemove: () => setMaxPrice("") });

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <span className="text-xs font-medium text-muted-foreground mr-1">Active:</span>
      {filters.map((f) => (
        <Badge key={f.id} variant="secondary" className="pl-2 pr-1 py-0.5 gap-1 capitalize font-normal border-amber-100 bg-amber-50 text-amber-900">
          {f.label}
          <button onClick={f.onRemove} className="hover:bg-amber-200/50 rounded-full p-0.5 transition-colors"><X className="size-3" /></button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={reset} className="h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-transparent">Clear All</Button>
    </div>
  );
}
