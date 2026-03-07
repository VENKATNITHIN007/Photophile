# Photophile Coding Patterns

This document documents the practical coding patterns and conventions used throughout the Photophile codebase. All examples are extracted from actual code.

---

## Table of Contents

1. [Async Handler Pattern](#async-handler-pattern)
2. [Error Handling](#error-handling)
3. [API Response Pattern](#api-response-pattern)
4. [Defensive Programming](#defensive-programming)
5. [Mongoose Model Patterns](#mongoose-model-patterns)
6. [Validation Patterns](#validation-patterns)
7. [Frontend API Client Patterns](#frontend-api-client-patterns)
8. [Auth Context Pattern](#auth-context-pattern)

---

## Async Handler Pattern

The `asyncHandler` wrapper eliminates try-catch boilerplate in Express route handlers by automatically catching errors and passing them to the error handler middleware.

### Implementation

```typescript
// backend/src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Usage in Controllers

```typescript
// backend/src/controllers/user.controller.ts
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("+password");
  if (!userExists) {
    throw new ApiError(401, AUTH_FAILED);  // No try-catch needed!
  }

  if (!userExists.isPasswordCorrect(password)) {
    throw new ApiError(401, AUTH_FAILED);
  }

  // ... rest of handler
});
```

### Key Benefits

- No try-catch blocks in every controller
- Errors automatically forwarded to error handler
- Clean, readable controller code
- Consistent error propagation

---

## Error Handling

### ApiError Class

Custom error class that standardizes error responses across the API.

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

### Global Error Handler Middleware

```typescript
// backend/src/middlewares/errorHandler.middleware.ts
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Handle ApiError (our custom error class)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res
      .status(400)
      .json(new ApiError(400, "Validation failed", formattedErrors).toJSON());
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const formattedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res
      .status(400)
      .json(new ApiError(400, "Validation failed", formattedErrors).toJSON());
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json(new ApiError(400, `Invalid ${err.path}: ${err.value}`).toJSON());
  }

  // Handle MongoDB duplicate key errors
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  ) {
    const mongoErr = err as { keyValue?: Record<string, unknown> };
    const field = Object.keys(mongoErr.keyValue || {})[0] || "field";
    return res
      .status(409)
      .json(new ApiError(409, `Duplicate value for ${field}`).toJSON());
  }

  // Handle generic errors
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const stack = err instanceof Error ? err.stack : undefined;

  console.error("Unhandled Error:", err);

  return res
    .status(500)
    .json(new ApiError(500, message, undefined, stack).toJSON());
};
```

### Error Handling Patterns

**Throwing errors in controllers:**
```typescript
if (!userExists) {
  throw new ApiError(401, AUTH_FAILED);
}
```

**Handling MongoDB duplicate key errors:**
```typescript
try {
  const user = await User.create({ fullName, email, password });
} catch (error: any) {
  // Handle duplicate key error (MongoDB error code 11000)
  if (error.code === 11000 && error.keyPattern?.email) {
    throw new ApiError(409, USER_EXISTS);
  }
  throw error;
}
```

---

## API Response Pattern

### ApiResponse Class

Standardizes successful API responses.

```typescript
// backend/src/utils/ApiResponse.ts
class ApiResponse {
    success: boolean
    statusCode: number
    message: string
    data: unknown

    constructor(
        data: unknown,
        message = "Fetched resource",
        statusCode = 200,
    ) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}
```

### Usage in Controllers

```typescript
// Return successful response
return res
  .cookie("accessToken", accessToken, accessTokenCookieOptions)
  .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
  .json(
    new ApiResponse(
      { user },
      "You've been logged in successfully!",
    ),
  );

// Return with status code
return res
  .status(201)
  .json(new ApiResponse({ user: userData }, "User registered!"));

// Simple response
return res
  .status(200)
  .json(new ApiResponse(req.user, "Fetched current user details"));
```

---

## Defensive Programming

### Null Checks and Fallbacks

**Checking for user existence:**
```typescript
if (!req.user) {
  throw new ApiError(401, AUTH_REQUIRED);
}
```

**Safe property access with fallbacks:**
```typescript
// From auth-context.tsx - mapping backend response with fallbacks
setUser({
  id: userData.id || userData._id || '',
  fullName: userData.fullName || userData.name || '',
  email: userData.email || '',
  role: userData.role || 'user'
});
```

**Optional chaining for nested properties:**
```typescript
const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

const token = req.cookies?.accessToken || 
  req.headers.authorization?.split("Bearer")[1].trim();
```

**Conditional update building:**
```typescript
const updateData: any = {};
if (fullName !== undefined) updateData.fullName = fullName;
if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
if (avatar !== undefined) updateData.avatar = avatar;

const updatedUser = await User.findByIdAndUpdate(
  userId,
  { $set: updateData },
  { new: true, runValidators: true }
);
```

### Type Guards

```typescript
// Checking error types
if (err instanceof ApiError) { ... }
if (err instanceof ZodError) { ... }
if (err instanceof mongoose.Error.ValidationError) { ... }

// Checking for object properties
if (
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code: number }).code === 11000
) { ... }
```

---

## Mongoose Model Patterns

### Interface Definition

```typescript
// backend/src/models/user.model.ts
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  phoneNumber?: string;
  fullName: string;
  avatar?: string;
  password: string;
  refreshToken?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Schema with Methods

```typescript
// Define methods interface
type UserMethods = {
  isPasswordCorrect(password: string): Promise<boolean>
}

// Schema with type parameters
const userSchema = new Schema<IUser, userModel, UserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters long"],
      maxLength: [50, "Full name cannot exceed 50 characters"],
      match: [/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"]
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      index: true,
      trim: true,
      sparse: true,
      lowercase: true,
      validate:{
        validator:function(str:string) {
          return isEmail(str)
        },
        message:"Invalid email adress"
      }
    },
    // ... other fields
  },
  {
    timestamps: true,
  }
);
```

### Pre-save Hooks

```typescript
// Password hashing before save
const SALT_ROUNDS = 12;

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

  next();
});

// Cross-field validation
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phoneNumber) {
    return next(new Error("Either email or phone number is required"));
  }
  next();
});
```

### Instance Methods

```typescript
userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
```

### toJSON Transform

```typescript
// Remove sensitive fields from JSON output
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, refreshToken, __v, ...rest } = ret;
    return rest;
  },
});
```

### Index Definitions

```typescript
// backend/src/models/photographer.model.ts
// Text index for search
photographerSchema.index({ username: "text", bio: "text", location: "text" });

// Compound index for filters
photographerSchema.index({ location: 1, priceFrom: 1 });
photographerSchema.index({ specialties: 1, priceFrom: 1 });
```

### Selective Field Querying

```typescript
// Include password field (excluded by default)
const userExists = await User.findOne({ email }).select("+password");

// Include refreshToken
const user = await User.findById(decodedToken._id).select("+refreshToken");
```

---

## Validation Patterns

### Zod Schema Definitions

```typescript
// backend/src/validations/auth.validation.ts
import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string({
        required_error: "Email Address is required",
        invalid_type_error: "Email must be a string"
    }).email('Invalid email'),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
    .min(8, 'Password must be at least 8 characters long')
    .refine(
        (password) => /[A-Z]/.test(password),
        { message: "Password must have at least one uppercase letter" }
    )
    .refine(
        (password) => /[a-z]/.test(password),
        { message: "Password must have at least one lowercase letter" }
    )
    .refine(
        (password) => /\d/.test(password),
        { message: "Password must have at least one number" }
    )
    .refine(
        (password) => /[!@#$%^&*(),.?\":{}|<>]/.test(password),
        { message: "Password must have at least one special character" }
    ),
});

export const UpdateProfileSchema = z.object({
    fullName: z.string().min(1, { message: "Full name must be 1 or more characters long" }).optional(),
    phoneNumber: z.string().optional(),
    avatar: z.string().url("Please provide a valid URL for the avatar").optional().or(z.literal("")),
});

// Type inference
export type loginType = z.infer<typeof LoginSchema>;
export type updateProfileType = z.infer<typeof UpdateProfileSchema>;
```

### Validate Request Middleware

```typescript
// backend/src/middlewares/validateRequest.middleware.ts
export const validateRequest = (schema: ZodType) => {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            schema.parse({
                ...req.body,
                ...req.files,
                ...req.file,
            })
            next()
        } catch (error) {
            next(error);
        }
    }
}
```

### Route Usage

```typescript
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { LoginSchema, RegisterSchema } from "../validations/auth.validation";

router.post("/login", validateRequest(LoginSchema), loginUser);
router.post("/register", validateRequest(RegisterSchema), registerUser);
```

---

## Frontend API Client Patterns

### Axios Instance with Interceptors

```typescript
// frontend/src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Token Refresh Pattern

```typescript
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using HTTP-only cookie
        await axios.post(`${API_URL}/users/refresh-token`, {}, { withCredentials: true });
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### API Usage in Components

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const response = await apiClient.get<{ data: BackendUserData }>("/users/me");

// POST request
await apiClient.post("/users/login", credentials);

// POST with data
await apiClient.post("/users/register", {
  fullName: userData.fullName,
  email: userData.email,
  password: userData.password,
  role: userData.role
});
```

---

## Auth Context Pattern

### Context Definition

```typescript
// frontend/src/contexts/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export type UserRole = "user" | "photographer" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials, redirectUrl?: string) => Promise<void>;
  register: (userData: RegisterData, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### Provider Implementation

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await apiClient.get<{ data: BackendUserData }>("/users/me");
      const userData = response.data.data || response.data;
      // Map backend response to User interface (fullName instead of name)
      if (userData && typeof userData === 'object') {
        setUser({
          id: userData.id || userData._id || '',
          fullName: userData.fullName || userData.name || '',
          email: userData.email || '',
          role: userData.role || 'user'
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials, redirectUrl?: string) => {
    await apiClient.post("/users/login", credentials);
    await checkAuth();
    router.push(redirectUrl || "/dashboard");
  };

  const register = async (userData: RegisterData, redirectUrl?: string) => {
    await apiClient.post("/users/register", {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role
    });
    await checkAuth();
    router.push(redirectUrl || "/dashboard");
  };

  const logout = async () => {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Hook Usage

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### Pattern Benefits

- Centralized auth state management
- Automatic token refresh handling
- Type-safe context with proper error handling
- Backend response mapping for frontend consistency
- Cleanup on logout (state + navigation)

---

## Summary

These patterns work together to create a consistent, maintainable codebase:

1. **Backend**: asyncHandler eliminates boilerplate, ApiError/ApiResponse standardize responses, Zod validates inputs
2. **Database**: Mongoose models with methods, hooks, and transforms encapsulate business logic
3. **Frontend**: Axios interceptors handle token refresh, AuthContext manages global state
4. **Error Handling**: Centralized error handler catches all error types and formats them consistently
