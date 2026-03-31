"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, type UserRole } from "@/contexts/auth-context";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Camera,
  User,
  LogOut,
  Settings,
  Heart,
  ChevronDown,
} from "lucide-react";

// Navigation configuration - can be extended or passed as props
export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

export interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  showLogo?: boolean;
  className?: string;
}

const defaultLinks: NavLink[] = [
  { href: "/photographers", label: "Photographers" },
  { href: "/about", label: "About" },
];

const authenticatedLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", requiresAuth: true },
  { href: "/favorites", label: "Favorites", requiresAuth: true, icon: <Heart className="size-4" /> },
];

const photographerLinks: NavLink[] = [
  { href: "/portfolio", label: "My Portfolio", requiresAuth: true, roles: ["photographer"] },
];

export function Navbar({
  logoText = "Photophile",
  links = defaultLinks,
  showLogo = true,
  className,
}: NavbarProps) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter links based on auth state and user role
  const getVisibleLinks = (): NavLink[] => {
    const allLinks = [...links, ...authenticatedLinks, ...photographerLinks];
    return allLinks.filter((link) => {
      if (link.requiresAuth && !user) return false;
      if (link.roles && (!user || !link.roles.includes(user.role))) return false;
      return true;
    });
  };

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const visibleLinks = getVisibleLinks();

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ""}`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        {showLogo && (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow duration-300">
              <Camera className="size-5 text-white" />
            </div>
            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              {logoText}
            </span>
          </Link>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${isActive(link.href)
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section - Auth Actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            // Loading skeleton
            <div className="flex items-center gap-2">
              <div className="hidden sm:block w-20 h-9 bg-muted rounded-lg animate-pulse" />
              <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            </div>
          ) : user ? (
            // Authenticated user menu
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-10 px-2 hover:bg-accent"
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="hidden sm:block size-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Menu Items */}
                    <nav className="flex flex-col gap-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                      >
                        <User className="size-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
                      >
                        <Settings className="size-4 text-muted-foreground" />
                        Settings
                      </Link>
                    </nav>

                    <Separator />

                    {/* Logout */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      Log out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            // Guest buttons
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500">
                    <Camera className="size-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                    {logoText}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col h-[calc(100vh-80px)]">
                {/* Mobile Navigation Links */}
                <nav className="flex-1 overflow-auto p-6">
                  <div className="flex flex-col gap-2">
                    {visibleLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>

                {/* Mobile Auth Section */}
                <div className="p-6 border-t bg-muted/30">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <SheetClose asChild>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                        >
                          <Settings className="size-4" />
                          Settings
                        </Link>
                      </SheetClose>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="size-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/login">Log in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 text-white"
                        >
                          <Link href="/register">Sign up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Named export for convenience
export default Navbar;
