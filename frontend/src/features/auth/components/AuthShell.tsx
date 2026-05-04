import React from "react";
import { Page } from "@/components/Page";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

/**
 * Reusable shell for all Authentication pages.
 * Handles centering, card styling, and semantic headers.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
  icon: Icon,
  className,
}: AuthShellProps) {
  return (
    <Page className="items-center justify-center bg-white">
      <Page.Body className={cn("max-w-[480px] w-full py-20 px-6", className)}>
        <div className="space-y-12">
          {/* Header Section */}
          <header className="space-y-6 text-center">
            {Icon && (
              <div className="mx-auto flex h-16 w-16 items-center justify-center border border-black rounded-none">
                <Icon className="h-8 w-8 text-black" />
              </div>
            )}
            <div className="space-y-3">
              <h1 className="text-4xl font-light uppercase tracking-widest text-black">
                {title}
              </h1>
              {description && (
                <p className="text-sm uppercase tracking-wider text-gray-500 max-w-[320px] mx-auto leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </header>
          
          {/* Main Content Area */}
          <div className="border-t border-black pt-12">
            {children}
          </div>

          {/* Footer Section */}
          {footer && (
            <footer className="pt-12 text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors duration-300">
                {footer}
              </div>
            </footer>
          )}
        </div>
      </Page.Body>
    </Page>
  );
}
