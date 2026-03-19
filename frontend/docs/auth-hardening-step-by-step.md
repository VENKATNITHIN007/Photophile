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

### Step 3 - Harden 401 Refresh Conditions (Planned)

Goal:

- Refresh only when token expiration is the likely cause.

Plan:

1. Add endpoint skip list in interceptor for auth routes.
2. Add `_retry` guard (already present) and keep request queue behavior.
3. Ensure refresh endpoint path matches backend route exactly (`/users/refresh-token`).
4. On refresh failure, clear auth state and redirect to login for protected requests only.

Why this matters:

- Handles login/register failures correctly.
- Keeps refresh flow predictable for expired sessions.

---

### Step 4 - Unify Auth Mutations (Planned)

Goal:

- Standardize mutation handling across auth pages.

Plan:

1. Create feature-level auth query hooks (`features/auth/queries/*`) for login/register/forgot/reset/verify.
2. Use mutation `isPending` as single loading source.
3. Keep form validation in zod + react-hook-form.
4. Keep user-friendly error mapping in one helper.

Why this matters:

- Less repeated async/loading/error code.
- Easier to test and reason about.

---

### Step 5 - Add Route Segment UX States for Auth Group (Planned)

Goal:

- Use App Router boundaries consistently.

Plan:

1. Add `src/app/(auth)/loading.tsx`.
2. Add `src/app/(auth)/error.tsx`.
3. Keep route-level failure/loading UI here, not duplicated in each page.

Why this matters:

- Cleaner route behavior and less duplication.

---

### Step 6 - Validate Edge Cases (Planned)

Required checks:

1. Wrong password on login returns page error only, no refresh attempt.
2. Expired access token with valid refresh token retries protected request successfully.
3. Expired refresh token redirects user to login.
4. Unknown email in forgot-password still shows generic success message.
5. Invalid/expired reset token shows stable invalid link state.
6. Invalid verify-email token shows stable error state.
7. Authenticated user visiting `/login` or `/register` gets redirected.
8. Unauthenticated user visiting protected routes gets redirected to login with `redirect` param.

## Working Notes

Use this section as we implement each step:

- [x] Step 1 complete
- [x] Step 2 complete
- [ ] Step 3 complete
- [ ] Step 4 complete
- [ ] Step 5 complete
- [ ] Step 6 complete
