# Auth Hardening Step-by-Step Guide

This is the implementation checklist for making authentication reliable and easy to reason about.

It is intentionally incremental so you can learn while building.

## Scope

Auth pages and runtime behavior:

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`
- `src/contexts/auth-context.tsx`
- `src/lib/api-client.ts`
- `src/middleware.ts`

## Current Risks (Before Hardening)

1. Global 401 refresh behavior can run for auth endpoints too.
   - Example risk: wrong password on login returns 401, interceptor may try token refresh.
2. Auth types were defined inside context, which made sharing harder.
3. Auth flow logic is spread across pages and context without one migration checklist.

## Implementation Steps

### Step 1 - Centralize Auth Types (Completed)

Goal:

- Keep auth types in one file, not inside context.

Changes made:

- Added `src/lib/types/auth.ts` with:
  - `UserRole`
  - `User`
  - `BackendUser`
  - `LoginCredentials`
  - `RegisterData`
- Updated `src/contexts/auth-context.tsx` to import these types.
- Re-exported these types from context to avoid breaking existing imports.

Why this matters:

- Types become reusable across context, hooks, and future feature modules.
- Reduces coupling and duplicate type definitions.

---

### Step 2 - Split API Clients (Completed)

Goal:

- Use separate clients for public and protected requests.

Changes made:

1. Added `publicApiClient` in `src/lib/api-client.ts` with no refresh interceptor.
2. Added `privateApiClient` in `src/lib/api-client.ts` with refresh interceptor.
3. Kept compatibility export `apiClient = privateApiClient` to avoid accidental breakage during migration.
4. Updated API modules to use explicit client by endpoint type:
   - `src/lib/api/auth.ts`
   - `src/lib/api/photographers.ts`
   - `src/lib/api/bookings.ts`
   - `src/lib/api/portfolio.ts`
   - `src/lib/api/users.ts`
5. Updated auth type imports to use `src/lib/types/auth.ts`.
6. Updated `src/contexts/auth-context.tsx` to consume shared auth types.

Why this matters:

- Prevents incorrect refresh attempts on expected auth failures.
- Makes edge case behavior explicit.

---

### Step 3 - Harden 401 Refresh Conditions (Completed)

Goal:

- Refresh only when token expiration is the likely cause.

Changes made:

1. Added explicit refresh skip list in `src/lib/api-client.ts`:
   - `/users/login`
   - `/users/register`
   - `/users/forgot-password`
   - `/users/reset-password`
   - `/users/verify-email`
   - `/users/verify-email/send`
   - `/users/refresh-token`
2. Kept `_retry` guard and queue behavior for concurrent 401 requests.
3. Kept refresh endpoint aligned with backend route: `/users/refresh-token`.
4. Added browser redirect to `/login?redirect=...` when refresh fails on protected requests.
5. Added `skipAuthRefresh` request config option for future per-request control.

Why this matters:

- Handles login/register failures correctly.
- Keeps refresh flow predictable for expired sessions.

---

### Step 4 - Unify Auth Mutations (Completed)

Goal:

- Standardize mutation handling across auth pages.

Changes made:

1. Added feature-level auth mutation hooks in `src/features/auth/queries/auth.mutations.ts`:
   - `useLoginMutation`
   - `useRegisterMutation`
   - `useForgotPasswordMutation`
   - `useResetPasswordMutation`
   - `useVerifyEmailMutation`
2. Updated auth pages to consume these hooks:
   - `src/app/(auth)/login/page.tsx`
   - `src/app/(auth)/register/page.tsx`
   - `src/app/(auth)/forgot-password/page.tsx`
   - `src/app/(auth)/reset-password/page.tsx`
   - `src/app/(auth)/verify-email/page.tsx`
3. Replaced duplicated local loading flags with mutation `isPending` in auth forms.
4. Fixed auth-page lint issues during refactor (unused vars and effect dependencies).

Why this matters:

- Less repeated async/loading/error code.
- Easier to test and reason about.

---

### Step 5 - Add Route Segment UX States for Auth Group (Completed)

Goal:

- Use App Router boundaries consistently.

Changes made:

1. Added `src/app/(auth)/loading.tsx`.
2. Added `src/app/(auth)/error.tsx`.
3. Route-segment auth loading/error UI now exists as shared boundary behavior.

Why this matters:

- Cleaner route behavior and less duplication.

---

### Step 6 - Validate Edge Cases (Completed)

Validation checks and status:

1. Wrong-password login no longer triggers refresh (`publicApiClient` has no refresh interceptor). ✅
2. Protected-request 401 can retry after successful refresh via `privateApiClient` interceptor queue. ✅
3. Refresh failure now redirects to `/login?redirect=...` in browser context. ✅
4. Forgot-password page preserves generic success behavior for both success/failure paths. ✅
5. Reset-password page keeps stable invalid-token and error states. ✅
6. Verify-email page keeps stable invalid/error/success states. ✅
7. Middleware still redirects authenticated users away from `/login` and `/register`. ✅
8. Middleware still redirects unauthenticated users from protected routes with `redirect` param. ✅

Additional verification done:

- Ran `npm run lint` in `frontend/` after refactor.
- Auth-related warnings were resolved.
- Remaining lint warnings are outside auth scope (`src/app/(protected)/dashboard/page.tsx`).

## Working Notes

Use this section as we implement each step:

- [x] Step 1 complete
- [x] Step 2 complete
- [x] Step 3 complete
- [x] Step 4 complete
- [x] Step 5 complete
- [x] Step 6 complete
