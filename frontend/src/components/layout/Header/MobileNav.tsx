"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Explore Photographers", href: ROUTES.DISCOVERY },
  { label: "For Professionals", href: ROUTES.STUDIO.ONBOARD },
];

/**
 * Mobile Navigation Sheet.
 * Restores hamburger menu access on small screens with all nav links,
 * auth actions, and a logout button.
 */
export function MobileNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user;

  const dashboardHref = user?.role === "photographer" ? ROUTES.STUDIO.MANAGE : ROUTES.STUDIO.DASHBOARD;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
        <SheetHeader className="border-b p-6">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-84px)] flex-col justify-between p-6">
          {/* Navigation Links */}
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-amber-50 text-amber-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2">
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            ) : isAuthenticated ? (
              <>
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={dashboardHref}>Dashboard</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </Button>
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={ROUTES.AUTH.LOGIN}>Sign In</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                    <Link href={ROUTES.AUTH.REGISTER}>Get Started</Link>
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
