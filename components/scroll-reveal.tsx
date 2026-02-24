"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** If true, staggers children animations */
  stagger?: boolean
  /** Threshold for IntersectionObserver (0-1) */
  threshold?: number
}

export function ScrollReveal({
  children,
  className,
  stagger = false,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (stagger) {
              const children = el.querySelectorAll(".reveal-on-scroll")
              children.forEach((child) => child.classList.add("revealed"))
            } else {
              el.classList.add("revealed")
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [stagger, threshold])

  return (
    <div
      ref={ref}
      className={cn(
        stagger ? "reveal-stagger" : "reveal-on-scroll",
        className
      )}
    >
      {children}
    </div>
  )
}
