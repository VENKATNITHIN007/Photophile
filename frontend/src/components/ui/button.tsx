import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-light uppercase tracking-widest transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-black",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-gray-900",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-black bg-transparent hover:bg-black hover:text-white",
        secondary:
          "bg-gray-100 text-black hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 text-black",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-3",
        xs: "h-8 px-3 text-[10px]",
        sm: "h-10 px-4",
        lg: "h-14 px-10 text-sm",
        icon: "size-12",
        "icon-xs": "size-8",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
