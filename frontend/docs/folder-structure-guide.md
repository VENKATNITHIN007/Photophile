# Frontend Folder Structure Guide

This document explains not only where files go, but also why each placement exists.

## Why Structure Matters

In React and Next.js projects, architecture affects speed, bugs, onboarding, and performance.

- If route files become too heavy, debugging URL behavior gets hard.
- If feature logic is spread across `lib`, `components`, and `app`, ownership is unclear.
- If server data and UI data are mixed, stale state bugs become common.

The goal is not only "organized files". The goal is predictable decision-making.

## Recommended Structure

```text
frontend/
  docs/
    folder-structure-guide.md
  src/
    app/                          # Route entry points and route-only behavior
    components/
      ui/                         # shadcn primitives only
      forms/                      # reusable RHF + shadcn field wrappers
      shared/                     # cross-feature app components
    contexts/                     # app-level providers (auth, theme)
    features/                     # feature ownership boundary
      photographers/
        queries/                  # feature React Query hooks
        store/                    # feature UI state (Zustand/local abstractions)
        ...feature components
      photographer-profile/
      landing/
    lib/                          # cross-feature infra and utilities
      api/
      query/
      validations/
      types/
      utils.ts
    hooks/                        # cross-feature reusable hooks
    styles/                       # global style files/tokens
```

## App Router Files: Exactly Where `loading`, `error`, and Others Go

These files belong in `src/app` at the route segment where they should apply.

### `layout.tsx`

- Location: `src/app/layout.tsx` for global layout, or inside a segment for scoped layout.
- Responsibility: persistent shell (providers, navbar, footer wrappers).
- Logic allowed: minimal composition logic only.
- Do not put feature business logic here.

### `page.tsx`

- Location: inside each route segment.
- Responsibility: route entry, parse params/searchParams, compose feature container.
- Preferred: Server Component by default.
- Use Client Component only when interaction requires it.

### `loading.tsx`

- Location: same route segment as target page.
- Responsibility: immediate fallback UI while that segment loads.
- Keep it visual and fast (skeletons/spinners), no data fetching.

### `error.tsx`

- Location: same route segment as target page.
- Responsibility: render recoverable UI when that segment throws.
- Must be Client Component in Next.js App Router (`"use client"`).
- Logic allowed: show message + retry via `reset()`.

### `not-found.tsx`

- Location: route segment that can return 404.
- Responsibility: empty/not-found state for invalid slugs/resources.
- Use when data fetch returns "not found" and route should become 404-like.

### `template.tsx` (optional)

- Use only when you need remount behavior on navigation.
- If you do not know why you need this, do not add it yet.

## Folder Ownership Rules and Logic

### `src/app`

Use for URL/route behavior only:

- route files (`page`, `layout`, `loading`, `error`, `not-found`)
- metadata (`metadata` or `generateMetadata`)
- route-level wiring of feature containers

Reason: route concerns change with URL behavior, not with feature internals.

### `src/features/<feature>`

Use for everything owned by one feature:

- feature components
- feature query hooks
- feature UI-only state
- feature constants/types

Reason: single ownership. A feature team can change one folder safely.

### `src/components/ui`

Use only for low-level primitives (shadcn base components).

Reason: primitives should stay generic and not know business rules.

### `src/components/forms`

Use for reusable field abstractions (`FormInput`, `FormSelect`, etc.).

Reason: consistent accessibility, error rendering, and form UX across app.

### `src/components/shared`

Use for cross-feature, app-level components (`Navbar`, `EmptyState`, `PageHeader`).

Reason: shared UI patterns without domain-specific coupling.

### `src/lib`

Use for cross-feature infrastructure:

- API client setup
- shared query keys and query provider defaults
- generic utils, schemas, and types

Reason: infra should be globally reusable and not tied to one domain.

### `src/stores`

Use only for truly app-global UI state.

Reason: global stores are hard to reason about; keep them rare.

## Data Fetching Placement: Hook vs Component vs Route

### Rule 1: Server-first for SEO/public content

For pages that should be crawlable and fast on first load, fetch in Server Components (`page.tsx` by default).

Reason: better TTFB/SEO and reduced client JS.

### Rule 2: React Query for interactive client flows

Use React Query in feature hooks when page needs:

- background refetch
- caching and deduplication
- mutation lifecycle (pending/success/error)
- optimistic updates or invalidation control

Reason: React Query is built for server state lifecycle, not just fetching.

### Rule 3: Never fetch directly inside presentational leaf components

Prefer:

- query hooks in `features/<feature>/queries/*`
- components receive data via props or consume feature hook at container level

Reason: easier testing, reuse, and clearer loading/error boundaries.

## Why "Heavy Logic" Belongs in React Query and Features

### What counts as heavy logic

- transforming request params
- retries/refetch policy
- stale/fresh behavior
- mutation success invalidation
- mapping API response shape to UI-ready shape

### Why this is not just convenience

- Keeps components focused on rendering.
- Prevents duplicate logic across pages/components.
- Creates one place to change cache policy and invalidation rules.
- Reduces race conditions compared to manual `useEffect + useState` fetch code.

## State Placement Decisions

Use this order:

1. Local component state (`useState`) for local UI toggles.
2. Feature store for feature-wide UI state (filters, panel open state).
3. Global store only for truly global UI state.
4. React Query cache for server state.

Never mirror React Query data into Zustand unless there is a very specific reason.

## Practical Decision Tree

Before creating a new file, ask these questions in order:

1. Is this route-level behavior (`page/layout/loading/error/metadata`)?
   - Yes -> `src/app/...`
2. Is this used only by one feature?
   - Yes -> `src/features/<feature>/...`
3. Is this a low-level visual primitive?
   - Yes -> `src/components/ui`
4. Is this a cross-feature app component?
   - Yes -> `src/components/shared`
5. Is this server data lifecycle logic?
   - Yes -> feature `queries/` with React Query
6. Is this UI-only state shared inside one feature?
   - Yes -> feature `store/` or local hook
7. Is this infra used by many features?
   - Yes -> `src/lib`

## Centralize vs Feature-Local Decision Matrix

Use this table when deciding where a new file should live.

| Type of code | Default location | Centralize now? | Why |
|---|---|---|---|
| API client instance, interceptors, auth headers | `src/lib/api-client.ts` | Yes | App-wide infrastructure |
| Query client defaults, provider, shared query keys | `src/lib/query/*` | Yes | One cache policy source |
| Feature list/detail query hooks | `src/features/<feature>/queries/*` | No | Domain-specific params and invalidation rules |
| Form field primitives (`FormInput`, `FormSelect`) | `src/components/forms/*` | Yes | Reused across many forms |
| Feature form schema/submit mapping | `src/features/<feature>/forms/*` | No | Business rules differ per feature |
| UI-only filters/toggles for one feature | `src/features/<feature>/store/*` | No | Local ownership, less global coupling |
| Auth/session app-level state | `src/contexts/*` or global store | Yes | Needed across routes |

### Promotion Rule (Feature -> Shared)

Promote code to shared only when all are true:

1. Used by at least 2-3 features.
2. API shape is stable (no feature-specific branching every time).
3. Moving it reduces duplication without hiding domain intent.

If these are not true, keep it feature-local.

### Examples from this project

- `usePhotographersQuery` stays feature-local in `src/features/photographers/queries/` because filters/pagination are photographer-domain concerns.
- `FormInput` stays shared in `src/components/forms/` because many features can reuse the same field primitive.
- photographer filter store belongs in `src/features/photographers/store/` because it is not app-global state.

## Changes Applied in This Refactor

1. Moved photographer query hooks:
   - from `src/lib/query/photographers.ts`
   - to `src/features/photographers/queries/photographers.queries.ts`

2. Moved photographer filter store:
   - from `src/stores/photographer-filters.ts`
   - to `src/features/photographers/store/photographer-filters.store.ts`

3. Updated imports in:
   - `src/features/photographers/PhotographersPage.tsx`
   - `src/features/photographer-profile/PhotographerProfilePage.tsx`
   - `src/app/(public)/book/[photographerId]/page.tsx`

## Next Architecture Improvement

- Move remaining feature-specific query modules from `src/lib/query/*` into feature folders.
- Keep `src/lib/query` for shared keys and client defaults only.
- Add route-segment `loading.tsx` and `error.tsx` for important public pages where missing.
