import React from "react";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { HeaderActions } from "./HeaderActions";
import { ROUTES } from "@/lib/constants/routes";

/**
 * Editorial Header (Server Component).
 * Clean, stark black-and-white aesthetic. No rounded buttons or gradients.
 */
export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo - Minimalist Editorial Style */}
        <Link href={ROUTES.HOME} className="flex items-center group transition-opacity hover:opacity-70">
          <span className="text-2xl font-bold tracking-[0.2em] text-black uppercase">
            Photophile
          </span>
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <NavLinks className="hidden md:flex" />

        {/* Auth Actions */}
        <HeaderActions />
      </div>
    </header>
  );
}
