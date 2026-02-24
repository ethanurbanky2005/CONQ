"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  Package,
  CreditCard,
  Users,
  Target,
  Zap,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface KpiMetric {
  label: string
  /** Raw numeric end-value for the counter animation */
  value: number
  /** Prefix shown before the number (e.g. "$") */
  prefix?: string
  /** Suffix shown after the number (e.g. "%" or "x") */
  suffix?: string
  /** Optional secondary label shown below the value (e.g. "per month") */
  subLabel?: string
  /** Human-friendly range string rendered instead of the counter when present */
  rangeDisplay?: string
  /** Visually emphasise this card */
  highlighted?: boolean
  /** Icon component */
  icon: React.ElementType
  /** Brief context shown in a tooltip-style popover on hover */
  description: string
}

const KPI_METRICS: KpiMetric[] = [
  {
    label: "Retail Price",
    value: 599,
    prefix: "$",
    icon: DollarSign,
    description: "Consumer price point for the CONQ wearable device.",
  },
  {
    label: "Gross Margin",
    value: 63,
    suffix: "%",
    rangeDisplay: "60\u201363%",
    icon: TrendingUp,
    description:
      "Hardware margins driven by optimized component sourcing and manufacturing at scale.",
  },
  {
    label: "Landed Cost",
    value: 240,
    prefix: "$",
    rangeDisplay: "$220\u2013240",
    icon: Package,
    description:
      "Fully loaded unit cost including manufacturing, packaging, and logistics.",
  },
  {
    label: "Subscription",
    value: 9.99,
    prefix: "$",
    suffix: "/mo",
    icon: CreditCard,
    description:
      "Monthly recurring revenue per user for app access and cloud analytics.",
  },
  {
    label: "Lifetime Value",
    value: 698,
    prefix: "$",
    icon: Users,
    description:
      "Projected total revenue per customer including hardware sale and 12-month subscription retention.",
  },
  {
    label: "Acquisition Cost",
    value: 120,
    prefix: "$",
    icon: Target,
    description:
      "Blended customer acquisition cost leveraging institutional channel partnerships.",
  },
  {
    label: "LTV : CAC Ratio",
    value: 5.8,
    suffix: "x",
    highlighted: true,
    icon: Zap,
    description:
      "Nearly 2\u00d7 the 3\u00d7 benchmark for sustainable SaaS businesses\u2014signaling highly efficient growth.",
  },
]

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(
  end: number,
  duration: number = 1600,
  startCounting: boolean = false
) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!startCounting) return

    const isDecimal = end % 1 !== 0
    let startTime: number | null = null

    function step(ts: number) {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * end

      setDisplay(isDecimal ? parseFloat(current.toFixed(2)) : Math.round(current))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(end)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, startCounting])

  return display
}

/* ------------------------------------------------------------------ */
/*  Single KPI Card                                                    */
/* ------------------------------------------------------------------ */

function KpiCard({
  metric,
  started,
  delay,
}: {
  metric: KpiMetric
  started: boolean
  delay: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const count = useCountUp(metric.value, 1800, visible)

  // Stagger appearance
  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [started, delay])

  const Icon = metric.icon
  const isDecimal = metric.value % 1 !== 0

  const formattedValue = metric.rangeDisplay
    ? metric.rangeDisplay
    : `${metric.prefix ?? ""}${isDecimal ? count.toFixed(2) : count.toLocaleString()}${metric.suffix ?? ""}`

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative flex flex-col items-start justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300 cursor-default select-none",
        // base sizing
        "min-h-[160px]",
        // visibility animation
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0",
        // highlighted card styling
        metric.highlighted
          ? "border-blue bg-navy text-white shadow-lg shadow-blue/10"
          : "border-slate-200 bg-white text-navy",
        // hover effects
        "hover:scale-[1.03] hover:shadow-xl",
        metric.highlighted
          ? "hover:shadow-blue/20"
          : "hover:shadow-slate-200/80 hover:border-blue/40"
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform, box-shadow, border-color",
      }}
    >
      {/* Icon badge */}
      <div
        className={cn(
          "mb-3 flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300",
          metric.highlighted
            ? "bg-blue/20 text-blue-light"
            : "bg-slate-light text-blue group-hover:bg-blue/10"
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-3xl font-semibold leading-none tracking-tight md:text-[2.25rem]",
            metric.highlighted ? "text-white" : "text-navy"
          )}
        >
          {formattedValue}
        </span>
      </div>

      {/* Label */}
      <span
        className={cn(
          "mt-2 text-sm font-medium leading-snug",
          metric.highlighted ? "text-slate-300" : "text-slate-500"
        )}
      >
        {metric.label}
        {metric.subLabel && (
          <span className="ml-1 font-normal">{metric.subLabel}</span>
        )}
      </span>

      {/* Hover description tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 rounded-b-xl px-5 py-3 text-xs leading-relaxed transition-all duration-300",
          metric.highlighted
            ? "bg-navy/95 text-slate-300"
            : "bg-white/95 text-slate-600 backdrop-blur-sm",
          hovered
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        )}
      >
        {metric.description}
      </div>

      {/* Highlighted card badge */}
      {metric.highlighted && (
        <div className="absolute right-4 top-4 rounded-full bg-blue px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Key Metric
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  KPI Dashboard grid                                                 */
/* ------------------------------------------------------------------ */

export function EconomicsKpiDashboard() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setStarted(true)
        }
      })
    },
    []
  )

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
      rootMargin: "0px 0px -30px 0px",
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect])

  // First 3 cards on top row, last 4 on bottom (with the highlighted LTV:CAC spanning emphasis)
  const topRow = KPI_METRICS.slice(0, 3)
  const bottomRow = KPI_METRICS.slice(3)

  return (
    <div ref={gridRef} className="mt-12">
      {/* Top row: 3 equally sized cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topRow.map((metric, i) => (
          <KpiCard
            key={metric.label}
            metric={metric}
            started={started}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Bottom row: 4 cards, last one (LTV:CAC) gets visual emphasis */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bottomRow.map((metric, i) => (
          <KpiCard
            key={metric.label}
            metric={metric}
            started={started}
            delay={(i + 3) * 100}
          />
        ))}
      </div>

      {/* LTV:CAC emphasis */}
      <div
        className={cn(
          "mt-8 rounded-2xl bg-navy px-8 py-8 text-center transition-all duration-700 md:py-10",
          started ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{ transitionDelay: "900ms" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          The number that matters
        </p>
        <p className="mt-3 text-5xl font-bold tracking-tight text-white md:text-6xl">
          5.8<span className="text-blue">x</span>
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          LTV : CAC Ratio
        </p>
        <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-500">
          Nearly 2x the 3x benchmark for sustainable SaaS businesses,
          reflecting efficient go-to-market execution and strong customer
          retention through the subscription model.
        </p>
      </div>
    </div>
  )
}
