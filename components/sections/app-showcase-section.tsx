"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import {
  Camera,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  Activity,
  Brain,
  Heart,
  Eye,
  ChevronRight,
  Clock,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data & Types                                                       */
/* ------------------------------------------------------------------ */

interface AppScreen {
  id: string
  label: string
  icon: React.ElementType
  tagline: string
  description: string
}

const screens: AppScreen[] = [
  {
    id: "snapshots",
    label: "Daily Snapshots",
    icon: Camera,
    tagline: "30-second morning baseline",
    description:
      "Captures all five biometric markers each morning, establishing a rolling 7-day comparison window for deviation detection.",
  },
  {
    id: "trends",
    label: "Trend Tracking",
    icon: TrendingUp,
    tagline: "Visual recovery trajectories",
    description:
      "Time-series graphs display historical performance across each metric, highlighting recovery trajectories and identifying persistent deficits.",
  },
  {
    id: "symptoms",
    label: "Symptom Logging",
    icon: ClipboardList,
    tagline: "Objective meets subjective",
    description:
      "Structured input correlates subjective symptoms with objective biometric changes, creating a comprehensive recovery narrative.",
  },
  {
    id: "recovery",
    label: "Guided Recovery",
    icon: ShieldCheck,
    tagline: "Personalized protocols",
    description:
      "Recommendations adjust activity levels based on real-time data, preventing premature return-to-play and optimizing healing timelines.",
  },
]

/* ------------------------------------------------------------------ */
/*  Trend chart data (7 days)                                          */
/* ------------------------------------------------------------------ */

const trendData = [
  { day: "Mon", cognitive: 42, autonomic: 38, stress: 55 },
  { day: "Tue", cognitive: 48, autonomic: 44, stress: 50 },
  { day: "Wed", cognitive: 53, autonomic: 50, stress: 46 },
  { day: "Thu", cognitive: 58, autonomic: 55, stress: 42 },
  { day: "Fri", cognitive: 64, autonomic: 61, stress: 38 },
  { day: "Sat", cognitive: 71, autonomic: 68, stress: 34 },
  { day: "Sun", cognitive: 76, autonomic: 74, stress: 30 },
]

/* ------------------------------------------------------------------ */
/*  Animated SVG Line Chart (for Trend screen)                         */
/* ------------------------------------------------------------------ */

function AnimatedTrendChart({ isActive }: { isActive: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      return
    }
    let raf: number
    let start: number | null = null
    const duration = 1400

    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [isActive])

  const w = 260
  const h = 120
  const padX = 28
  const padY = 16
  const plotW = w - padX * 2
  const plotH = h - padY * 2

  const toPoint = (
    data: { day: string; cognitive: number; autonomic: number; stress: number }[],
    key: "cognitive" | "autonomic" | "stress"
  ) => {
    const max = 100
    return data.map((d, i) => ({
      x: padX + (i / (data.length - 1)) * plotW,
      y: padY + plotH - (d[key] / max) * plotH,
    }))
  }

  const makePath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")

  const cogPts = toPoint(trendData, "cognitive")
  const autPts = toPoint(trendData, "autonomic")
  const strPts = toPoint(trendData, "stress")

  const totalLen = 400 // generous overestimate for strokeDasharray

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      style={{ overflow: "visible" }}
    >
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padY + plotH - (v / 100) * plotH
        return (
          <line
            key={v}
            x1={padX}
            x2={w - padX}
            y1={y}
            y2={y}
            stroke="#E2E8F0"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Day labels */}
      {trendData.map((d, i) => (
        <text
          key={d.day}
          x={padX + (i / (trendData.length - 1)) * plotW}
          y={h - 2}
          textAnchor="middle"
          fontSize={8}
          fill="#94A3B8"
          fontFamily="Inter, sans-serif"
        >
          {d.day}
        </text>
      ))}

      {/* Stress line (dim) */}
      <path
        d={makePath(strPts)}
        fill="none"
        stroke="#94A3B8"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - progress)}
        opacity={0.5}
      />

      {/* Autonomic line */}
      <path
        d={makePath(autPts)}
        fill="none"
        stroke="#60A5FA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - progress)}
      />

      {/* Cognitive line (primary) */}
      <path
        d={makePath(cogPts)}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - progress)}
      />

      {/* End dots */}
      {progress > 0.95 && (
        <>
          <circle
            cx={cogPts[cogPts.length - 1].x}
            cy={cogPts[cogPts.length - 1].y}
            r={3}
            fill="#3B82F6"
            className="animate-pulse"
          />
          <circle
            cx={autPts[autPts.length - 1].x}
            cy={autPts[autPts.length - 1].y}
            r={2.5}
            fill="#60A5FA"
            className="animate-pulse"
          />
        </>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Individual Screen UIs                                              */
/* ------------------------------------------------------------------ */

function SnapshotScreen() {
  const metrics = [
    { label: "Pupil Response", value: 82, icon: Eye, trend: "up" as const },
    { label: "Eye Stability", value: 76, icon: Eye, trend: "up" as const },
    { label: "Blink Pattern", value: 68, icon: Activity, trend: "flat" as const },
    { label: "Head Motion", value: 71, icon: Brain, trend: "up" as const },
    { label: "Heart Rate Var.", value: 79, icon: Heart, trend: "down" as const },
  ]

  const trendIcon = (t: "up" | "down" | "flat") => {
    if (t === "up") return <ArrowUp className="h-3 w-3 text-emerald-500" />
    if (t === "down") return <ArrowDown className="h-3 w-3 text-amber-500" />
    return <Minus className="h-3 w-3 text-slate-400" />
  }

  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-4">
      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-medium text-slate-400">
          <Clock className="mr-1 inline h-3 w-3" />
          {"Today, 7:32 AM"}
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
          Baseline Complete
        </span>
      </div>

      {/* Score circle */}
      <div className="mb-3 flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="5"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - 0.76)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-lg font-semibold text-navy">76</span>
        </div>
        <span className="mt-1 text-[10px] font-medium text-slate-500">
          Cognitive Load Score
        </span>
      </div>

      {/* Metrics list */}
      <div className="flex flex-col gap-1.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2">
              <m.icon className="h-3.5 w-3.5 text-blue" />
              <span className="text-[10px] font-medium text-navy">
                {m.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-navy">
                {m.value}
              </span>
              {trendIcon(m.trend)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendScreen({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-navy">
          7-Day Recovery Trend
        </span>
        <span className="text-[8px] text-slate-400">This Week</span>
      </div>

      {/* Legend */}
      <div className="mb-2 flex gap-3">
        {[
          { label: "Cognitive", color: "#3B82F6" },
          { label: "Autonomic", color: "#60A5FA" },
          { label: "Stress", color: "#94A3B8" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <span
              className="inline-block h-1.5 w-3 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-[7px] text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Animated chart */}
      <div className="rounded-lg bg-white/80 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <AnimatedTrendChart isActive={isActive} />
      </div>

      {/* Summary cards */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          { label: "Cognitive", value: "76", change: "+8", up: true },
          { label: "Autonomic", value: "74", change: "+6", up: true },
          { label: "Stress", value: "30", change: "-4", up: false },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center rounded-lg bg-white/80 px-2 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <span className="text-[12px] font-semibold text-navy">
              {s.value}
            </span>
            <span
              className={`text-[8px] font-medium ${s.up ? "text-emerald-500" : "text-amber-500"}`}
            >
              {s.change}
            </span>
            <span className="text-[7px] text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SymptomScreen() {
  const symptoms = [
    { name: "Headache", severity: 2, max: 5 },
    { name: "Dizziness", severity: 1, max: 5 },
    { name: "Fatigue", severity: 3, max: 5 },
    { name: "Cognitive Fog", severity: 2, max: 5 },
    { name: "Light Sensitivity", severity: 1, max: 5 },
    { name: "Balance Issues", severity: 0, max: 5 },
  ]

  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-navy">
          Symptom Log
        </span>
        <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[8px] font-medium text-blue">
          Today
        </span>
      </div>
      <p className="mb-3 text-[8px] text-slate-400">
        Tap to rate each symptom 0-5
      </p>

      <div className="flex flex-col gap-1.5">
        {symptoms.map((s) => (
          <div
            key={s.name}
            className="rounded-lg bg-white/80 px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[9px] font-medium text-navy">
                {s.name}
              </span>
              <span className="text-[8px] text-slate-400">
                {s.severity}/{s.max}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: s.max }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    backgroundColor:
                      i < s.severity
                        ? s.severity >= 4
                          ? "#EF4444"
                          : s.severity >= 2
                            ? "#F59E0B"
                            : "#3B82F6"
                        : "#E2E8F0",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Correlation note */}
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue/5 px-3 py-2">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-blue" />
        <span className="text-[8px] leading-relaxed text-slate-600">
          Fatigue increase correlates with 12% drop in HRV detected this
          morning.
        </span>
      </div>
    </div>
  )
}

function RecoveryScreen() {
  const phases = [
    {
      name: "Rest & Recovery",
      status: "complete" as const,
      detail: "Light activity only",
    },
    {
      name: "Light Aerobic",
      status: "complete" as const,
      detail: "Walking, stationary bike",
    },
    {
      name: "Sport-Specific",
      status: "current" as const,
      detail: "Skating drills, no contact",
    },
    {
      name: "Non-Contact Training",
      status: "upcoming" as const,
      detail: "Full practice, no hitting",
    },
    {
      name: "Full Contact",
      status: "upcoming" as const,
      detail: "Cleared for game play",
    },
  ]

  return (
    <div className="flex h-full flex-col px-4 pt-3 pb-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-navy">
          Recovery Protocol
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-600">
          Phase 3 of 5
        </span>
      </div>
      <p className="mb-3 text-[8px] text-slate-400">
        Graduated return-to-play progression
      </p>

      <div className="flex flex-col gap-1">
        {phases.map((p, i) => (
          <div key={p.name} className="flex items-start gap-2">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  p.status === "complete"
                    ? "bg-emerald-500"
                    : p.status === "current"
                      ? "bg-blue"
                      : "bg-slate-200"
                }`}
              >
                {p.status === "complete" ? (
                  <CheckCircle2 className="h-3 w-3 text-white" />
                ) : p.status === "current" ? (
                  <Activity className="h-3 w-3 text-white" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                )}
              </div>
              {i < phases.length - 1 && (
                <div
                  className={`h-5 w-0.5 ${
                    p.status === "complete" ? "bg-emerald-300" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 pb-1">
              <span
                className={`text-[9px] font-semibold ${
                  p.status === "current" ? "text-blue" : "text-navy"
                }`}
              >
                {p.name}
              </span>
              <p className="text-[7px] text-slate-400">{p.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's recommendation */}
      <div className="mt-3 rounded-lg bg-blue/5 px-3 py-2">
        <span className="text-[8px] font-semibold text-navy">
          {"Today's Recommendation"}
        </span>
        <p className="mt-0.5 text-[7px] leading-relaxed text-slate-500">
          Continue sport-specific drills at moderate intensity. Biometric
          indicators suggest readiness for Phase 4 within 2-3 days if current
          trajectory holds.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phone Frame Component                                              */
/* ------------------------------------------------------------------ */

function PhoneMockup({
  activeIndex,
  onTabClick,
}: {
  activeIndex: number
  onTabClick: (i: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-center">
      {/* Phone body */}
      <div
        className="relative mx-auto w-[280px] overflow-hidden rounded-[2.5rem] border-[6px] border-navy bg-slate-light shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
        style={{ height: 560 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-30 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-navy" />

        {/* Screen area */}
        <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-slate-light pt-8">
          {screens.map((screen, i) => (
            <div
              key={screen.id}
              className="absolute inset-0 pt-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(${(i - activeIndex) * 100}%)`,
                opacity: i === activeIndex ? 1 : 0.3,
              }}
            >
              {/* Screen header */}
              <div className="flex items-center gap-2 px-4 pb-2">
                <screen.icon className="h-4 w-4 text-blue" />
                <span className="text-[11px] font-semibold text-navy">
                  {screen.label}
                </span>
              </div>

              {/* Screen content */}
              {screen.id === "snapshots" && <SnapshotScreen />}
              {screen.id === "trends" && (
                <TrendScreen isActive={i === activeIndex} />
              )}
              {screen.id === "symptoms" && <SymptomScreen />}
              {screen.id === "recovery" && <RecoveryScreen />}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-2 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-navy/30" />
      </div>

      {/* Tab indicators (mobile) */}
      <div className="mt-4 flex gap-1.5 md:hidden">
        {screens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onTabClick(i)}
            aria-label={`View ${s.label} screen`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIndex
                ? "w-6 bg-blue"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature Card (right side)                                          */
/* ------------------------------------------------------------------ */

function FeatureCard({
  screen,
  index,
  isActive,
  onClick,
}: {
  screen: AppScreen
  index: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
        isActive
          ? "border-blue/30 bg-white shadow-[0_4px_16px_rgba(59,130,246,0.08)]"
          : "border-transparent bg-white/60 hover:border-slate-200 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      }`}
    >
      {/* Active indicator bar */}
      <div
        className={`absolute top-3 bottom-3 left-0 w-[3px] rounded-full transition-all duration-300 ${
          isActive ? "bg-blue" : "bg-transparent"
        }`}
      />

      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
          isActive ? "bg-blue/10" : "bg-slate-100 group-hover:bg-slate-200/70"
        }`}
      >
        <screen.icon
          className={`h-5 w-5 transition-colors duration-300 ${
            isActive ? "text-blue" : "text-slate-400 group-hover:text-slate-500"
          }`}
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold transition-colors duration-300 ${
              isActive ? "text-navy" : "text-slate-600 group-hover:text-navy"
            }`}
          >
            {screen.label}
          </span>
          <ChevronRight
            className={`h-3.5 w-3.5 transition-all duration-300 ${
              isActive
                ? "translate-x-0 text-blue opacity-100"
                : "translate-x-0 text-slate-300 opacity-0 group-hover:opacity-50"
            }`}
          />
        </div>
        <p
          className={`mt-0.5 text-xs leading-relaxed transition-colors duration-300 ${
            isActive ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {screen.tagline}
        </p>
        {/* Expanded description */}
        <div
          className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            maxHeight: isActive ? 80 : 0,
            opacity: isActive ? 1 : 0,
          }}
        >
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {screen.description}
          </p>
        </div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Auto-cycle Timer Bar                                               */
/* ------------------------------------------------------------------ */

function TimerBar({
  isRunning,
  duration,
}: {
  isRunning: boolean
  duration: number
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isRunning) {
      setProgress(0)
      return
    }
    let raf: number
    let start: number | null = null

    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isRunning, duration])

  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-blue transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

const AUTO_CYCLE_MS = 4000

export function AppShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goToScreen = useCallback(
    (i: number, pause = true) => {
      setActiveIndex(i)
      setTimerKey((k) => k + 1)
      if (pause) {
        setIsPaused(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setIsPaused(false), 8000)
      }
    },
    []
  )

  /* Auto-cycle */
  useEffect(() => {
    if (isPaused) return
    const id = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % screens.length)
      setTimerKey((k) => k + 1)
    }, AUTO_CYCLE_MS)
    return () => clearTimeout(id)
  }, [activeIndex, isPaused, timerKey])

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Section id="app" alternate>
      <ScrollReveal>
        <SectionLabel>The App</SectionLabel>
        <SectionHeading>From Raw Data to Daily Direction</SectionHeading>
        <SectionBody className="mt-4">
          As biometric data streams from the glasses, it lives here. Each day,
          users receive a clear snapshot of their cognitive load and autonomic
          stability. Over time, trends form, and even without the glasses,
          users engage with the app to build awareness and prioritize brain health.
        </SectionBody>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Future Feature: Scan QR to try
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          {/* Left: Phone mockup */}
          <PhoneMockup
            activeIndex={activeIndex}
            onTabClick={(i) => goToScreen(i)}
          />

          {/* Right: Feature cards */}
          <div className="flex flex-col gap-2">
            {/* Timer bar */}
            <div className="mb-2 px-1">
              <TimerBar
                key={timerKey}
                isRunning={!isPaused}
                duration={AUTO_CYCLE_MS}
              />
            </div>

            {screens.map((screen, i) => (
              <FeatureCard
                key={screen.id}
                screen={screen}
                index={i}
                isActive={i === activeIndex}
                onClick={() => goToScreen(i)}
              />
            ))}

            {/* Metric badges */}
            <div className="mt-3 flex flex-wrap gap-2 px-1">
              <p className="w-full text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Metrics That Guide Daily Decisions
              </p>
              {[
                { icon: BarChart3, label: "Cognitive Load", value: "76/100" },
                { icon: Activity, label: "Autonomic Index", value: "74%" },
                { icon: Brain, label: "Stress React.", value: "Low" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <m.icon className="h-3.5 w-3.5 text-blue" />
                  <span className="text-[11px] font-medium text-slate-500">
                    {m.label}
                  </span>
                  <span className="text-[11px] font-semibold text-navy">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  )
}
