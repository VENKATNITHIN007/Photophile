"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const VERIFIED_ONLY_PATH_PREFIXES = [
  "/dashboard",
  "/photographer/dashboard",
];

const isVerifiedOnlyPath = (pathname: string): boolean => {
  return VERIFIED_ONLY_PATH_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
};

export function VerificationGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isEmailVerified } = useAuth();

  useEffect(() => {
    if (loading || !user || isEmailVerified || !isVerifiedOnlyPath(pathname)) {
      return;
    }

    router.replace("/verify-email/pending");
  }, [loading, user, isEmailVerified, pathname, router]);

  if (!loading && user && !isEmailVerified && isVerifiedOnlyPath(pathname)) {
    return null;
  }

  return <>{children}</>;
}

export default VerificationGate;
