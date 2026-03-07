# PHOTOPHILE - PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-01
**Type:** Full-Stack Photography Marketplace
**Stack:** Next.js 15 (Frontend) + Express/TypeScript (Backend)

## Overview

Photophile (codename: Dukan) connects photographers with clients. Photographers create profiles, upload portfolios, manage bookings. Clients discover, book, and review photographers.

---

## Structure

```
├── backend/                # Express.js API
│   └── src/
│       ├── app.ts          # Entry point
│       ├── config.ts       # Environment config
│       ├── constants.ts    # App constants
│       ├── controllers/    # Route handlers
│       ├── db/             # Database connection
│       ├── middlewares/    # Express middleware
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── types/          # TypeScript types
│       ├── utils/          # Helpers
│       └── validations/    # Zod schemas
│
└── frontend/               # Next.js 15 App
    └── src/
        ├── app/            # App Router pages
        ├── components/     # React components
        │   ├── forms/      # Form components
        │   ├── gallery/    # Gallery components
        │   ├── layout/     # Layout components
        │   ├── photographer/ # Photographer components
        │   ├── search/     # Search components
        │   ├── filters/    # Filter components
        │   └── ui/         # shadcn/ui components
        ├── contexts/       # React contexts (auth)
        ├── hooks/          # Custom React hooks
        ├── lib/            # Utilities
        │   └── validations/ # Frontend Zod schemas
        ├── styles/         # CSS styles
        └── middleware.ts   # Next.js middleware
```

---

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| API entry | `backend/src/app.ts` | Express setup, middleware, routes |
| Database | `backend/src/db/` | MongoDB connection |
| Auth (backend) | `backend/src/controllers/user.controller.ts` | JWT login/register |
| Auth middleware | `backend/src/middlewares/auth.middleware.ts` | JWT verification |
| Models | `backend/src/models/` | User, Photographer, Portfolio, Booking, Review |
| API routes | `backend/src/routes/` | Mounted in app.ts |
| Validations | `backend/src/validations/` | Zod schemas |
| Frontend entry | `frontend/src/app/` | Next.js pages |
| Auth context | `frontend/src/contexts/` | React auth provider |
| Middleware | `frontend/src/middleware.ts` | Route protection |
| API client | `frontend/src/lib/api-client.ts` | Axios with interceptors |

---

## Conventions

### Backend

**Controllers:** Export handler functions, use async/await
```typescript
// controllers/example.controller.ts
export const getItems = async (req: Request, res: Response) => {
  // ... logic
  res.json({ data });
};
```

**Routes:** Mount controllers in route files
```typescript
// routes/example.routes.ts
import { Router } from "express";
import { getItems } from "../controllers/example.controller";
const router = Router();
router.get("/", getItems);
export default router;
```

**Models:** Mongoose with TypeScript
- Define interface extending `Document`
- Export model as default
- Use `{ timestamps: true }`

**Middleware Pattern:**
```typescript
// JWT auth middleware
// Attaches `user` to req object after verifying token
```

### Frontend

- **App Router:** All pages in `app/` directory
- **Client components:** Mark with `"use client"`
- **API calls:** Use axios, base URL from env
- **Auth:** Context-based, stores tokens, redirects on 401

---

## Error Handling

### Backend Error Handling

**ApiError Class:** Custom error class for consistent API responses
```typescript
// backend/src/utils/ApiError.ts
class ApiError extends Error {
  public readonly success: boolean = false;
  public readonly statusCode: number;
  public readonly data: null = null;
  public readonly errors: unknown;
  public readonly stack?: string;
  public message = "Something went wrong";

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    errors: unknown = "",
    stack = ""
  ) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
      stack: appConfig.debug ? this.stack : undefined,
    }
  }
}
```

**asyncHandler Wrapper:** Eliminates try-catch boilerplate
```typescript
// backend/src/utils/asyncHandler.ts
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
export const loginUser = asyncHandler(async (req, res) => {
  throw new ApiError(401, "Invalid credentials");
});
```

**Centralized Error Handler:** Handles all error types
```typescript
// backend/src/middlewares/errorHandler.middleware.ts
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
    return res.status(400).json(
      new ApiError(400, "Validation failed", formattedErrors).toJSON()
    );
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) { ... }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) { ... }

  // Fallback for unhandled errors
  return res.status(500).json(new ApiError(500, message).toJSON());
};
```

---

## Security

### Backend Security

**Security Headers Middleware:**
```typescript
// backend/src/middlewares/security.middleware.ts
export const securityHeaders = (req, res, next) => {
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

**Rate Limiting:**
```typescript
// backend/src/middlewares/rateLimiter.middleware.ts
export const rateLimiter = (windowMs = 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    // Track requests per IP
    // Return 429 if limit exceeded
  };
};

// Auth endpoints get stricter limits
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 5); // 5 per 15 min
export const apiRateLimiter = rateLimiter(60 * 1000, 100); // 100 per minute
```

**Cookie Configuration:**
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

### Frontend Security

**Next.js Middleware for Auth:**
```typescript
// frontend/src/middleware.ts
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = await verifyToken(accessToken);

  // Protect dashboard routes
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

---

## Validation

### Backend Validation

**Zod Schemas:**
```typescript
// backend/src/validations/auth.validation.ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((pwd) => /[A-Z]/.test(pwd), { message: "Need uppercase" })
    .refine((pwd) => /[a-z]/.test(pwd), { message: "Need lowercase" })
    .refine((pwd) => /\d/.test(pwd), { message: "Need number" })
    .refine((pwd) => /[!@#$%^&*]/.test(pwd), { message: "Need special char" }),
});

export type loginType = z.infer<typeof LoginSchema>;
```

**validateRequest Middleware:**
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

// Route usage
router.post("/login", validateRequest(LoginSchema), loginUser);
```

---

## API Versioning

All API routes include a version prefix (`/api/v1/`):

```typescript
// backend/src/utils/helper.ts
export const createVersionRoute = (route: string, version: number = 1) => 
  "/api/v" + version + "/" + route;

// Usage in app.ts
app.use(createVersionRoute("users"), userRouter);
// Results in: /api/v1/users
```

---

## Frontend Patterns

### API Client with Interceptors

```typescript
// frontend/src/lib/api-client.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_URL}/users/refresh-token`, {}, { withCredentials: true });
        return apiClient(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
```

### shadcn/ui Usage

UI components are built with shadcn/ui (Radix UI primitives + Tailwind):

```typescript
// Components located in frontend/src/components/ui/
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
```

Components are copy-paste (not npm packages), giving full control over styling and behavior.

---

## API Endpoints

Base: `/api/v1`

| Resource | Path | Description |
|----------|------|-------------|
| Auth | `/users` | Register, login, refresh |
| Photographers | `/photographers` | Profiles, search |
| Portfolio | `/portfolio` | Uploads, CRUD |
| Bookings | `/bookings` | Create, manage |
| Reviews | `/reviews` | Ratings, comments |

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=3001
ORIGIN_HOSTS=http://localhost:3000
APP_DEBUG=false

# JWT
ACCESS_TOKEN_SECRET=random-string
ACCESS_TOKEN_EXPIRY=6h
REFRESH_TOKEN_SECRET=random-string
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=photophile
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ACCESS_TOKEN_SECRET=random-string  # For middleware JWT verification
```

---

## Commands

```bash
# Backend
cd backend/
npm install
npm run dev         # nodemon + ts-node on port 3001
npm run build       # tsc compile
npm start           # node dist/index.js

# Frontend
cd frontend/
npm install
npm run dev         # Next.js dev on port 3000 (Turbopack)
npm run build       # Next.js build
```

---

## Testing

**Note:** Testing is not yet implemented in this project. When adding tests, consider:
- Backend: Jest + Supertest for API testing
- Frontend: Jest + React Testing Library
- E2E: Playwright for critical user flows

---

## Notes

- **Two separate servers** - frontend (3000) + backend (3001)
- **CORS:** Backend allows requests from `ORIGIN_HOSTS`
- **Auth:** JWT access token (6h expiry) + refresh token (10d)
- **Uploads:** Multer + Cloudinary for images
- **Database:** MongoDB with Mongoose
- **Status:** Frontend WIP, Backend mostly complete
- **Documentation:** See `docs/decisions.md` for architectural decisions and `docs/patterns.md` for detailed coding patterns
