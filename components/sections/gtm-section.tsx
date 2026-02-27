"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import {
  CalendarDays,
  Target,
  ChevronRight,
  Users,
  MapPin,
  Zap,
  TrendingUp,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
function useAnimatedNumber(
  end: number,
  duration = 1200,
  start = 0,
  trigger = true,
  decimals = 0
) {
  const [value, setValue] = useState(start)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!trigger) {
      setValue(start)
      return
    }
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(
        Number((start + (end - start) * eased).toFixed(decimals))
      )
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, start, trigger, decimals])

  return value
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface PhaseData {
  id: string
  phase: string
  title: string
  period: string
  icon: React.ReactNode
  summary: string
  details: string[]
  metrics: { label: string; value: string }[]
  color: string
  teams?: { name: string; abbr: string; colors: [string, string]; logo?: string }[]
}

const phases: PhaseData[] = [
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "OHL Institutional Pilot",
    period: "2026-27 Season",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C19.2 3 21 4.8 21 7C21 9.2 19.2 11 17 11H13L7 21H3L7 11H5C3.3 11 2 9.7 2 8V7C2 5.3 3.3 4 5 4H7L9 3H17Z" />
      </svg>
    ),
    summary:
      "Hockey carries one of the highest concussion incidence rates in Canadian sport at 5.05 per 100 player-games. Teams function as concentrated buyers, cutting acquisition costs and enabling structured validation.",
    details: [
      "3D-printed frames with off-the-shelf components, assembled in-house for pilot validation",
      "Pre-season baseline collection across participating teams",
      "Full-season longitudinal data capture with 500+ athletes",
      "Clinical validation study with institutional research partner",
    ],
    metrics: [
      { label: "Target Athletes", value: "500+" },
      { label: "Pilot Teams", value: "3" },
      { label: "Study Duration", value: "Full Season" },
    ],
    color: "#3B82F6",
    teams: [
      { name: "Windsor Spitfires", abbr: "WS", colors: ["#CE1126", "#003DA5"], logo: "/logos/windsor-spitfires.png" },
      { name: "London Knights", abbr: "LK", colors: ["#006847", "#CDA349"], logo: "/logos/london-knights.png" },
      { name: "Oshawa Generals", abbr: "OG", colors: ["#CE1126", "#003087"], logo: "/logos/oshawa-generals.png" },
    ],
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "League & Institutional Scale",
    period: "2027-28 Season",
    icon: <MapPin className="h-5 w-5" />,
    summary:
      "League-level validation builds institutional credibility. From there, we expand into CHL, NHL, U Sports, and beyond, partnering with organized leagues, institutions, and performance programs.",
    details: [
      "Scale across full OHL and into CHL partner leagues",
      "Institutional licensing to performance programs and clinics",
      "Athletic therapist referral networks for clinical distribution",
      "Refine sensor modeling and software through real-world data",
    ],
    metrics: [
      { label: "Target Players", value: "15,000+" },
      { label: "Leagues", value: "CHL + U Sports" },
      { label: "Model", value: "Enterprise" },
    ],
    color: "#2563EB",
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Consumer & Multi-Sport",
    period: "2028+",
    icon: <Zap className="h-5 w-5" />,
    summary:
      "Direct-to-consumer expansion supported by digital performance marketing and athletic therapist referral networks. What begins as a focused concussion solution becomes a scalable cognitive health tool.",
    details: [
      "Direct-to-consumer launch modeled around $599 retail with a 50-63% gross margin band",
      "Subscription-based ongoing monitoring modeled at $9.99-$14.99/mo",
      "Multi-sport expansion: football, rugby, lacrosse",
      "Community platform bridging recovery and peak performance",
    ],
    metrics: [
      { label: "Sports", value: "4+" },
      { label: "Retail Price", value: "$599" },
      { label: "Channel", value: "D2C + B2B" },
    ],
    color: "#0F172A",
  },
]

const HockeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="16" rx="8" ry="4" />
    <ellipse cx="12" cy="14" rx="8" ry="4" />
  </svg>
)

const stats = [
  {
    icon: <HockeyIcon />,
    value: 5.05,
    decimals: 2,
    suffix: "",
    label: "Concussions per 100 Player-Games",
    sublabel: "OHL Incidence Rate",
  },
  {
    icon: <CalendarDays className="h-6 w-6" />,
    value: 2027,
    decimals: 0,
    suffix: "",
    label: "OHL Season Launch",
    sublabel: "2026-27 Target",
  },
  {
    icon: <Target className="h-6 w-6" />,
    value: 20,
    decimals: 0,
    suffix: " Teams",
    label: "Initial OHL Deployment",
    sublabel: "League-Wide Coverage",
  },
]

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */
function StatCard({
  icon,
  value,
  decimals,
  suffix,
  label,
  sublabel,
  index,
  visible,
}: (typeof stats)[0] & { index: number; visible: boolean }) {
  const animatedVal = useAnimatedNumber(
    value,
    1400 + index * 200,
    0,
    visible,
    decimals
  )

  // For "2026-27 Target" display the year differently
  const displayValue =
    decimals === 0 && value === 2027
      ? "2026-27"
      : decimals > 0
        ? animatedVal.toFixed(decimals)
        : Math.round(animatedVal).toLocaleString()

  return (
    <div
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue/30 hover:shadow-lg hover:shadow-blue/5"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-white">
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">
            {displayValue}
          </span>
          {suffix && value !== 2027 && (
            <span className="text-lg font-medium text-slate-500">
              {suffix}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
        <p className="text-xs text-slate-400">{sublabel}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Timeline Node                                                      */
/* ------------------------------------------------------------------ */
function TimelineNode({
  phase,
  isActive,
  isCompleted,
  onClick,
}: {
  phase: PhaseData
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
      aria-expanded={isActive}
      aria-controls={`panel-${phase.id}`}
    >
      {/* Node circle */}
      <div
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500"
        style={{
          borderColor: isActive || isCompleted ? phase.color : "#E2E8F0",
          backgroundColor:
            isActive || isCompleted ? phase.color : "#FFFFFF",
          color: isActive || isCompleted ? "#FFFFFF" : "#94A3B8",
          boxShadow: isActive
            ? `0 0 0 4px ${phase.color}20, 0 4px 12px ${phase.color}30`
            : "none",
          transform: isActive ? "scale(1.1)" : "scale(1)",
        }}
      >
        {phase.icon}
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span
          className="text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
          style={{
            color: isActive ? phase.color : "#94A3B8",
          }}
        >
          {phase.phase}
        </span>
        <span
          className="max-w-[140px] text-sm font-medium leading-tight transition-colors duration-300"
          style={{
            color: isActive ? "#0F172A" : "#64748B",
          }}
        >
          {phase.title}
        </span>
        <span className="text-xs text-slate-400">{phase.period}</span>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Expanded Phase Card                                                */
/* ------------------------------------------------------------------ */
function PhaseCard({ phase, isOpen }: { phase: PhaseData; isOpen: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const measureHeight = useCallback(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight)
    }
  }, [])

  useEffect(() => {
    measureHeight()
    window.addEventListener("resize", measureHeight)
    return () => window.removeEventListener("resize", measureHeight)
  }, [measureHeight])

  return (
    <div
      id={`panel-${phase.id}`}
      role="region"
      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        maxHeight: isOpen ? `${height}px` : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={ref} className="pt-2 pb-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: phase.color }}
              >
                {phase.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-navy">
                  {phase.title}
                </h4>
                <span className="text-sm text-slate-500">{phase.period}</span>
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: phase.color }}
            >
              {phase.phase}
            </span>
          </div>

          {/* Summary */}
          <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
            {phase.summary}
          </p>

          {/* Team badges for hockey pilot */}
          {phase.teams && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {phase.teams.map((team) => (
                <div
                  key={team.abbr}
                  className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
                  style={{ backgroundColor: `${team.colors[1]}12`, border: `1px solid ${team.colors[1]}30` }}
                >
                  {team.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="h-7 w-7 rounded-full object-contain"
                    />
                  ) : (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${team.colors[0]}, ${team.colors[1]})` }}
                    >
                      {team.abbr}
                    </span>
                  )}
                  <span className="text-xs font-medium text-navy">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Details + Metrics */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Milestones */}
            <div>
              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Key Milestones
              </h5>
              <ul className="space-y-2.5">
                {phase.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: phase.color }}
                    />
                    <span className="text-sm leading-snug text-slate-600">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metric pills */}
            <div>
              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Metrics
              </h5>
              <div className="flex flex-wrap gap-3">
                {phase.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-light px-5 py-3 text-center"
                  >
                    <span
                      className="text-xl font-semibold"
                      style={{ color: phase.color }}
                    >
                      {metric.value}
                    </span>
                    <span className="mt-0.5 text-xs text-slate-500">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Section                                                       */
/* ------------------------------------------------------------------ */
export function GtmSection() {
  const [activePhase, setActivePhase] = useState<string>("phase-1")
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Section id="strategy">
      <ScrollReveal>
        <SectionLabel>Go-to-Market</SectionLabel>
        <SectionHeading>Start Small. Solve Well. Scale Intentionally.</SectionHeading>
        <SectionBody className="mt-4">
          Many ventures in this space fail because they start too broad, overengineer early,
          and build products too expensive for consumers. We do the opposite.
          <br />
          <br />
          CONQ will begin with a concentrated pilot starting with select OHL teams such as
          the Windsor Spitfires, London Knights, and Oshawa Generals allowing us to validate
          the system in a real-world setting, refine our protocols, and build clinical and
          organizational trust before expanding into broader athletic and consumer markets.
        </SectionBody>
      </ScrollReveal>

      {/* ---- Stat Cards ---- */}
      <div
        ref={statsRef}
        className="mt-12 grid gap-4 sm:grid-cols-3"
      >
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label}>
            <StatCard {...stat} index={i} visible={statsVisible} />
          </ScrollReveal>
        ))}
      </div>

      {/* ---- Interactive Timeline ---- */}
      <ScrollReveal className="mt-16">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Phased Expansion Timeline
          </h3>
        </div>

        {/* Timeline track */}
        <div className="relative mt-8">
          {/* Horizontal connecting line */}
          <div className="absolute top-7 right-[16.67%] left-[16.67%] hidden h-0.5 bg-slate-200 md:block" aria-hidden="true">
            {/* Animated progress fill */}
            <div
              className="h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width:
                  activePhase === "phase-1"
                    ? "0%"
                    : activePhase === "phase-2"
                      ? "50%"
                      : "100%",
                background:
                  "linear-gradient(90deg, #3B82F6 0%, #2563EB 50%, #0F172A 100%)",
              }}
            />
          </div>

          {/* Nodes */}
          <div className="relative z-10 flex flex-col items-stretch gap-8 md:flex-row md:justify-between md:gap-0">
            {phases.map((phase, idx) => (
              <div
                key={phase.id}
                className="flex justify-center md:flex-1"
              >
                <TimelineNode
                  phase={phase}
                  isActive={activePhase === phase.id}
                  isCompleted={
                    phases.findIndex((p) => p.id === activePhase) > idx
                  }
                  onClick={() => setActivePhase(phase.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Expanded cards */}
        <div className="mt-8">
          {phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isOpen={activePhase === phase.id}
            />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  )
}
