import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  /** Use light slate background instead of white */
  alternate?: boolean
  /** Use navy background with white text */
  dark?: boolean
  /** Remove vertical padding */
  noPadding?: boolean
}

export function Section({
  children,
  id,
  className,
  alternate = false,
  dark = false,
  noPadding = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full",
        !noPadding && "py-20 md:py-28 lg:py-32",
        alternate && !dark && "bg-slate-light",
        dark && "bg-navy text-white",
        !alternate && !dark && "bg-background",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">{children}</div>
    </section>
  )
}

/** Small label above section headings */
export function SectionLabel({
  children,
  className,
  dark = false,
}: {
  children: ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <span
      className={cn(
        "mb-4 inline-block text-sm font-semibold uppercase tracking-widest",
        dark ? "text-blue-light" : "text-blue",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Section heading */
export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl lg:text-[2.75rem]",
        className
      )}
    >
      {children}
    </h2>
  )
}

/** Section body paragraph */
export function SectionBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg",
        className
      )}
    >
      {children}
    </p>
  )
}
