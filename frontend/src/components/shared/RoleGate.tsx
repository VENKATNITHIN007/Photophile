"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/contexts/auth-context";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

export default RoleGate;
