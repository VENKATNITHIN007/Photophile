import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

// Paths that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/photographer",
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

// Attempt to refresh the token by calling the backend
async function refreshToken(request: NextRequest): Promise<Response | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    const refreshResponse = await fetch(`${apiUrl}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies for the refresh token
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    
    return refreshResponse.ok ? refreshResponse : null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  
  // Verify the token
  let isAuthenticated = false;
  
  if (accessToken) {
    const payload = await verifyAuthToken(accessToken);
    isAuthenticated = payload !== null;
  }

  // If token is invalid/expired (or missing), try to refresh it
  let refreshedResponse: Response | null = null;
  if (!isAuthenticated) {
    refreshedResponse = await refreshToken(request);
    isAuthenticated = Boolean(refreshedResponse);
  }
  
  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedPath(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthPath(pathname) && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    const setCookie = refreshedResponse?.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
    return response;
  }

  // Allow the request to proceed
  const response = NextResponse.next();
  const setCookie = refreshedResponse?.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }
  return response;
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
