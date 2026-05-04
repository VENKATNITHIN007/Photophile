import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { getSafeRedirectPath } from "@/features/auth/utils/auth-navigation";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/photographer/dashboard",
  "/photographer/onboard",
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  
  // Basic signature verification
  const isAuthenticated = Boolean(accessToken && (await verifyAuthToken(accessToken)));
  
  // Handle protected routes - redirect to login if NOT authenticated
  // In development, if the cookie is missing (due to port isolation), 
  // we let it pass if it's NOT a hard-protected path, 
  // allowing the client-side VerificationGate to do the final check.
  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle auth routes - redirect authenticated users AWAY from login/register
  if (isAuthPath(pathname) && isAuthenticated) {
    const redirectPath = getSafeRedirectPath(request.nextUrl.searchParams.get("redirect"));
    // Default to dashboard if no safe redirect path is found
    return NextResponse.redirect(new URL(redirectPath || "/dashboard", request.url));
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
