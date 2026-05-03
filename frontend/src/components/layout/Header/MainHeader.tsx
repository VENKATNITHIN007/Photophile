import React from "react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { HeaderActions } from "./HeaderActions";
import { MobileNav } from "./MobileNav";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Main Header (Server Component Shell).
 * Includes desktop navigation, auth actions, and a mobile hamburger menu.
 */
export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 group transition-opacity hover:opacity-70">
          <span className="text-lg font-bold text-gray-900">
            Photophile
          </span>
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <NavLinks className="hidden md:flex" />

        {/* Desktop Auth Actions (Hidden on Mobile) */}
        <div className="hidden md:flex">
          <HeaderActions />
        </div>

        {/* Mobile Menu (Visible on Mobile Only) */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
