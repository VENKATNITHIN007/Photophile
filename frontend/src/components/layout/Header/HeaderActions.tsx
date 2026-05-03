"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Context-Aware Header Actions (Editorial Style).
 * Sharp corners, monochrome palette.
 */
export function HeaderActions() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  // Skeleton state while loading auth
  if (loading) {
    return <div className="h-10 w-24 animate-pulse bg-gray-200" />;
  }

  // GUEST VIEW
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-6">
        <Link 
          href={ROUTES.AUTH.LOGIN} 
          className="text-sm font-medium tracking-wide text-gray-500 hover:text-black transition-colors uppercase"
        >
          Sign In
        </Link>
        <Button asChild className="bg-black hover:bg-gray-800 text-white font-medium px-6 h-10 rounded-none uppercase tracking-wide text-xs">
          <Link href={ROUTES.AUTH.REGISTER}>
            Get Started
          </Link>
        </Button>
      </div>
    );
  }

  // PHOTOGRAPHER VIEW
  if (user?.role === "photographer") {
    return (
      <div className="flex items-center gap-6">
        <Link 
          href={ROUTES.STUDIO.MANAGE}
          className="text-sm font-medium tracking-wide text-gray-500 hover:text-black transition-colors uppercase"
        >
          Manage Studio
        </Link>
        <div className="size-10 bg-black flex items-center justify-center text-white font-medium text-lg uppercase">
          {user.name?.[0]}
        </div>
      </div>
    );
  }

  // REGULAR USER VIEW
  return (
    <div className="flex items-center gap-6">
      <Link 
        href={ROUTES.STUDIO.ONBOARD}
        className="text-sm font-medium tracking-wide text-gray-500 hover:text-black transition-colors uppercase"
      >
        Start Your Studio
      </Link>
      <Link href={ROUTES.STUDIO.DASHBOARD}>
        <div className="size-10 bg-gray-100 flex items-center justify-center text-black font-medium border border-gray-200 hover:border-black transition-all uppercase">
          {user?.name?.[0] || "U"}
        </div>
      </Link>
    </div>
  );
}
