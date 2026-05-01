import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// 1. The Root Container
const PageRoot = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("min-h-screen bg-gray-50 flex flex-col", className)} {...props} />
);

// 2. The Semantic Header
const Header = ({ className, ...props }: ComponentPropsWithoutRef<"header">) => (
  <header className={cn("sticky top-0 z-40 w-full border-b border-gray-200 bg-white", className)} {...props}>
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
      {props.children}
    </div>
  </header>
);

// 3. Typography
const Title = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1 className={cn("text-3xl font-bold text-gray-900", className)} {...props} />
);

const Description = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p className={cn("mt-2 text-sm text-gray-600", className)} {...props} />
);

// 4. Structural Elements
const Body = ({ className, ...props }: ComponentPropsWithoutRef<"main">) => (
  <main className={cn("mx-auto mt-8 flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 sm:px-6 md:flex-row lg:px-8", className)} {...props} />
);

const Section = ({ className, ...props }: ComponentPropsWithoutRef<"section">) => (
  <section className={cn("flex-1 space-y-6", className)} {...props} />
);

const Aside = ({ className, ...props }: ComponentPropsWithoutRef<"aside">) => (
  <aside className={cn("w-full shrink-0 space-y-6 md:w-64", className)} {...props} />
);

// 5. Layout Primitives
const Stack = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex flex-col gap-6", className)} {...props} />
);

const Row = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex flex-row items-center gap-4", className)} {...props} />
);

const Grid = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)} {...props} />
);

// Final Compound Export
export const Page = Object.assign(PageRoot, {
  Header,
  Title,
  Description,
  Body,
  Section,
  Aside,
  Stack,
  Row,
  Grid,
  Surface: Card,
});
