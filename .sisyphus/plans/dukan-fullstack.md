# Dukan - Photography Marketplace Full-Stack Plan

## TL;DR

> **Quick Summary**: Build complete frontend for Dukan photography marketplace using Next.js 15 (App Router) + Tailwind CSS. Backend is already built with Express/MongoDB and has shareable portfolio links via username.

> **Version Compatibility Verified**:
> - Next.js 15 (React 19, async params)
> - Node.js 20+ (current: v24 - compatible)
> - TypeScript 5.1+
> - JWT via HTTP-only cookies with jose library

> **Deliverables**:
> - Frontend: Next.js application with authentication, photographer search, public portfolio pages, booking flow, and user dashboards
> - Backend: CORS configuration for frontend origin, any missing endpoints

> **Estimated Effort**: XL (Large project)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Setup → Auth + Landing + Search + Portfolio → Booking + Dashboard

---

## Context

### Original Request
Build complete backend and frontend setup end-to-end for a photographer marketplace where each photographer gets a sharable link for their portfolio.

### Current Backend State
- **Express.js + TypeScript + MongoDB**
- User authentication (JWT with access + refresh tokens)
- Photographer profiles with unique username (shareable links!)
- Portfolio management (Cloudinary image uploads)
- Bookings system with status tracking (pending/confirmed/completed/cancelled)
- Reviews system
- Browse/search with filters (location, specialty, price, pagination)
- Security: rate limiting, security headers, Zod validation

### Interview Summary
**Key Decisions**:
- Frontend: **Next.js 15 (App Router)** with Tailwind CSS
- Scope: **Core Features** (Landing, Auth, Search, Portfolio Pages, Booking, Dashboard)
- Testing: **Not included** (focus on building features)
- Auth: **HTTP-only cookies** with jose library (not jsonwebtoken)

---

## Work Objectives

### Core Objective
Complete the full-stack photography marketplace by building:
1. Next.js frontend that consumes existing backend APIs
2. Public shareable portfolio pages (SEO-optimized)
3. Complete user journey from discovery to booking

### Concrete Deliverables
- Next.js 15 application with App Router
- Tailwind CSS styling
- Authentication flow (login/register/logout)
- Landing page with hero section
- Photographer search with filters (location, specialty, price)
- Public portfolio pages at `/photographers/:username`
- Booking flow (request booking, view status)
- User dashboard (manage profile, bookings)
- Photographer dashboard (manage portfolio, bookings)

### Must Have
- Responsive design (mobile + desktop)
- JWT authentication integration
- Image optimization with Cloudinary
- Protected routes (dashboard)
- URL-based search state (shareable search URLs)

### Must NOT Have
- Payment processing (booking requests only)
- Real-time chat/notifications
- Admin dashboard (out of scope)
- Complex calendar UI (simple date picker only)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (not requested)
- **Automated tests**: NO
- **Agent-Executed QA**: YES - All verification via Playwright + curl

### QA Policy
Every task includes agent-executed QA scenarios:
- **Frontend/UI**: Playwright - Navigate, interact, assert DOM, screenshot
- **API Integration**: curl - Verify backend communication
- **Routes**: curl - Verify pages load correctly

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - Foundation):
├── Task 1: Next.js + Tailwind Setup + API Client
└── Task 2: Backend CORS + Environment Config

Wave 2 (After Wave 1 - Core Features, MAX PARALLEL):
├── Task 3: Authentication Flow (Login/Register/Middleware)
├── Task 4: Global Layout + Landing Page
├── Task 5: Photographer Browse/Search with Filters
├── Task 6: Public Portfolio Pages (:username)
└── Task 7: Booking Flow (Form + API)

Wave 3 (After Wave 2 - Integration):
├── Task 8: User Dashboard
├── Task 9: Photographer Dashboard
└── Task 10: Final Integration + Polish

Critical Path: Task 1 → Task 3 → Task 7/8/9
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 2)
```

---

## TODOs

 [x] 1. Next.js 15 + Tailwind Setup + API Client

  **What to do**:
  - Initialize Next.js 15 project with TypeScript and App Router
  - **IMPORTANT**: Use `npx create-next-app@latest` which installs Next.js 15 by default
  - Configure Tailwind CSS with custom theme colors
  - Set up `next.config.js` with Cloudinary image domains
  - Create base API client (axios instance) with interceptors for JWT
  - Install `jose` library for JWT handling (not jsonwebtoken)
  - Create .env.local with backend API URL
  - Verify dev server starts on port 3000

  **Next.js 15 Compatibility Notes**:
  - React 19 is bundled - ensure `@types/react@latest` is installed
  - `params` and `searchParams` in dynamic routes are **Promises** - must await them:
    ```typescript
    // app/photographers/[username]/page.tsx
    export default async function Page({ params }: { params: Promise<{ username: string }> }) {
      const { username } = await params;
      // ...
    }
    ```

  **Must NOT do**:
  - Don't use jsonwebtoken library (use jose for edge compatibility)
  - Don't use localStorage for tokens (use HTTP-only cookies)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Standard setup but requires careful configuration for Cloudinary and API client
  - **Skills**: [`dev-browser`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3, 4, 5, 6, 7, 8, 9
  - **Blocked By**: None

  **References**:
  - Next.js 15 Docs: https://nextjs.org/docs/app
  - Cloudinary: `/home/venkat/ecom/backend/src/utils/cloudinary.ts`

  **Acceptance Criteria**:
  - [ ] `npx create-next-app@latest frontend` creates Next.js 15 project
  - [ ] `curl -s http://localhost:3000` returns Next.js page (200 OK)
  - [ ] `next.config.js` contains `images.remotePatterns` for `res.cloudinary.com`
  - [ ] `jose` package installed for JWT

  **QA Scenarios**:
  
  ```
  Scenario: Next.js 15 dev server starts correctly
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. cd frontend && npm run dev &
      2. Wait 15s for server to start (Next.js 15 is slower to start)
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
    Expected Result: "200"
    Evidence: .sisyphus/evidence/task1-server-start.txt
  
  Scenario: React 19 is installed
    Tool: Bash
    Preconditions: Project created
    Steps:
      1. cat frontend/package.json | grep -A2 '"react"'
    Expected Result: "react": "^19" or higher
    Evidence: .sisyphus/evidence/task1-react-version.txt
  ```

  **Commit**: YES
  - Message: `feat(frontend): init Next.js 15 with Tailwind and API client`
  - Files: `frontend/`

---

- [x] 2. Backend CORS + Environment Configuration

  **What to do**:
  - Update Express CORS configuration to allow localhost:3000
  - Verify JWT token handling works with frontend (HTTP-only cookies)
  - Test that backend accepts requests from frontend origin
  - Update ORIGIN_HOSTS in .env to include localhost:3000

  **Must NOT do**:
  - Don't add new endpoints - only fix CORS

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small config change
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (must run after Task 1 starts)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3-9
  - **Blocked By**: Task 1

  **References**:
  - Backend CORS: `/home/venkat/ecom/backend/src/app.ts:43-49`

  **Acceptance Criteria**:
  - [ ] Backend accepts requests from http://localhost:3000
  - [ ] OPTIONS requests return proper CORS headers

  **QA Scenarios**:
  
  ```
  Scenario: CORS allows frontend origin
    Tool: Bash
    Preconditions: Backend running on port 3001
    Steps:
      1. curl -s -I -X OPTIONS -H "Origin: http://localhost:3000" http://localhost:3001/api/v1/photographers/browse
    Expected Result: Headers contain "Access-Control-Allow-Origin: http://localhost:3000"
    Evidence: .sisyphus/evidence/task2-cors.txt
  ```

  **Commit**: YES
  - Message: `fix(backend): configure CORS for frontend origin`
  - Files: `backend/src/app.ts`
---
