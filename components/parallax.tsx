"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  Fade-in on scroll (Framer Motion)                                  */
/* ------------------------------------------------------------------ */

interface FadeInOnScrollProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  distance?: number
}

export function FadeInOnScroll({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 40,
}: FadeInOnScrollProps) {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directionMap[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
