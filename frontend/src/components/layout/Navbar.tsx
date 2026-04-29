"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Camera, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const PUBLIC_LINKS = [
  { href: "/photographers", label: "Photographers" },
  { href: "/become-photographer", label: "Become Photographer" },
];

const isActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const dashboardHref = user?.role === "photographer" ? "/photographer/dashboard" : "/dashboard";
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Camera className="size-4" />
          </span>
          <span className="text-lg font-bold text-gray-900">Photophile</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(pathname, link.href)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
          ) : user ? (
            <>
              <Button asChild variant="outline" className="h-9">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button variant="ghost" className="h-9 px-2" onClick={logout}>
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm">Logout</span>
              </Button>
            </>
          ) : (
            <Button asChild className="h-9 bg-amber-600 text-white hover:bg-amber-700">
              <Link href="/become-photographer">Get Started</Link>
            </Button>
          )}
        </div>

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
              <nav className="space-y-2">
                {PUBLIC_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-md px-3 py-2 text-sm font-medium ${
                        isActive(pathname, link.href)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="space-y-2">
                {user ? (
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
                  <SheetClose asChild>
                    <Button asChild className="w-full bg-amber-600 text-white hover:bg-amber-700">
                      <Link href="/become-photographer">Get Started</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Navbar;
