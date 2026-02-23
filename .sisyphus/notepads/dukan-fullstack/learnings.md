- Next.js 15 dev server initialization requires explicit version specification (e.g., npx create-next-app@15) to avoid resolving an unstable or future version tag.
- Tailwind v4 uses @theme inline configuration inside globals.css instead of tailwind.config.ts.
- Cloudinary domains configured correctly using res.cloudinary.com for next/image remote patterns.
- Axios with interceptors allows automated handling of HTTP-only cookie-based tokens.

## Frontend API Interceptor Learnings
- When using HTTP-only cookies in Next.js + external backend, the Axios client must have `withCredentials: true` to forward cookies cross-origin.
- The external backend `cors` must be configured with `credentials: true` and a specific `origin` for this to work properly.
- Since Next.js 15 App Router heavily utilizes Server Components, any JWT parsing or verifying required during rendering must use edge-compatible libraries like `jose`, not `jsonwebtoken`.
- Tailwind CSS v4 utilizes standard CSS `@import "tailwindcss"` and `@theme inline` in `globals.css` instead of a standalone `tailwind.config.ts`, simplifying the config.

## ESLint Learnings
- Fixed type `any` for error reasons in promise handlers (specifically `reject: (reason?: any) => void`) by typing it as `unknown`, conforming to stricter Typescript standards.
- Removed unused imports (like `jwtVerify` from `jose` when tokens are not processed directly in the specific API client module) to pass Next.js strict build linting.
- Created robust debounced search and filtering logic for API endpoints with pagination
- Verified that frontend/src/app/photographers/page.tsx line 83 already uses 'unknown' type for the catch block.
- Confirmed that 'npm run build' and 'npm run lint' pass in the frontend directory.
- Implemented public photographer portfolio page dynamic route fetching profile, portfolio and reviews concurrently using fetch
- Created booking flow using Next.js App Router and Native React form components.
- Stored location and event type inside the `message` field since the backend schema only supported `message`, allowing extending unstructured data smoothly.
- Re-used photographer username to query photographer info which natively supports Next.js routing, and used the photographer document's `_id` for booking generation.
- Dashboard completed. API endpoints GET /bookings/requests/all, POST /portfolio/add, PATCH /photographers/update successfully integrated with fallback to the originally requested endpoints.
