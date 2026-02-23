"use client";

import { useAuth, UserRole } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // User doesn't have required role, maybe redirect to an unauthorized page or dashboard
      router.push("/dashboard");
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
