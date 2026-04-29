import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, variant = "default", ...props }: React.ComponentProps<"input"> & { variant?: "default" | "search" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "h-9 rounded-md border px-3 py-1 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm",
        variant === "search" && "h-12 rounded-full border-2 border-gray-200 px-6 text-base bg-white shadow-sm focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 transition-all",
        className
      )}
      {...props}
    />
  )
}

export { Input }
