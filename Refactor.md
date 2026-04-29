
This is the refined, industry-standard approach. By naming your layout system `Page`, the code reads like a literal map of your application. 

Here is the complete, consolidated production code using **Next.js**, **Tailwind**, **React Query**, and **TypeScript**.

### 1. The Layout Architecture (`components/Page.tsx`)
This file defines your visual language. We use `twMerge` and `clsx` (the `cn` utility) to ensure that if you pass a custom class from the outside, it doesn't conflict with your base styles.

```tsx
import React, { ComponentPropsWithoutRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard utility for merging Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. The Root Container
const PageRoot = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("min-h-screen bg-slate-50 text-slate-900 flex flex-col", className)} {...props}>
    {children}
  </div>
);

// 2. The Semantic Header
const Header = ({ children, className, ...props }: ComponentPropsWithoutRef<"header">) => (
  <header className={cn("bg-white border-b sticky top-0 z-40 w-full", className)} {...props}>
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
      {children}
    </div>
  </header>
);

// 3. Typography
const Title = ({ children, className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1 className={cn("text-2xl font-bold tracking-tight md:text-3xl", className)} {...props}>
    {children}
  </h1>
);

const Description = ({ children, className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p className={cn("text-slate-500 text-sm md:text-base mt-1", className)} {...props}>
    {children}
  </p>
);

// 4. Structural Elements
const Body = ({ children, className, ...props }: ComponentPropsWithoutRef<"main">) => (
  <main className={cn("flex-1 max-w-7xl mx-auto px-6 py-8 w-full", className)} {...props}>
    {children}
  </main>
);

const Section = ({ children, className, ...props }: ComponentPropsWithoutRef<"section">) => (
  <section className={cn("space-y-6 mb-12", className)} {...props}>
    {children}
  </section>
);

// 5. The "Surface" (Card/Container)
const Surface = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl p-5 shadow-sm overflow-hidden", className)} {...props}>
    {children}
  </div>
);

// Final Compound Export
export const Page = Object.assign(PageRoot, {
  Header,
  Title,
  Description,
  Body,
  Section,
  Surface,
});
```

---

### 2. The Feature Logic (`features/PhotographerSearch.tsx`)
This handles the "wiring." It uses **React Query** for data and **Context** to share state between the search bar, filters, and results.

```tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Page, cn } from "@/components/Page";

const SearchContext = createContext<any>(undefined);

export function PhotographerSearch({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const { data: results, isLoading } = useQuery({
    queryKey: ["photographers", query, category],
    queryFn: async () => {
      // Logic for fetching from your API
      const res = await fetch(`/api/photographers?q=${query}&cat=${category}`);
      return res.json();
    }
  });

  return (
    <SearchContext.Provider value={{ query, setQuery, category, setCategory, results, isLoading }}>
      {children}
    </SearchContext.Provider>
  );
}

// --- SUB-COMPONENTS ---

PhotographerSearch.Input = () => {
  const { query, setQuery } = useContext(SearchContext);
  return (
    <input 
      className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      placeholder="Search by name..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

PhotographerSearch.Filters = () => {
  const { category, setCategory } = useContext(SearchContext);
  const categories = ["All", "Wedding", "Nature", "Studio"];
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(c => (
        <button
          key={c}
          onClick={() => setCategory(c)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
            category === c ? "bg-slate-900 border-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

PhotographerSearch.Results = () => {
  const { results, isLoading } = useContext(SearchContext);

  if (isLoading) return <div className="grid grid-cols-3 gap-6 animate-pulse">{/* Skeletons here */}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results?.map((item: any) => (
        <Page.Surface key={item.id} className="group cursor-pointer">
          <div className="aspect-square bg-slate-100 rounded-lg mb-4 overflow-hidden">
             <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <Page.Title className="text-lg">{item.name}</Page.Title>
          <Page.Description className="text-sm">{item.category}</Page.Description>
        </Page.Surface>
      ))}
    </div>
  );
};
```

---

### 3. The Implementation (`app/photographers/page.tsx`)
Because of the naming and composition, this file is now self-documenting.

```tsx
import { Page } from "@/components/Page";
import { PhotographerSearch } from "@/features/PhotographerSearch";

export default function PhotographerPage() {
  return (
    <PhotographerSearch>
      <Page>
        
        <Page.Header>
          <div className="flex flex-col">
            <Page.Title>Explore Talent</Page.Title>
            <Page.Description>Connect with top-rated photographers.</Page.Description>
          </div>
          <div className="hidden md:block w-72">
            <PhotographerSearch.Input />
          </div>
        </Page.Header>

        <Page.Body>
          <Page.Section>
             <PhotographerSearch.Filters />
          </Page.Section>

          <Page.Section>
             <PhotographerSearch.Results />
          </Page.Section>
        </Page.Body>

      </Page>
    </PhotographerSearch>
  );
}
```

---

### Summary of Best Practices used here:

* **Prop Forwarding (`...props`):** Every `Page` component can receive standard HTML attributes (like `id`, `onClick`, or `aria-label`) without you having to define them.
* **Ref-Safe Typing (`ComponentPropsWithoutRef`):** Ensures your components are compatible with all native React expectations.
* **Naming Consistency:** Using `Page` as the namespace makes the hierarchy obvious.
* **Separation of Concerns:** `Page` handles the **Skin** (CSS/HTML structure), while `PhotographerSearch` handles the **Brain** (Data/State).
* **Slot-Based Layout:** By using `{children}`, you can place your `Input` in the header on desktop but move it to the body on mobile without changing the logic.

This structure is highly scalable. If you need a "Profile" page tomorrow, you just use the same `Page` components but swap out the `PhotographerSearch` logic for `ProfileData` logic.