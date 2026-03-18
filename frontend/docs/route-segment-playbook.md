# Route Segment Playbook (Next.js App Router)

This playbook explains exactly where `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` should live, what logic each file should contain, and why.

Use this with `frontend/docs/folder-structure-guide.md`.

## Core Rule

Each route segment should own its own user experience states:

- normal state (`page.tsx`)
- loading state (`loading.tsx`)
- recoverable failure state (`error.tsx`)
- missing resource state (`not-found.tsx`)

Reason: state behavior belongs to the same URL boundary where the user experiences it.

## File-by-File Responsibilities

### `page.tsx`

- Owns route entry and route params/search params.
- Composes feature container component.
- Prefer Server Component unless interaction requires client.

Keep out:

- duplicated loading UI (use `loading.tsx`)
- large error presentation blocks (use `error.tsx`)

### `loading.tsx`

- Immediate fallback while segment is rendering/loading.
- Fast skeleton/spinner only.
- No data fetching, no side effects.

### `error.tsx`

- Must be Client Component (`"use client"`).
- Renders recoverable error UI for this segment.
- Use `reset()` to retry.

### `not-found.tsx`

- Renders when resource does not exist.
- Use when slug/id is invalid or deleted.

### `layout.tsx`

- Wraps child routes in a shared shell for that segment.
- Keep stable wrappers here (section nav, common spacing, guards if needed).

## Data Fetching Decision

### Prefer server fetch in `page.tsx` when

- route is public/indexable
- content should be SEO-visible at first paint
- interactivity is minimal

### Prefer React Query in feature hooks when

- user-driven filters/search/pagination update often
- background refetch, cache, invalidation are needed
- mutation lifecycle is important

### Placement rule

- Fetch orchestration: feature query hooks (for client flows)
- Render logic: feature components
- Route wiring only: `app/**/page.tsx`

Reason: isolates server-state complexity from presentation components.

## Project-Specific Target Layout

Current routes mostly have `page.tsx` only. Add segment states incrementally.

Recommended first additions:

1. `src/app/(public)/photographers/loading.tsx`
2. `src/app/(public)/photographers/error.tsx`
3. `src/app/(public)/photographers/[username]/loading.tsx`
4. `src/app/(public)/photographers/[username]/error.tsx`
5. `src/app/(public)/photographers/[username]/not-found.tsx`

Reason: this flow is core to discovery and has network-dependent data.

## Minimal Templates

### Segment `loading.tsx`

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
        </div>
      </div>
    </div>
  );
}
```

### Segment `error.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Unable to load this page</h2>
        <p className="text-sm text-gray-500">Please try again.</p>
        <Button onClick={reset} className="w-full">Try again</Button>
      </div>
    </div>
  );
}
```

### Segment `not-found.tsx`

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Photographer not found</h2>
        <p className="text-sm text-gray-500">The profile may have been removed.</p>
        <Button asChild className="w-full">
          <Link href="/photographers">Back to directory</Link>
        </Button>
      </div>
    </div>
  );
}
```

## Architecture Decisions (Why, not just Organization)

1. Segment states (`loading/error/not-found`) live in `app` because they are URL-bound behavior.
2. Data lifecycle logic lives in feature query hooks because caching and invalidation are domain behavior.
3. Presentational components should not own fetching because they become hard to test and reuse.
4. Global `src/app/error.tsx` is fallback safety net; segment `error.tsx` should handle expected local failures first.

## What To Avoid

- Avoid mixing `useEffect + fetch` and React Query for the same resource.
- Avoid storing server response lists in Zustand.
- Avoid putting 150+ lines of fetch/error/pagination logic directly in `page.tsx`.
- Avoid adding global providers for one feature's state.

## Next Step

Implement the five recommended segment files for photographers routes first, then apply the same pattern to bookings and dashboard routes.
