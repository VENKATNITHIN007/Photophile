
## Frontend Setup Decisions
- Used **Next.js 15 App Router** for the frontend to align with modern React patterns (React 19, Server Components).
- Selected **Tailwind v4** and defined photography brand colors (Obsidian, Ash, Silver, Cyan, Teal) in `globals.css` using the new `@theme inline` API.
- Chosen **Axios** with `withCredentials: true` as the API client since the backend relies on HTTP-only cookies for tokens. Implemented an interceptor logic to handle 401 Unauthorized errors and attempt token refresh.
- Included the **jose** library for JWT verification and decoding on the Edge, as Next.js Server Components and Middleware run on the Edge Runtime which does not support Node.js `crypto` (used by `jsonwebtoken`).
