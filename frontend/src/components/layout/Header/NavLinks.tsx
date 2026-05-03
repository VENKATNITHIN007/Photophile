"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { label: "Explore Photographers", href: ROUTES.DISCOVERY },
  { label: "For Professionals", href: ROUTES.STUDIO.ONBOARD },
];

/**
 * Navigation Links for the Header.
 * Automatically handles the 'active' state based on the current URL.
 */
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-8", className)}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-semibold transition-colors hover:text-amber-600",
              isActive ? "text-amber-600" : "text-gray-600"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
