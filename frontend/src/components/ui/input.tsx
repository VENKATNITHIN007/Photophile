import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, variant = "default", ...props }: React.ComponentProps<"input"> & { variant?: "default" | "search" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-black selection:text-white w-full min-w-0 bg-transparent transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "h-12 rounded-none border border-gray-200 px-4 py-2 text-sm font-light focus:border-black",
        variant === "search" && "h-14 rounded-none border border-gray-200 px-6 text-base bg-white focus:border-black transition-all",
        className
      )}
      {...props}
    />
  )
}

export { Input }
