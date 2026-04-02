"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type FieldOrientation = "vertical" | "horizontal" | "responsive"

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("@container/field-group flex flex-col gap-6", className)}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & {
  variant?: "legend" | "label"
}) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "text-sm font-semibold",
        variant === "label" && "text-sm font-medium",
        className
      )}
      {...props}
    />
  )
}

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: FieldOrientation
}) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "group/field",
        orientation === "vertical" && "flex flex-col gap-2",
        orientation === "horizontal" && "flex items-start justify-between gap-4",
        orientation === "responsive" &&
          "flex flex-col gap-2 @sm/field-group:flex-row @sm/field-group:items-start @sm/field-group:justify-between @sm/field-group:gap-4",
        "data-[invalid=true]:[&_[data-slot=field-label]]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof Label> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : Label

  return (
    <Comp
      data-slot="field-label"
      className={cn("leading-tight", className)}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-title"
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FieldSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="field-separator" className={cn("my-1", className)} {...props} />
}

type FieldErrorItem = {
  message?: string
}

function FieldError({
  className,
  errors,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: (FieldErrorItem | undefined)[]
}) {
  const messages = (errors ?? [])
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message))

  if (!children && messages.length === 0) {
    return null
  }

  return (
    <div
      data-slot="field-error"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {children ??
        (messages.length === 1 ? (
          messages[0]
        ) : (
          <ul className="list-disc space-y-1 pl-4">
            {messages.map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        ))}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
