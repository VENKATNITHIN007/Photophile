# Architectural Decisions

This document records the major architectural decisions made for the Photophile project based on actual codebase analysis.

---

## Architecture

### Decision: Separate Frontend and Backend Codebases

**What:** The project is split into two independent codebases: `frontend/` (Next.js) and `backend/` (Express.js).

**Why:**
- Clean separation of concerns between presentation and API layers
- Allows independent deployment and scaling
- Frontend can be deployed to edge networks (Vercel) while backend runs on traditional servers
- Enables different teams to work on each layer without blocking

**Consequences:**
- Requires CORS configuration to allow cross-origin communication
- Need to manage two separate dependency trees and build processes
- Environment variables must be synchronized across both projects
- API contract must be maintained between frontend and backend

---

### Decision: API Versioning via URL Path

**What:** All API routes include a version prefix (`/api/v1/`).

**Code:**
```typescript
// backend/src/utils/helper.ts
export const createVersionRoute = (route: string, version: number = 1) => 
  "/api/v" + version + "/" + route;

// Usage in app.ts
app.use(createVersionRoute("users"), userRouter);
```

**Why:**
- Allows backward-compatible API evolution
- Clients can migrate to new versions at their own pace
- Clear contract versioning for external consumers

**Consequences:**
- All routes must include version prefix
- Breaking changes require new version folder or conditional logic
- Frontend must update base URLs when upgrading API versions

---

## Backend

### Decision: Express.js with TypeScript

**What:** Backend built with Express.js framework using TypeScript for type safety.

**Why:**
- Express is battle-tested, well-documented, and has a vast ecosystem
- TypeScript catches errors at compile time and improves IDE support
- Strong typing for request/response objects prevents runtime errors

**Consequences:**
- Requires build step (`tsc`) before deployment
- Need to maintain type definitions for middleware and models
- Development requires `ts-node` for hot reloading

---

### Decision: MongoDB with Mongoose ODM

**What:** MongoDB as the primary database with Mongoose for schema modeling.

**Code:**
```typescript
// backend/src/db/index.ts
export default async function connectToDB() {
  const connection = await mongoose.connect(MONGO_URL, {
    dbName: DB_NAME,
  });
  // Ping to confirm connectivity
  await connection.connection.db?.admin().command({ ping: 1 });
}
```

**Why:**
- Document-oriented storage fits the flexible data models (users, photographers, portfolios)
- Mongoose provides schema validation, middleware, and query building
- Native support for nested documents (portfolio images within photographer profiles)

**Consequences:**
- No strict schema enforcement at database level (enforced in application)
- Requires careful handling of ObjectId references and population
- Need to handle MongoDB-specific errors (duplicate keys, cast errors) explicitly

---

### Decision: JWT Authentication with HTTP-Only Cookies

**What:** Authentication uses JWT tokens stored in HTTP-only cookies with dual token strategy (access + refresh).

**Code:**
```typescript
// backend/src/config.ts
export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const accessTokenCookieOptions = {
  ...clearCookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export const refreshTokenCookieOptions = {
  ...clearCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
```

**Why:**
- HTTP-only cookies prevent XSS attacks (JavaScript cannot access tokens)
- `sameSite: 'strict'` prevents CSRF attacks on modern browsers
- Dual tokens allow short-lived access tokens (security) with long-lived refresh tokens (UX)
- Refresh tokens are hashed in database for additional security

**Consequences:**
- Requires `credentials: true` in both CORS and axios configuration
- Token refresh logic must handle concurrent requests (request queuing)
- Frontend middleware needs JWT secret to verify tokens server-side

---

### Decision: Zod for Runtime Validation

**What:** Zod schemas validate all incoming request data.

**Code:**
```typescript
// backend/src/middlewares/validateRequest.middleware.ts
export const validateRequest = (schema: ZodType) => {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse({
        ...req.body,
        ...req.files,
        ...req.file,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

**Why:**
- TypeScript-only validation is compile-time; Zod provides runtime safety
- Declarative schemas are more readable than imperative validation
- Automatic error messages with path information

**Consequences:**
- Validation schemas must be maintained alongside TypeScript interfaces
- File uploads require special handling (merging `req.files` into validation)
- Zod errors need formatting in the error handler middleware

---

### Decision: Custom Error Handling with ApiError Class

**What:** Custom `ApiError` class standardizes error responses across the application.

**Code:**
```typescript
// backend/src/utils/ApiError.ts
class ApiError extends Error {
  public readonly success: boolean = false;
  public readonly statusCode: number;
  public readonly data: null = null;
  public readonly errors: unknown;

  constructor(statusCode: number = 500, message: string = "Something went wrong", ...) {
    super(message);
    this.statusCode = statusCode;
    // Stack traces only in debug mode
    this.stack = appConfig.debug ? this.stack : undefined;
  }
}
```

**Why:**
- Consistent error response format across all endpoints
- Centralized error handling middleware catches all error types
- Stack traces hidden in production for security

**Consequences:**
- All errors must be thrown as `ApiError` instances for proper handling
- Third-party errors need wrapping
- Error handler must recognize multiple error types (Zod, Mongoose, MongoDB)

---

### Decision: asyncHandler Wrapper for Controllers

**What:** Higher-order function wraps async route handlers to catch errors automatically.

**Code:**
```typescript
// backend/src/utils/asyncHandler.ts
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // No try-catch needed - errors forwarded to error handler
});
```

**Why:**
- Eliminates repetitive try-catch blocks in every controller
- Ensures all async errors reach the error handling middleware
- Cleaner controller code focused on business logic

**Consequences:**
- All route handlers must use `asyncHandler` wrapper
- Errors are always passed to centralized handler (less granular control)

---

### Decision: In-Memory Rate Limiting

**What:** Custom rate limiter stores request counts in memory (Node.js process).

**Code:**
```typescript
// backend/src/middlewares/rateLimiter.middleware.ts
const store: RateLimitStore = {};

export const rateLimiter = (windowMs: number = 60 * 1000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    // Track and limit requests per IP
  };
};

// Auth endpoints get stricter limits
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 5); // 5 per 15 min
```

**Why:**
- Simple implementation without external dependencies (Redis)
- Sufficient for single-instance deployments
- Different limits for different endpoint types (auth vs general API)

**Consequences:**
- Rate limits are per-instance (not shared across multiple servers)
- Memory usage grows with unique IP addresses
- Not suitable for production multi-instance deployments without sticky sessions

---

### Decision: Cloudinary for Image Uploads

**What:** Cloudinary handles image storage, transformation, and delivery.

**Why:**
- Offloads image processing and storage from application servers
- Automatic image optimization and format conversion
- CDN delivery for fast global access
- Built-in transformations (resizing, cropping) via URL parameters

**Consequences:**
- Dependency on external service (vendor lock-in)
- Requires environment configuration for cloud name, API key, and secret
- Upload failures must be handled gracefully

---

## Frontend

### Decision: Next.js 15 with App Router

**What:** Frontend uses Next.js 15 with the App Router architecture.

**Code:**
```typescript
// frontend/src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ...`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Why:**
- App Router enables Server Components by default (reduced client JS)
- Built-in layouts, loading states, and error boundaries
- File-system based routing reduces configuration
- Turbopack for faster development builds

**Consequences:**
- "use client" directive needed for client-side interactivity
- Different data fetching patterns than Pages Router
- Middleware runs on Edge Runtime (limited Node.js APIs)

---

### Decision: Tailwind CSS v4 with CSS Variables

**What:** Tailwind CSS v4 with CSS custom properties for theming.

**Code:**
```css
/* frontend/src/app/globals.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Why:**
- Utility-first CSS reduces custom CSS files
- v4 uses CSS-native configuration (no tailwind.config.js)
- CSS variables enable runtime theme switching

**Consequences:**
- HTML classes become verbose
- Learning curve for utility-first approach
- v4 is newer with potentially less community content

---

### Decision: React Context for Authentication State

**What:** Auth state managed via React Context (`AuthProvider`) rather than external libraries.

**Code:**
```typescript
// frontend/src/contexts/auth-context.tsx
"use client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const response = await apiClient.get("/users/me");
    // Map backend response to frontend User interface
    setUser({
      id: userData.id || userData._id,
      fullName: userData.fullName || userData.name,
      ...
    });
  };
  ...
}
```

**Why:**
- No external state management dependency (Redux, Zustand)
- Sufficient for auth state (relatively simple, global)
- Built-in React feature (no additional bundle size)

**Consequences:**
- Context re-renders all consumers when auth state changes
- Must be a Client Component ("use client")
- No built-in persistence (relies on HTTP-only cookies)

---

### Decision: Axios with Request/Response Interceptors

**What:** Axios instance with interceptors for token refresh and error handling.

**Code:**
```typescript
// frontend/src/lib/api-client.ts
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue concurrent requests during token refresh
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }
      
      // Attempt refresh
      await axios.post(`${API_URL}/users/refresh-token`, {}, { withCredentials: true });
      return apiClient(originalRequest);
    }
  }
);
```

**Why:**
- Interceptors enable global request/response transformation
- Automatic token refresh on 401 responses
- Request queuing prevents multiple simultaneous refresh attempts

**Consequences:**
- Additional bundle size compared to fetch API
- Must handle refresh token failures (logout user)
- Interceptor logic can be complex to debug

---

### Decision: Next.js Middleware for Route Protection

**What:** Next.js middleware handles authentication checks at the edge.

**Code:**
```typescript
// frontend/src/middleware.ts
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Verify JWT server-side using jose (Edge-compatible)
  const isAuthenticated = await verifyToken(accessToken);
  
  // Protect dashboard routes
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}
```

**Why:**
- Runs at the edge (fast, before hitting application servers)
- Prevents unauthorized access before page renders
- Can read HTTP-only cookies (unlike client-side code)

**Consequences:**
- Edge Runtime limitations (cannot use Node.js crypto, must use `jose`)
- Duplicated JWT verification logic (also in backend)
- Must maintain `matcher` config for route filtering

---

### Decision: Shadcn/UI Component Library

**What:** UI built with Shadcn/UI components (Radix UI primitives + Tailwind).

**Why:**
- Copy-paste components (full control, no dependency)
- Built on accessible Radix UI primitives
- Consistent styling with Tailwind CSS

**Consequences:**
- Components live in codebase (maintenance responsibility)
- Updates require manual copying from Shadcn registry
- Initial setup requires running Shadcn CLI

---

## Security

### Decision: Security Headers Middleware

**What:** Custom middleware adds security headers to all responses.

**Code:**
```typescript
// backend/src/middlewares/security.middleware.ts
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Frame-Options", "DENY"); // Prevent clickjacking
  res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing
  res.setHeader("X-XSS-Protection", "1; mode=block"); // Enable XSS filter
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self'; ...");
  
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
};
```

**Why:**
- Defense in depth against common web vulnerabilities
- Headers applied globally (cannot be forgotten on individual routes)
- HSTS ensures HTTPS-only in production

**Consequences:**
- CSP must be adjusted if adding external scripts/images
- Some headers deprecated in modern browsers (X-XSS-Protection)
- Strict CSP may block legitimate resources

---

### Decision: CORS with Credentials

**What:** CORS configured to allow credentials (cookies) from specific origins.

**Code:**
```typescript
// backend/src/app.ts
const allowedHost = process.env.ORIGIN_HOSTS
  ? process.env.ORIGIN_HOSTS.split(",").map((h) => h.trim())
  : ["http://localhost:3000", "http://localhost:3002"];

app.use(cors({
  origin: allowedHost,
  credentials: true,
  optionsSuccessStatus: 200,
}));
```

**Why:**
- `credentials: true` allows HTTP-only cookies to be sent cross-origin
- Whitelist approach (only known origins allowed)
- Environment-based origin configuration

**Consequences:**
- Cannot use wildcard (`*`) with credentials
- Must update ORIGIN_HOSTS when adding new frontend deployments
- Preflight OPTIONS requests add latency

---

### Decision: Password Strength Validation

**What:** Custom validation enforces strong password requirements.

**Code:**
```typescript
// backend/src/utils/helper.ts
export const isPasswordStrong = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    throw new ApiError(409, "Password length must be 8 characters");
  }
  // Additional checks...
};
```

**Why:**
- Prevents weak passwords that could be brute-forced
- Clear error messages guide users to compliant passwords
- Server-side validation (cannot be bypassed)

**Consequences:**
- May frustrate users with strict requirements
- Rules must be communicated clearly in UI
- Changing rules does not affect existing passwords

---

### Decision: bcrypt for Password Hashing

**What:** bcrypt with 12 salt rounds for password hashing.

**Code:**
```typescript
// backend/src/utils/helper.ts
export const hashPassword = async function (password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
};
```

**Why:**
- bcrypt is resistant to rainbow table attacks (salt per password)
- 12 rounds provide good balance of security and performance
- Industry standard with well-tested implementation

**Consequences:**
- Async operation (must await)
- Computational cost increases with rounds
- Cannot retrieve original password (only reset)

---

### Decision: Refresh Token Hashing

**What:** Refresh tokens are hashed before storage in database.

**Code:**
```typescript
// backend/src/utils/helper.ts
const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
await User.findByIdAndUpdate(userData._id, {
  $set: { refreshToken: hashedRefreshToken },
});
```

**Why:**
- Database breach does not expose valid refresh tokens
- Even with database access, attacker cannot use stolen tokens
- Additional layer of defense beyond HTTP-only cookies

**Consequences:**
- Token verification requires bcrypt comparison (slower than string compare)
- Token rotation requires database write on every refresh

---

## Error Handling

### Decision: Centralized Error Handler Middleware

**What:** Single error handler processes all application errors.

**Code:**
```typescript
// backend/src/middlewares/errorHandler.middleware.ts
export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // Handle ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json(new ApiError(400, "Validation failed", formattedErrors).toJSON());
  }
  
  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) { ... }
  
  // Handle MongoDB duplicate key errors
  if (err.code === 11000) { ... }
  
  // Fallback for unhandled errors
  return res.status(500).json(new ApiError(500, message, undefined, stack).toJSON());
};
```

**Why:**
- Consistent error response format across all endpoints
- Type-specific handling (Zod, Mongoose, MongoDB)
- Stack traces only exposed in debug mode

**Consequences:**
- All errors must eventually reach this middleware
- Error types must be imported and checked explicitly
- Unhandled error types return generic 500 responses

---

## Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Architecture | Separate frontend/backend | Independent deployment, clean separation |
| Backend | Express + TypeScript | Mature ecosystem, type safety |
| Database | MongoDB + Mongoose | Flexible schemas, ODM benefits |
| Auth | JWT + HTTP-only cookies | XSS protection, dual token strategy |
| Validation | Zod schemas | Runtime safety, declarative |
| Frontend | Next.js 15 App Router | Server Components, file routing |
| Styling | Tailwind CSS v4 | Utility-first, CSS variables |
| State | React Context | Built-in, sufficient for auth |
| HTTP Client | Axios + interceptors | Token refresh, request queuing |
| Security | Custom middleware | Defense in depth, headers |
| Uploads | Cloudinary | Offload processing, CDN delivery |
