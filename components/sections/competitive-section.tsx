"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import {
  Stethoscope,
  Eye,
  Check,
  X,
  Clock,
  Target,
  ChevronDown,
  Glasses,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Competitor {
  name: string
  icon: React.ReactNode
  accessPoint: string
  accessDetail: string
  timing: string
  timingDetail: string
  useCase: string
  useCaseDetail: string
  concussionSpecific: boolean
  continuous: boolean
  consumerAccess: boolean
  isConq?: boolean
}

const competitors: Competitor[] = [
  {
    name: "CONQ",
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    icon: <img src="/conq-logo-clean.png" className="h-5 w-5 object-contain" alt="" />,
    accessPoint: "Smart glasses",
    accessDetail:
      "Lightweight smart glasses with dual IR eye-tracking cameras, IMU, and PPG sensor. Athletes use them independently without clinical supervision. No appointment needed.",
    timing: "Pre / post / continuous",
    timingDetail:
      "Captures baseline before injury, detects deviation post-injury, and continuously monitors recovery in real-time \u2014 the only solution covering all three windows.",
    useCase: "Daily monitoring + recovery",
    useCaseDetail:
      "Combines daily cognitive snapshots with longitudinal trend tracking and guided return-to-play protocols, purpose-built for concussion.",
    concussionSpecific: true,
    continuous: true,
    consumerAccess: true,
    isConq: true,
  },
  {
    name: "NPI 200",
    icon: <Stethoscope className="h-5 w-5" />,
    accessPoint: "Clinical device",
    accessDetail:
      "Requires a trained clinician and controlled clinical environment. Limited to on-site or sideline administration.",
    timing: "Post-injury assessment",
    timingDetail:
      "Only activated after a suspected injury occurs. Cannot capture pre-injury baselines or monitor recovery longitudinally.",
    useCase: "Sideline evaluation",
    useCaseDetail:
      "Designed for immediate post-impact screening at the point of play. Not intended for continuous monitoring.",
    concussionSpecific: true,
    continuous: false,
    consumerAccess: false,
  },
  {
    name: "EyeGuide",
    icon: <Eye className="h-5 w-5" />,
    accessPoint: "Clinical device",
    accessDetail:
      "Requires specialized eye-tracking hardware and trained operators in a controlled setting.",
    timing: "Post-injury assessment",
    timingDetail:
      "Point-in-time diagnostic tool. No capability for continuous or pre-injury baseline measurement.",
    useCase: "Diagnostic screening",
    useCaseDetail:
      "Focused on eye-movement analysis for diagnostic screening. Does not provide recovery guidance or longitudinal tracking.",
    concussionSpecific: true,
    continuous: false,
    consumerAccess: false,
  },
  {
    name: "Oura",
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    icon: <img src="/logos/oura.svg" className="h-4 w-auto object-contain" alt="" />,
    accessPoint: "Consumer wearable",
    accessDetail:
      "Consumer ring form-factor with excellent wearability. However, sensors are not optimized for neurological assessment.",
    timing: "Continuous",
    timingDetail:
      "Tracks 24/7 biometrics like HRV and sleep, but none of the tracked metrics are validated for concussion detection.",
    useCase: "General wellness",
    useCaseDetail:
      "Focused on sleep, readiness, and activity tracking for the general health market. No concussion-specific algorithms.",
    concussionSpecific: false,
    continuous: true,
    consumerAccess: true,
  },
  {
    name: "WHOOP",
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    icon: <img src="/logos/whoop.svg" className="h-3 w-auto object-contain" alt="" />,
    accessPoint: "Consumer wearable",
    accessDetail:
      "Subscription-based wrist strap with strong athlete adoption. Sensors focus on strain, recovery, and sleep metrics.",
    timing: "Continuous",
    timingDetail:
      "24/7 monitoring of physiological strain and recovery, but no specialized neuro-cognitive markers for concussion assessment.",
    useCase: "Athletic performance",
    useCaseDetail:
      "Optimized for performance training load, recovery scoring, and sleep coaching. Not designed for injury detection or medical use.",
    concussionSpecific: false,
    continuous: true,
    consumerAccess: true,
  },
]

const differentiators = [
  {
    label: "Accessibility",
    icon: <Glasses className="h-5 w-5" />,
    description:
      "Consumer-grade hardware requiring no clinical supervision or specialized training.",
  },
  {
    label: "Timing",
    icon: <Clock className="h-5 w-5" />,
    description:
      "The only solution capturing pre-injury baselines, post-injury assessment, and continuous recovery monitoring.",
  },
  {
    label: "Specificity",
    icon: <Target className="h-5 w-5" />,
    description:
      "Purpose-built concussion biomarkers \u2014 not repurposed wellness metrics.",
  },
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FeatureIndicator({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3B82F6]/10">
      <Check className="h-4 w-4 text-[#3B82F6]" />
    </span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F1F5F9]">
      <X className="h-4 w-4 text-[#94A3B8]" />
    </span>
  )
}

function CellTooltip({
  content,
  children,
}: {
  content: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        className="group flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-left transition-all hover:bg-[#3B82F6]/5 hover:text-[#3B82F6]"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-expanded={open}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[#CBD5E1] transition-all duration-200 group-hover:text-[#3B82F6]",
            open && "rotate-180 text-[#3B82F6]"
          )}
        />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-[#E2E8F0] bg-white p-3.5 text-sm leading-relaxed text-[#475569] shadow-lg shadow-[#0F172A]/5"
        >
          {content}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function CompetitiveSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [stickyActive, setStickyActive] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const headerSentinelRef = useRef<HTMLDivElement>(null)

  /* Sticky header detection via IntersectionObserver */
  useEffect(() => {
    const sentinel = headerSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyActive(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const toggleRow = useCallback((name: string) => {
    setExpandedRow((prev) => (prev === name ? null : name))
  }, [])

  return (
    <Section id="competitive" alternate>
      <ScrollReveal>
        <SectionLabel>Competitive Landscape</SectionLabel>
        <SectionHeading>Nobody Sits Where CONQ Sits</SectionHeading>
        <SectionBody className="mt-4">
          Clinical tools like the NPI 200 and EyeGUIDE improve assessment, but only
          inside controlled settings. Wellness platforms like WHOOP and Oura have shifted
          health tracking toward physiological awareness, but measure broad recovery signals,
          not brain-specific strain. CONQ is continuous, multi-modal neurological monitoring,
          validated against Amsterdam Consensus 2023 return-to-activity protocols, available
          outside the clinic at a consumer price point. That is the gap.
          <br />
          <br />
          After injury, athletes are told to {"'"}monitor symptoms{"'"} and {"'"}ease back
          gradually.{"'"} But {"there's"} no continuous signal guiding those decisions.
          <br />
          Clinical systems stay in the clinic. Wellness wearables track general
          recovery — not the brain.
          <br />
          We built CONQ to live in the space between — delivering real-time
          neurological intelligence in the moments that actually matter.
        </SectionBody>
      </ScrollReveal>

      {/* Differentiator pills */}
      <ScrollReveal className="mt-10">
        <div className="flex flex-wrap gap-3">
          {differentiators.map((d) => (
            <div
              key={d.label}
              className="group relative flex items-center gap-2.5 rounded-full border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#0F172A] shadow-sm transition-all duration-200 hover:border-[#3B82F6]/30 hover:shadow-md"
            >
              <span className="text-[#3B82F6]">{d.icon}</span>
              {d.label}
              {/* Hover tooltip */}
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-60 -translate-x-1/2 rounded-lg border border-[#E2E8F0] bg-white p-3 text-xs font-normal leading-relaxed text-[#475569] opacity-0 shadow-lg shadow-[#0F172A]/5 transition-opacity duration-200 group-hover:opacity-100">
                {d.description}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Comparison Table */}
      <ScrollReveal className="mt-10">
        <div className="mb-4 flex items-center gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6]/10">
              <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
            </span>
            <span>Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F1F5F9]">
              <X className="h-3.5 w-3.5 text-[#94A3B8]" />
            </span>
            <span>Not supported</span>
          </div>
          <div className="ml-auto hidden items-center gap-1.5 md:flex">
            <ChevronDown className="h-3.5 w-3.5" />
            <span className="italic">Hover cells for details</span>
          </div>
        </div>
        <div
          ref={tableRef}
          className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-white shadow-sm"
        >
          {/* Sentinel element for sticky detection */}
          <div ref={headerSentinelRef} className="h-0 w-full" aria-hidden />

          <table className="w-full min-w-[700px] border-collapse text-sm">
            {/* Sticky Header */}
            <thead>
              <tr
                className={cn(
                  "sticky top-0 z-10 border-b border-[#E2E8F0] bg-[#0F172A] text-left text-xs font-semibold uppercase tracking-wider text-white transition-shadow duration-200",
                  stickyActive && "shadow-md"
                )}
              >
                <th className="rounded-tl-xl px-5 py-4">Solution</th>
                <th className="px-5 py-4">Access Point</th>
                <th className="px-5 py-4">Application Timing</th>
                <th className="px-5 py-4">Primary Use Case</th>
                <th className="px-5 py-4 text-center">Concussion-Specific</th>
                <th className="px-5 py-4 text-center">Continuous</th>
                <th className="rounded-tr-xl px-5 py-4 text-center">
                  Consumer
                </th>
              </tr>
            </thead>

            <tbody>
              {competitors.map((c, idx) => {
                const isExpanded = expandedRow === c.name
                const isConq = c.isConq === true

                return (
                  <tr
                    key={c.name}
                    onClick={() => toggleRow(c.name)}
                    className={cn(
                      "group cursor-pointer border-b border-[#E2E8F0] transition-colors duration-150 last:border-b-0",
                      isConq
                        ? "bg-[#3B82F6]/[0.04] hover:bg-[#3B82F6]/[0.08]"
                        : idx % 2 === 0
                          ? "bg-white hover:bg-[#F1F5F9]/60"
                          : "bg-[#F1F5F9]/40 hover:bg-[#F1F5F9]/80"
                    )}
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            isConq
                              ? "bg-[#3B82F6] text-white"
                              : "bg-[#F1F5F9] text-[#475569]"
                          )}
                        >
                          {c.icon}
                        </span>
                        <div>
                          <span
                            className={cn(
                              "font-semibold",
                              isConq ? "text-[#3B82F6]" : "text-[#0F172A]"
                            )}
                          >
                            {c.name}
                          </span>
                          {isConq && (
                            <span className="ml-2 inline-block rounded-full bg-[#3B82F6]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3B82F6]">
                              Us
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Expanded detail (mobile-friendly) */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2 text-xs leading-relaxed text-[#475569] md:hidden">
                          <p>
                            <span className="font-semibold text-[#0F172A]">
                              Access:{" "}
                            </span>
                            {c.accessDetail}
                          </p>
                          <p>
                            <span className="font-semibold text-[#0F172A]">
                              Timing:{" "}
                            </span>
                            {c.timingDetail}
                          </p>
                          <p>
                            <span className="font-semibold text-[#0F172A]">
                              Use case:{" "}
                            </span>
                            {c.useCaseDetail}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Access Point */}
                    <td className="hidden px-5 py-4 md:table-cell">
                      <CellTooltip content={c.accessDetail}>
                        <span
                          className={cn(
                            "border-b border-dashed border-transparent transition-colors group-hover:border-[#CBD5E1]",
                            isConq && "font-medium text-[#0F172A]"
                          )}
                        >
                          {c.accessPoint}
                        </span>
                      </CellTooltip>
                    </td>

                    {/* Timing */}
                    <td className="hidden px-5 py-4 md:table-cell">
                      <CellTooltip content={c.timingDetail}>
                        {isConq ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/10 px-3 py-1 font-semibold text-[#3B82F6] shadow-sm ring-1 ring-[#3B82F6]/20">
                            <Clock className="h-3.5 w-3.5" />
                            {c.timing}
                          </span>
                        ) : (
                          <span className="border-b border-dashed border-transparent transition-colors group-hover:border-[#CBD5E1]">
                            {c.timing}
                          </span>
                        )}
                      </CellTooltip>
                    </td>

                    {/* Use Case */}
                    <td className="hidden px-5 py-4 md:table-cell">
                      <CellTooltip content={c.useCaseDetail}>
                        <span
                          className={cn(
                            "border-b border-dashed border-transparent transition-colors group-hover:border-[#CBD5E1]",
                            isConq && "font-medium text-[#0F172A]"
                          )}
                        >
                          {c.useCase}
                        </span>
                      </CellTooltip>
                    </td>

                    {/* Concussion-Specific */}
                    <td className="hidden px-5 py-4 text-center md:table-cell">
                      <div className="flex justify-center">
                        <FeatureIndicator value={c.concussionSpecific} />
                      </div>
                    </td>

                    {/* Continuous */}
                    <td className="hidden px-5 py-4 text-center md:table-cell">
                      <div className="flex justify-center">
                        <FeatureIndicator value={c.continuous} />
                      </div>
                    </td>

                    {/* Consumer */}
                    <td className="hidden px-5 py-4 text-center md:table-cell">
                      <div className="flex justify-center">
                        <FeatureIndicator value={c.consumerAccess} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </ScrollReveal>

      {/* Bottom narrative — moat */}
      <ScrollReveal className="mt-10">
        <div className="rounded-2xl bg-[#0F172A] p-8 md:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">
            The moat
          </p>
          <h3 className="mt-3 text-2xl font-semibold leading-snug text-white md:text-3xl">
            Three barriers.{" "}
            <span className="text-[#64748B]">All required. Built simultaneously.</span>
          </h3>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { num: "01", title: "Hardware", body: "Multi-sensor fusion across eye tracking, IMU, and PPG. Genuinely difficult to miniaturize." },
              { num: "02", title: "Protocol", body: "Clinical expertise to make raw biometric data medically meaningful and actionable." },
              { num: "03", title: "Trust", body: "Credibility with the sports medicine community to drive institutional adoption." },
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <span className="text-3xl font-bold leading-none text-white/10">
                  {item.num}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-[#64748B]">
            That combination is why this {"hasn\u2019t"} been built yet.{" "}
            <span className="font-medium text-white">and why we are building it now.</span>
          </p>
        </div>
      </ScrollReveal>
    </Section>
  )
}
