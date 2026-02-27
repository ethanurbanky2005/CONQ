"use client"

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { FadeInOnScroll } from "@/components/parallax"
import { SectionNumber } from "@/components/interstitials"
import {
  Eye,
  Move,
  EyeOff,
  Activity,
  Heart,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  ArrowUpRight,
  X,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface BiometricMarker {
  id: string
  title: string
  shortTitle: string
  icon: ReactNode
  description: string
  detail: string
  diagramLabel: string
  /** Simulated waveform shape — array of normalised y-values (0-1) */
  wave: number[]
  /** Simulated abnormal waveform */
  waveAbnormal: number[]
  color: string
}

const WAVE_NORMAL_PUPIL = Array.from({ length: 40 }, (_, i) => {
  const t = i / 39
  return t < 0.15 ? 1 : t < 0.35 ? 1 - ((t - 0.15) / 0.2) * 0.65 : t < 0.6 ? 0.35 : 0.35 + ((t - 0.6) / 0.4) * 0.45
})

const WAVE_ABNORMAL_PUPIL = Array.from({ length: 40 }, (_, i) => {
  const t = i / 39
  return t < 0.25 ? 1 : t < 0.55 ? 1 - ((t - 0.25) / 0.3) * 0.35 : t < 0.75 ? 0.65 + Math.sin(t * 20) * 0.05 : 0.65 + ((t - 0.75) / 0.25) * 0.2
})

const WAVE_NORMAL_EYE = Array.from({ length: 40 }, (_, i) => 0.5 + 0.35 * Math.sin((i / 39) * Math.PI * 4))
const WAVE_ABNORMAL_EYE = Array.from({ length: 40 }, (_, i) => 0.5 + 0.35 * Math.sin((i / 39) * Math.PI * 4) + (Math.random() - 0.5) * 0.25)

const WAVE_NORMAL_BLINK = Array.from({ length: 40 }, (_, i) => {
  const t = (i / 39) * 6
  const base = 0.15
  const spike = (p: number) => Math.max(0, 1 - Math.abs(t - p) * 3)
  return base + spike(1) * 0.85 + spike(3) * 0.85 + spike(5) * 0.85
})
const WAVE_ABNORMAL_BLINK = Array.from({ length: 40 }, (_, i) => {
  const t = (i / 39) * 6
  const base = 0.15
  const spike = (p: number) => Math.max(0, 1 - Math.abs(t - p) * 3)
  return base + spike(0.8) * 0.85 + spike(2.2) * 0.6 + spike(4.7) * 0.85 + spike(5.5) * 0.4
})

const WAVE_NORMAL_HEAD = Array.from({ length: 40 }, (_, i) => 0.5 + (Math.sin(i * 0.4) * 0.05 + Math.cos(i * 0.7) * 0.03))
const WAVE_ABNORMAL_HEAD = Array.from({ length: 40 }, (_, i) => 0.5 + Math.sin(i * 0.4) * 0.2 + Math.cos(i * 1.3) * 0.15)

const WAVE_NORMAL_HRV = Array.from({ length: 40 }, (_, i) => 0.5 + 0.3 * Math.sin((i / 39) * Math.PI * 6) + 0.1 * Math.sin((i / 39) * Math.PI * 3))
const WAVE_ABNORMAL_HRV = Array.from({ length: 40 }, (_, i) => 0.5 + 0.12 * Math.sin((i / 39) * Math.PI * 6) + 0.05 * Math.sin((i / 39) * Math.PI * 3))

const markers: BiometricMarker[] = [
  {
    id: "pupil",
    title: "Pupil Response Dynamics",
    shortTitle: "Pupil Response",
    icon: <Eye className="h-6 w-6" />,
    description: "Tracks pupillary light reflex speed and consistency.",
    detail:
      "Concussed individuals exhibit delayed or irregular constriction patterns, revealing autonomic nervous system disruption. CONQ measures constriction latency, velocity, and amplitude to detect sub-clinical changes invisible to standard examination.",
    diagramLabel: "Light Reflex Constriction",
    wave: WAVE_NORMAL_PUPIL,
    waveAbnormal: WAVE_ABNORMAL_PUPIL,
    color: "#3B82F6",
  },
  {
    id: "eye-movement",
    title: "Eye Movement Stability",
    shortTitle: "Eye Movement",
    icon: <Move className="h-6 w-6" />,
    description: "Monitors smooth pursuit and saccadic movement precision.",
    detail:
      "Post-concussion instability manifests as jerky tracking or reduced coordination between eye movements. CONQ captures positional accuracy during controlled tracking tasks, quantifying deviation from ideal smooth pursuit paths.",
    diagramLabel: "Smooth Pursuit Tracking",
    wave: WAVE_NORMAL_EYE,
    waveAbnormal: WAVE_ABNORMAL_EYE,
    color: "#2563EB",
  },
  {
    id: "blink",
    title: "Blink Variability",
    shortTitle: "Blink Rate",
    icon: <EyeOff className="h-6 w-6" />,
    description: "Analyzes blink frequency and duration patterns.",
    detail:
      "Neurological stress alters baseline blink mechanics, providing early indication of cognitive strain. CONQ tracks inter-blink intervals and blink duration to detect irregular temporal patterns correlated with neurological disruption.",
    diagramLabel: "Blink Interval Pattern",
    wave: WAVE_NORMAL_BLINK,
    waveAbnormal: WAVE_ABNORMAL_BLINK,
    color: "#60A5FA",
  },
  {
    id: "head-motion",
    title: "Head Motion Variability",
    shortTitle: "Head Motion",
    icon: <Activity className="h-6 w-6" />,
    description: "Measures micro-movements during stationary tasks.",
    detail:
      "Increased head motion correlates with vestibular dysfunction and balance impairment. CONQ uses inertial sensors to quantify postural sway amplitude and frequency, detecting sub-threshold instability during focused activities.",
    diagramLabel: "Postural Sway Amplitude",
    wave: WAVE_NORMAL_HEAD,
    waveAbnormal: WAVE_ABNORMAL_HEAD,
    color: "#0F172A",
  },
  {
    id: "hrv",
    title: "Heart Rate Variability",
    shortTitle: "Heart Rate",
    icon: <Heart className="h-6 w-6" />,
    description: "Evaluates autonomic regulation through beat-to-beat intervals.",
    detail:
      "Reduced HRV indicates compromised parasympathetic function, a hallmark of concussion recovery challenges. CONQ analyzes time-domain and frequency-domain HRV metrics to assess nervous system recovery status continuously.",
    diagramLabel: "R-R Interval Variability",
    wave: WAVE_NORMAL_HRV,
    waveAbnormal: WAVE_ABNORMAL_HRV,
    color: "#EF4444",
  },
]

/* ------------------------------------------------------------------ */
/*  Animated Waveform SVG                                              */
/* ------------------------------------------------------------------ */

function WaveformDiagram({
  normal,
  abnormal,
  color,
  label,
  isVisible,
}: {
  normal: number[]
  abnormal: number[]
  color: string
  label: string
  isVisible: boolean
}) {
  const W = 280
  const H = 100
  const pad = 8

  const toPath = (data: number[]) => {
    const points = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (W - pad * 2),
      y: pad + (1 - v) * (H - pad * 2),
    }))
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label={`Waveform diagram showing ${label}`}
        role="img"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={pad}
            y1={pad + (1 - frac) * (H - pad * 2)}
            x2={W - pad}
            y2={pad + (1 - frac) * (H - pad * 2)}
            stroke="#E2E8F0"
            strokeWidth="0.5"
            strokeDasharray="4 3"
          />
        ))}
        {/* Abnormal wave (background) */}
        <path
          d={toPath(abnormal)}
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={isVisible ? 0.45 : 0}
          style={{ transition: "opacity 0.8s ease 0.4s" }}
        />
        {/* Normal wave (foreground) */}
        <path
          d={toPath(normal)}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="600"
          strokeDashoffset={isVisible ? 0 : 600}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span
            className="inline-block h-0.5 w-3 rounded"
            style={{ backgroundColor: color }}
          />
          Normal
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-3 rounded border border-dashed" style={{ borderColor: "#EF4444" }} />
          Post-concussion
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated Biometric Icon                                            */
/* ------------------------------------------------------------------ */

function BiometricIcon({ marker, isActive }: { marker: BiometricMarker; isActive: boolean }) {
  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
      style={{
        backgroundColor: isActive ? marker.color : "#F1F5F9",
        color: isActive ? "#FFFFFF" : marker.color,
      }}
    >
      {marker.icon}
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-xl"
        style={{
          boxShadow: isActive ? `0 0 0 4px ${marker.color}20` : "none",
          transition: "box-shadow 0.3s ease",
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Biometric Panel                                                    */
/* ------------------------------------------------------------------ */

function BiometricPanel({
  marker,
  isExpanded,
  onToggle,
}: {
  marker: BiometricMarker
  isExpanded: boolean
  onToggle: () => void
}) {
  const [diagramVisible, setDiagramVisible] = useState(false)

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setDiagramVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setDiagramVisible(false)
    }
  }, [isExpanded])

  return (
    <div
      className="group relative cursor-pointer rounded-2xl border bg-white transition-all duration-500"
      style={{
        borderColor: isExpanded ? marker.color : "#E2E8F0",
        boxShadow: isExpanded
          ? `0 8px 32px ${marker.color}15, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle() }}}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${marker.title} — ${isExpanded ? "collapse" : "expand"}`}
    >
      {/* Compact state */}
      <div className="flex items-start gap-4 p-5">
        <BiometricIcon marker={marker} isActive={isExpanded} />
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-semibold leading-tight transition-colors duration-300"
            style={{ color: isExpanded ? marker.color : "#0F172A" }}
          >
            {marker.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {marker.description}
          </p>
        </div>
        {/* Expand indicator */}
        <div
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
          style={{
            backgroundColor: isExpanded ? marker.color : "#F1F5F9",
            transform: isExpanded ? "rotate(0deg)" : "rotate(0deg)",
          }}
        >
          {isExpanded ? (
            <X className="h-3 w-3 text-white" />
          ) : (
            <ArrowUpRight className="h-3 w-3 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isExpanded ? "340px" : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <p className="text-xs leading-relaxed text-slate-600">
            {marker.detail}
          </p>
          <WaveformDiagram
            normal={marker.wave}
            abnormal={marker.waveAbnormal}
            color={marker.color}
            label={marker.diagramLabel}
            isVisible={diagramVisible}
          />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedValue(target: number, isActive: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) { setValue(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isActive, target, duration])

  return value
}

/* ------------------------------------------------------------------ */
/*  Circular Gauge                                                     */
/* ------------------------------------------------------------------ */

function CircularGauge({
  value,
  max,
  color,
  size = 80,
  strokeWidth = 6,
}: {
  value: number
  max: number
  color: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference

  return (
    <svg width={size} height={size} className="shrink-0" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={circumference - progress}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Metric Cards                                                       */
/* ------------------------------------------------------------------ */

function MetricCards() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el) } },
      { threshold: 0.3, rootMargin: "0px 0px -60px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cognitiveLoad = useAnimatedValue(78, isVisible, 1600)
  const autonomicStability = useAnimatedValue(92, isVisible, 1800)
  const stressReactivity = useAnimatedValue(65, isVisible, 1500)

  const cards = [
    {
      title: "Cognitive Load Score",
      description: "Composite 0-100 rating synthesizing all biometric inputs into a single readiness indicator.",
      value: cognitiveLoad,
      max: 100,
      suffix: "/100",
      color: "#3B82F6",
      icon: <Brain className="h-5 w-5" />,
      status: "Normal Range",
      statusColor: "#10B981",
    },
    {
      title: "Autonomic Stability Index",
      description: "HRV and pupil response integration measuring nervous system regulation.",
      value: autonomicStability,
      max: 100,
      suffix: "%",
      color: "#2563EB",
      icon: <Shield className="h-5 w-5" />,
      status: "Stable",
      statusColor: "#10B981",
    },
    {
      title: "Stress Reactivity Profile",
      description: "Quantifies physiological response to controlled stimuli during baseline testing.",
      value: stressReactivity,
      max: 100,
      suffix: "/100",
      color: "#0F172A",
      icon: <Zap className="h-5 w-5" />,
      status: "Moderate",
      statusColor: "#F59E0B",
    },
  ]

  return (
    <div ref={ref} className="mt-14 grid gap-5 sm:grid-cols-3">
      {cards.map((card, idx) => (
        <div
          key={card.title}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: `${idx * 120}ms`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {/* Accent bar */}
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
            style={{ backgroundColor: card.color }}
          />

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.color}10`, color: card.color }}
                >
                  {card.icon}
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </h4>
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span
                  className="text-4xl font-semibold tabular-nums leading-none"
                  style={{ color: card.color }}
                >
                  {card.value}
                </span>
                <span className="mb-0.5 text-sm font-medium text-slate-400">
                  {card.suffix}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: card.statusColor }}
                />
                <span className="text-xs font-medium" style={{ color: card.statusColor }}>
                  {card.status}
                </span>
                <TrendingUp className="ml-auto h-3.5 w-3.5 text-slate-300" />
              </div>
            </div>
            <CircularGauge
              value={isVisible ? card.value : 0}
              max={card.max}
              color={card.color}
              size={72}
              strokeWidth={5}
            />
          </div>

          <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                         */
/* ------------------------------------------------------------------ */

export function SolutionSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <Section id="solution">
      <SectionNumber number="01">
        <ScrollReveal>
          <SectionLabel>Our Solution</SectionLabel>
          <SectionHeading>
            Smart Glasses That See What Doctors {"Can't"}
          </SectionHeading>
          <SectionBody className="mt-4">
            CONQ is a pair of smart glasses equipped with dual infrared eye-tracking
            cameras, an IMU, and a PPG sensor, capturing five trackable markers
            continuously, outside the clinic.
            <br />
            <br />
            The information glasses provide becomes actionable through three clear
            outputs: Cognitive Load Score, Autonomic Stability Index, and Stress
            Reactivity Profile. Not to diagnose. Not to replace doctors. But to
            give individuals and clinicians a measurable, daily window into
            cognitive strain and recovery.
          </SectionBody>
        </ScrollReveal>

        {/* Product showcase — glasses 3D render */}
        <FadeInOnScroll direction="up">
          <div className="mt-12 overflow-hidden rounded-2xl bg-[#0F172A]">
            <div className="flex flex-col items-center md:flex-row">
              <div className="relative aspect-video w-full md:w-3/5">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src="/glasses-render.mp4"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 p-8 md:w-2/5 md:p-10">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue">
                  The Device
                </span>
                <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
                  Five sensors.{" "}
                  <span className="text-slate-400">One frame.</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Dual IR eye-tracking cameras, inertial measurement, and
                  photoplethysmography, all packaged in frames indistinguishable from
                  everyday glasses.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["IR Eye Tracking", "IMU", "PPG Sensor", "BLE 5.0"].map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/60"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Five biometric panels */}
        <ScrollReveal stagger className="mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            {markers.map((m) => (
              <div key={m.id} className="reveal-on-scroll w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]">
                <BiometricPanel
                  marker={m}
                  isExpanded={expandedId === m.id}
                  onToggle={() => handleToggle(m.id)}
                />
              </div>
            ))}
          </div>
          <p className="reveal-on-scroll mt-4 text-center text-xs text-slate-400">
            Tap a marker to explore its measurement methodology
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-14">
          <h3 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Metrics That Guide Daily Decisions
          </h3>
        </ScrollReveal>

        {/* Metric cards */}
        <MetricCards />
      </SectionNumber>
      </Section>
  )
}
