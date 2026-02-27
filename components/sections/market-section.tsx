"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { TrendingUp, Target, Globe } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const funnelData = [
  {
    label: "TAM",
    sublabel: "Global Concussion Market",
    value: 6.58,
    display: "$6.58B",
    color: "#0F172A",
    description:
      "Encompassing diagnostic devices, monitoring solutions, and therapeutic interventions worldwide.",
    icon: Globe,
  },
  {
    label: "SAM",
    sublabel: "Canadian Serviceable Market",
    value: 0.222,
    display: "$222M",
    color: "#2563EB",
    description:
      "Focusing on accessible monitoring technologies for contact sport athletes and high-risk populations in Canada.",
    icon: Target,
  },
  {
    label: "SOM",
    sublabel: "Initial Target Market",
    value: 0.013,
    display: "$13M",
    color: "#3B82F6",
    description:
      "OHL pilot deployment targeting 20 teams with institutional pricing model, expanding to regional hockey associations.",
    icon: TrendingUp,
  },
]

// Projected growth data — concussion market at 8.2% CAGR from $6.58B (2025)
// Sports wearables from ~$32B (2025) to $61B (2031) — ~11.3% CAGR
const growthData = [
  { year: 2025, concussion: 6.58, wearables: 32.0 },
  { year: 2026, concussion: 7.12, wearables: 35.6 },
  { year: 2027, concussion: 7.70, wearables: 39.6 },
  { year: 2028, concussion: 8.33, wearables: 44.1 },
  { year: 2029, concussion: 9.01, wearables: 49.1 },
  { year: 2030, concussion: 9.75, wearables: 54.7 },
  { year: 2031, concussion: 10.55, wearables: 61.0 },
]

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedValue(target: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!started) return
    let start: number | null = null
    let raf: number

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, started])

  return value
}

/* ------------------------------------------------------------------ */
/*  Custom Funnel Visualization                                        */
/* ------------------------------------------------------------------ */

function FunnelVisualization() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const widths = [100, 62, 38]

  return (
    <div
      ref={ref}
      className="h-full rounded-xl border border-slate-200 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
            <Target className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-navy">
            Total Addressable Market
          </h3>
        </div>
        <span className="hidden text-[10px] uppercase tracking-wider text-slate-400 sm:block">
          Hover for details
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        {funnelData.map((item, index) => {
          const Icon = item.icon
          const isHovered = hoveredIndex === index

          return (
            <div
              key={item.label}
              className="w-full"
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Funnel tier */}
              <div
                className="group relative mx-auto cursor-pointer transition-transform hover:scale-[1.02]"
                style={{
                  width: isVisible ? `${widths[index]}%` : "0%",
                  minWidth: isVisible ? "180px" : "0px",
                  transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 200}ms, min-width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 200}ms, transform 0.2s ease`,
                  maxWidth: "100%",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="relative rounded-lg px-4 py-4 md:px-6 md:py-5 transition-shadow duration-200"
                  style={{
                    backgroundColor: item.color,
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity 0.5s ease ${index * 200 + 300}ms, box-shadow 0.2s ease`,
                    boxShadow: isHovered
                      ? "0 8px 24px rgba(15, 23, 42, 0.25)"
                      : "0 2px 8px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/15">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                          {item.label}
                        </span>
                        <p className="truncate text-xs text-white/60">
                          {item.sublabel}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-right text-2xl font-bold text-white md:text-3xl">
                      <AnimatedCurrency
                        item={item}
                        started={isVisible}
                        delay={index * 200 + 400}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mx-auto overflow-hidden text-center"
                style={{
                  maxWidth: `${Math.max(widths[index], 50)}%`,
                  maxHeight: isHovered ? "100px" : "0px",
                  opacity: isHovered ? 1 : 0,
                  transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
                }}
              >
                <div className="px-3 pt-3">
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Connector arrow */}
              {index < funnelData.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-slate-300"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.4s ease ${index * 200 + 500}ms`,
                    }}
                  >
                    <path
                      d="M6 1L6 11M6 11L2 7M6 11L10 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CAGR callout */}
      <div
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-slate-light px-4 py-3"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.6s ease 1s",
        }}
      >
        <TrendingUp className="h-4 w-4 text-blue" />
        <span className="text-sm font-medium text-navy">
          8.2% CAGR
        </span>
        <span className="text-sm text-slate-500">
          market growth rate
        </span>
      </div>
    </div>
  )
}

/* Animated currency display */
function AnimatedCurrency({
  item,
  started,
  delay,
}: {
  item: (typeof funnelData)[0]
  started: boolean
  delay: number
}) {
  const [animStarted, setAnimStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => setAnimStarted(true), delay)
    return () => clearTimeout(timer)
  }, [started, delay])

  // Use billions for TAM, millions for SAM/SOM
  const isBillions = item.value >= 1
  const targetNum = isBillions ? item.value : item.value * 1000
  const animValue = useAnimatedValue(targetNum, 1200, animStarted)

  if (!animStarted) {
    return <span className="tabular-nums">$0</span>
  }

  if (isBillions) {
    return (
      <span className="tabular-nums">${animValue.toFixed(2)}B</span>
    )
  }
  return (
    <span className="tabular-nums">${Math.round(animValue)}M</span>
  )
}

/* ------------------------------------------------------------------ */
/*  Market Growth Chart                                                */
/* ------------------------------------------------------------------ */

function MarketGrowthChart() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const CustomTooltip = useCallback(
    ({
      active,
      payload,
      label,
    }: {
      active?: boolean
      payload?: Array<{
        value: number
        dataKey: string
        color: string
      }>
      label?: string | number
    }) => {
      if (!active || !payload?.length) return null
      return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xl">
          <p className="mb-2 text-sm font-semibold text-navy">{label}</p>
          {payload.map((entry) => (
            <div
              key={entry.dataKey}
              className="flex items-center gap-2 py-0.5"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-600">
                {entry.dataKey === "concussion"
                  ? "Concussion Market"
                  : "Sports Wearables"}
                :
              </span>
              <span className="text-xs font-bold tabular-nums text-navy">
                ${entry.value.toFixed(1)}B
              </span>
            </div>
          ))}
        </div>
      )
    },
    []
  )

  return (
    <div
      ref={ref}
      className="h-full rounded-xl border border-slate-200 bg-white p-6 md:p-8"
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-navy">
          Market Growth Projections
        </h3>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 rounded-full bg-navy" />
          <span className="text-xs font-medium text-slate-600">
            Concussion Market
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 rounded-full" style={{ backgroundColor: "#3B82F6" }} />
          <span className="text-xs font-medium text-slate-600">
            Sports Wearables
          </span>
        </div>
      </div>

      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={growthData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748B" }}
              dy={8}
            />
            {/* Left Y axis — Concussion Market */}
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val: number) => `$${val}B`}
              domain={[0, 14]}
              width={52}
            />
            {/* Right Y axis — Wearables Market */}
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val: number) => `$${val}B`}
              domain={[0, 70]}
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="concussion"
              stroke="#0F172A"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#0F172A", stroke: "#FFFFFF", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#0F172A",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1500}
              animationBegin={isVisible ? 200 : 99999}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="wearables"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#3B82F6", stroke: "#FFFFFF", strokeWidth: 2 }}
              activeDot={{
                r: 6,
                fill: "#3B82F6",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              animationDuration={1500}
              animationBegin={isVisible ? 500 : 99999}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Projection callouts */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-light px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Concussion Market by 2031
          </p>
          <p className="mt-0.5 text-lg font-bold text-navy">$10.55B</p>
          <p className="text-[10px] text-slate-400">8.2% CAGR</p>
        </div>
        <div className="rounded-lg bg-slate-light px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Sports Wearables by 2031
          </p>
          <p className="mt-0.5 text-lg font-bold text-blue">$61.0B</p>
          <p className="text-[10px] text-slate-400">11.3% CAGR</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section Export                                                      */
/* ------------------------------------------------------------------ */

export function MarketSection() {
  return (
    <Section id="market" alternate>
      <ScrollReveal>
        <SectionLabel>Market Opportunity</SectionLabel>
        <SectionHeading>A Multi-Billion Dollar Opportunity</SectionHeading>
        <SectionBody className="mt-4">
          The global concussion management market sits at $6.58 billion today. {"Canada's"}
          serviceable market: $222 million. Sports wearables are projected to exceed
          $61 billion by 2031. And {"Rowan's"} Law is creating regulatory demand that no
          consumer product currently meets, making the need immediate and the timing urgent.
        </SectionBody>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <ScrollReveal>
          <FunnelVisualization />
        </ScrollReveal>
        <ScrollReveal>
          <MarketGrowthChart />
        </ScrollReveal>
      </div>
    </Section>
  )
}
