"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Page } from "@/components/Page";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePhotographerFilters } from "./photographers.store";
import { COMMON_LOCATIONS, COMMON_SPECIALTIES } from "@/lib/constants/photographer";

// ── Helpers ────────────────────────────────────────────────────────

function capitalizeWords(str: string): string {
  return str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/** Pure presentational form containing all filter inputs. */
function FilterForm() {
  const { location, specialty, minPrice, maxPrice, setLocation, setSpecialty, setMinPrice, setMaxPrice } = usePhotographerFilters();

  return (
    <Page.Stack className="gap-6">
      <Page.Stack className="gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="bg-background"><SelectValue placeholder="Any Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Location</SelectItem>
            {COMMON_LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc}>{capitalizeWords(loc)}</SelectItem>))}
          </SelectContent>
        </Select>
      </Page.Stack>

      <Page.Stack className="gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specialty</Label>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="bg-background"><SelectValue placeholder="Any Specialty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Specialty</SelectItem>
            {COMMON_SPECIALTIES.map((spec) => (<SelectItem key={spec} value={spec}>{capitalizeWords(spec)}</SelectItem>))}
          </SelectContent>
        </Select>
      </Page.Stack>

      <Page.Stack className="gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range ($)</Label>
        <Page.Row className="gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="pl-6 bg-background" />
          </div>
          <span className="text-muted-foreground">–</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="pl-6 bg-background" />
          </div>
        </Page.Row>
      </Page.Stack>
    </Page.Stack>
  );
}

// ── Desktop Sidebar ────────────────────────────────────────────────

export function DiscoveryFilters() {
  const { hasActiveFilters, reset } = usePhotographerFilters();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <Card className="sticky top-24 border-muted/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/5">
          <Page.Row className="justify-between items-center">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={reset} 
                className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/5 text-xs font-semibold gap-1.5"
              >
                <RotateCcw className="size-3" />
                Reset
              </Button>
            )}
          </Page.Row>
        </CardHeader>
        <CardContent className="pt-6">
          <FilterForm />
        </CardContent>
      </Card>
    </aside>
  );
}

// ── Mobile FAB ────────────────────────────────────────────────────

export function DiscoveryMobileFilters() {
  const { hasActiveFilters, reset } = usePhotographerFilters();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="lg" 
            className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 gap-3 h-14 px-8 border-4 border-background animate-in zoom-in-50 duration-300"
          >
            <Filter className="size-5" />
            <span className="font-bold tracking-tight">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-primary ring-2 ring-primary/20">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-[2.5rem] p-0 flex flex-col border-none shadow-2xl">
          <SheetHeader className="p-6 pb-4 flex-none text-left">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 md:hidden" />
            <SheetTitle className="flex items-center justify-between text-2xl font-bold">
              <span>Refine Results</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={reset} className="text-primary hover:text-primary hover:bg-primary/5 gap-2 px-3">
                  <RotateCcw className="size-3.5" />Reset
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
            <FilterForm />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
