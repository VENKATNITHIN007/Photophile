import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

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

// this is a helper function to check if the redirect path is safe , it dont accept full urls, if there are full urls , the http//local is ingored and full url is used , so it returns null in , even for our domain , so in this case we have to pass only relative paths like /dashboard etc not pass full urls like http://photophile.com/dashboard ingores htpp//local and returns null, full urls are not allowed it prevent redirect attacks 

function getSafeRedirectPath(redirect: string | null): string | null {
  if (!redirect) return null;

  try {

    // http://local is used only for redirect paths , its not used if the redirect path is full url like evil.site or photophile.com/dashboard which is not allowed 
    // this is done to prevent open redirect attacks
    const normalized = new URL(redirect, "http://local");
    if (normalized.origin !== "http://local") return null;
    if (isAuthPath(normalized.pathname)) return null;
    return `${normalized.pathname}${normalized.search}`;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  
  const isAuthenticated = Boolean(accessToken && (await verifyAuthToken(accessToken)));
  
  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle auth routes - redirect authenticated users away from auth pages
  if (isAuthPath(pathname) && isAuthenticated) {
    const redirectPath = getSafeRedirectPath(request.nextUrl.searchParams.get("redirect"));
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
