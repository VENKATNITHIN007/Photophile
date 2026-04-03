import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeAuthToken } from "@/lib/jwt";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/photographer/dashboard",
];

// Paths that should redirect authenticated users away (auth pages)
const AUTH_PATHS = [
  "/login",
  "/register",
];

// Check if a path matches any of the protected prefixes
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

// Check if a path is an auth page
function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isTokenValid(token: string): boolean {
  const payload = decodeAuthToken(token);
  if (!payload) return false;
  if (typeof payload.exp !== "number") return true;
  return Date.now() < payload.exp * 1000;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  
  const isAuthenticated = Boolean(accessToken && isTokenValid(accessToken));
  
  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all paths except:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
