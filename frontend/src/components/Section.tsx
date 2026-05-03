import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva(
  "w-full py-16 md:py-24 px-6 flex flex-col items-center justify-center relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        subtle: "bg-gray-50 text-gray-900",
        dark: "bg-gray-900 text-white",
        primary: "bg-amber-600 text-white",
      },
      spacing: {
        default: "gap-12 md:gap-16",
        compact: "gap-8 md:gap-10",
        none: "gap-0",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
    },
  }
);

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  containerClassName?: string;
}

/**
 * Section Primitive (Compound Component).
 * Enforces vertical spacing and horizontal constraints across the landing page.
 */
export function Section({
  variant,
  spacing,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ variant, spacing }), className)} {...props}>
      <div className={cn("w-full max-w-7xl mx-auto flex flex-col", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Sub-component for Section titles and subtitles.
 */
Section.Header = function SectionHeader({
  title,
  subtitle,
  align = "center",
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-3xl mb-8",
        align === "center" ? "items-center text-center mx-auto" : "items-start text-left",
        className
      )}
    >
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-inherit opacity-70 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

Section.Content = function SectionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
};
