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
    <Page className="items-center justify-center bg-muted/30">
      <Page.Body className={cn("max-w-md w-full py-12 px-4", className)}>
        <Card className="w-full shadow-lg border-none sm:border overflow-hidden">
          <CardHeader className="space-y-4 text-center pb-8">
            {Icon && (
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted shadow-sm border">
                <Icon className="h-7 w-7 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-muted-foreground text-balance">
                  {description}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {children}
          </CardContent>

          {footer && (
            <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground pt-6 border-t mt-4 bg-muted/20">
              {footer}
            </CardFooter>
          )}
        </Card>
      </Page.Body>
    </Page>
  );
}
