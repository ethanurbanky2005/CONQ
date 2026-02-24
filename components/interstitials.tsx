"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  Full-width stat breaker — a single dramatic number                 */
/* ------------------------------------------------------------------ */

interface StatBreakerProps {
  value: string
  label: string
  sublabel?: string
  dark?: boolean
}

export function StatBreaker({ value, label, sublabel, dark = true }: StatBreakerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden py-20 md:py-28 ${
        dark ? "bg-navy" : "bg-white"
      }`}
    >
      <motion.div
        className="mx-auto max-w-6xl px-6 text-center md:px-8"
        style={{ y }}
      >
        <p
          className={`text-7xl font-semibold tracking-tight md:text-8xl lg:text-9xl ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          {value}
        </p>
        <p
          className={`mt-4 text-lg font-medium md:text-xl ${
            dark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {label}
        </p>
        {sublabel && (
          <p
            className={`mt-2 text-sm ${
              dark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {sublabel}
          </p>
        )}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Pull quote breaker — a dramatic full-width quote                   */
/* ------------------------------------------------------------------ */

interface QuoteBreakerProps {
  quote: string
  attribution?: string
  dark?: boolean
}

export function QuoteBreaker({ quote, attribution, dark = false }: QuoteBreakerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden py-24 md:py-32 ${
        dark ? "bg-navy" : "bg-slate-light"
      }`}
    >
      {/* Faint oversized quote mark pinned behind the text */}
      <motion.span
        className={`pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none text-[14rem] font-bold leading-none md:text-[20rem] ${
          dark ? "text-white/[0.03]" : "text-navy/[0.04]"
        }`}
        style={{ y: textY }}
        aria-hidden="true"
      >
        &ldquo;
      </motion.span>

      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-8 text-center md:px-12"
        style={{ y: textY }}
      >
        {/* Accent bar */}
        <div
          className={`mx-auto mb-8 h-px w-12 transition-all duration-1000 ${
            dark ? "bg-blue" : "bg-navy/30"
          } ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
        />

        <p
          className={`text-2xl font-light italic leading-snug tracking-tight md:text-3xl lg:text-[2.5rem] lg:leading-snug transition-all duration-1000 ${
            dark ? "text-white/90" : "text-navy"
          } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {quote}
        </p>

        {attribution && (
          <p
            className={`mt-8 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-1000 delay-300 ${
              dark ? "text-slate-500" : "text-slate-400"
            } ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            {attribution}
          </p>
        )}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Horizontal rule breaker — thin line with label                     */
/* ------------------------------------------------------------------ */

interface DividerProps {
  label?: string
}

export function Divider({ label }: DividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-2 md:px-8">
      <div
        className="h-px flex-1 origin-right bg-slate-200 transition-transform duration-700 ease-out"
        style={{ transform: visible ? "scaleX(1)" : "scaleX(0)" }}
      />
      {label && (
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 transition-opacity duration-500 delay-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {label}
        </span>
      )}
      <div
        className="h-px flex-1 origin-left bg-slate-200 transition-transform duration-700 ease-out"
        style={{ transform: visible ? "scaleX(1)" : "scaleX(0)" }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section number — large faded number behind section content         */
/* ------------------------------------------------------------------ */

interface SectionNumberProps {
  number: string
  children: ReactNode
  className?: string
}

export function SectionNumber({ number, children, className }: SectionNumberProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.span
        className="pointer-events-none absolute -left-4 top-0 select-none text-[12rem] font-bold leading-none text-navy/[0.03] md:text-[16rem] lg:text-[20rem]"
        style={{ y }}
        aria-hidden="true"
      >
        {number}
      </motion.span>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
