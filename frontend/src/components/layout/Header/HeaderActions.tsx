"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { LogOut } from "lucide-react";

/**
 * Context-Aware Header Actions.
 * Dynamically displays buttons based on authentication status.
 * Includes a logout control for authenticated users.
 */
export function HeaderActions() {
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user;

  // Skeleton state while loading auth
  if (loading) {
    return <div className="h-10 w-24 animate-pulse bg-gray-200" />;
  }

  // GUEST VIEW
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href={ROUTES.AUTH.LOGIN} 
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
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

  const dashboardHref = user?.role === "photographer" ? ROUTES.STUDIO.MANAGE : ROUTES.STUDIO.PROFILE;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // PHOTOGRAPHER VIEW
  if (user?.role === "photographer") {
    return (
      <div className="flex items-center gap-6">
        <Link 
          href={ROUTES.STUDIO.MANAGE}
          className="hidden sm:inline-block text-xs uppercase tracking-widest font-light text-gray-500 hover:text-black transition-colors"
        >
          Studio Dashboard
        </Link>
        <Link href={dashboardHref} className="hover:opacity-80 transition-opacity">
          <div className="size-10 border border-black font-light rounded-none flex items-center justify-center text-xs tracking-tighter">
            {initials}
          </div>
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-light text-gray-400 hover:text-red-600 transition-colors"
          title="Sign out"
        >
          <LogOut className="size-3" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  // REGULAR USER VIEW
  return (
    <div className="flex items-center gap-6">
      <Link 
        href={ROUTES.STUDIO.ONBOARD}
        className="hidden sm:inline-block text-xs uppercase tracking-widest font-light text-gray-500 hover:text-black transition-colors"
      >
        Start Your Studio
      </Link>
      <Link href={dashboardHref} className="hover:opacity-80 transition-opacity">
        <div className="size-10 border border-black font-light rounded-none flex items-center justify-center text-xs tracking-tighter">
          {initials}
        </div>
      </Link>
      <button 
        onClick={logout}
        className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-light text-gray-400 hover:text-red-600 transition-colors"
        title="Sign out"
      >
        <LogOut className="size-3" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
