"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
} from "@/components/section"
import { FadeInOnScroll } from "@/components/parallax"

/* ------------------------------------------------------------------ */
/*  Animated counter (unchanged)                                       */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target = 400000, duration = 2000 }: { target?: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true)
            hasAnimated.current = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const startTime = Date.now()
    const endTime = startTime + duration
    const updateCounter = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * target))
      if (now < endTime) requestAnimationFrame(updateCounter)
      else setCount(target)
    }
    requestAnimationFrame(updateCounter)
  }, [isVisible, target, duration])

  return (
    <span ref={ref}>
      <span className="tabular-nums">{count.toLocaleString()}</span>
      <span className="text-blue">+</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Cycling symptom text — symptoms flicker in/out like they're       */
/*  invisible, reinforcing the concussion metaphor                     */
/* ------------------------------------------------------------------ */

const SYMPTOMS = [
  "Cognitive fog",
  "Memory gaps",
  "Light sensitivity",
  "Fatigue",
  "Balance loss",
  "Sleep disruption",
  "Mood swings",
  "Blurred vision",
  "Nausea",
  "Headaches",
]

function CyclingSymptoms() {
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SYMPTOMS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [started])

  return (
    <div ref={ref} className="relative flex h-[1.2em] items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={SYMPTOMS[index]}
          initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -30, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute text-blue"
        >
          {SYMPTOMS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  "Snapshots vs Live Stream" gap visualisation                       */
/* ------------------------------------------------------------------ */

function DiagnosticGap() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const dotPositions = [8, 30, 72, 92]

  const SvgLine = useCallback(
    ({ continuous }: { continuous: boolean }) => (
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-10 w-full">
        {continuous ? (
          <motion.path
            d="M0,16 Q10,6 20,16 T40,16 T60,16 T80,16 T100,16"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={visible ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }}
          />
        ) : (
          <>
            <line
              x1="0" y1="16" x2="100" y2="16"
              stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2 3"
            />
            {dotPositions.map((x) => (
              <motion.circle
                key={x}
                cx={x} cy="16" r="2.5"
                fill="#0F172A"
                initial={{ scale: 0 }}
                animate={visible ? { scale: 1 } : {}}
                transition={{ delay: 0.2 + x * 0.008, duration: 0.4, ease: "backOut" }}
              />
            ))}
          </>
        )}
      </svg>
    ),
    [visible, dotPositions]
  )

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2">
      {/* Current state */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          What clinicians get
        </p>
        <SvgLine continuous={false} />
        <p className="mt-3 text-sm font-semibold text-navy">
          Snapshots
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          A handful of clinic visits spread across weeks.
          Between appointments, nothing is measured.
        </p>
      </div>

      {/* What recovery needs */}
      <div className="rounded-2xl border border-blue/20 bg-blue/[0.04] p-6 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">
          What recovery demands
        </p>
        <SvgLine continuous={true} />
        <p className="mt-3 text-sm font-semibold text-navy">
          A live stream
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Continuous biometric data (pupil response, eye tracking,
          heart-rate variability) captured in the real moments that matter.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Symptom scatter — words at varying opacities like they're          */
/*  flickering in and out of visibility                                */
/* ------------------------------------------------------------------ */

const SYMPTOM_ITEMS: { label: string; opacity: number; size: string }[] = [
  { label: "Cognitive fog",     opacity: 0.85, size: "text-lg md:text-xl" },
  { label: "Memory gaps",       opacity: 0.35, size: "text-sm md:text-base" },
  { label: "Light sensitivity", opacity: 0.6,  size: "text-base md:text-lg" },
  { label: "Fatigue",           opacity: 0.9,  size: "text-xl md:text-2xl" },
  { label: "Balance loss",      opacity: 0.45, size: "text-sm md:text-base" },
  { label: "Sleep disruption",  opacity: 0.7,  size: "text-base md:text-lg" },
  { label: "Mood swings",       opacity: 0.25, size: "text-xs md:text-sm" },
  { label: "Blurred vision",    opacity: 0.55, size: "text-base md:text-lg" },
  { label: "Nausea",            opacity: 0.3,  size: "text-sm" },
  { label: "Headaches",         opacity: 0.8,  size: "text-lg md:text-xl" },
  { label: "Irritability",      opacity: 0.2,  size: "text-xs md:text-sm" },
  { label: "Tinnitus",          opacity: 0.15, size: "text-xs" },
]

function SymptomScatter() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:gap-x-8 md:gap-y-4">
      {SYMPTOM_ITEMS.map((s, i) => (
        <motion.span
          key={s.label}
          className={`font-medium italic tracking-tight text-navy ${s.size}`}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={
            visible
              ? { opacity: s.opacity, filter: "blur(0px)" }
              : {}
          }
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {s.label}
        </motion.span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  The impossible dilemma — spectrum between two bad outcomes          */
/* ------------------------------------------------------------------ */

function ImpossibleDilemma() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-2xl bg-navy p-8 md:p-10">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
        The impossible choice
      </p>

      {/* Spectrum bar */}
      <div className="relative mx-auto mt-8 max-w-xl">
        {/* Gradient bar */}
        <div className="relative h-2 overflow-hidden rounded-full bg-slate-700">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(to right, #EF4444, #334155 45%, #334155 55%, #F59E0B)",
            }}
            initial={{ scaleX: 0 }}
            animate={visible ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style-origin="left"
          />
        </div>

        {/* Pulsing center marker */}
        <motion.div
          className="absolute -top-2.5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-slate-600 bg-navy"
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
        >
          <span className="text-[10px] font-bold text-slate-400">?</span>
        </motion.div>

        {/* Labels */}
        <div className="mt-6 flex justify-between">
          <motion.div
            className="max-w-[140px] md:max-w-[180px]"
            initial={{ opacity: 0, x: -15 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <p className="text-sm font-semibold text-red-400">Return too early</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Second-impact syndrome. Prolonged symptoms. Long-term damage.
            </p>
          </motion.div>

          <motion.div
            className="max-w-[140px] text-right md:max-w-[180px]"
            initial={{ opacity: 0, x: 15 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <p className="text-sm font-semibold text-amber-400">Stay out too long</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Anxiety, depression, physical decline. Inactivity worsens recovery.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.p
        className="mt-8 text-center text-sm font-medium text-slate-400"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Without objective data, <span className="text-white">{"who's"} making the call?</span>
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Export                                                              */
/* ------------------------------------------------------------------ */

export function ProblemSection() {
  return (
    <>
      {/* Dramatic full-width stat */}
      <div className="relative overflow-hidden bg-navy py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <FadeInOnScroll direction="up" duration={0.9}>
            <p className="text-8xl font-semibold leading-none tracking-tighter text-white md:text-[10rem] lg:text-[12rem]">
              <AnimatedCounter target={400000} duration={2800} />
            </p>
            <p className="mt-6 text-xl font-medium text-slate-400 md:text-2xl">
              Canadians suffer concussions every year.
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500">
              Yet the recovery system has no objective, continuous way to see
              what the brain is experiencing.
            </p>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Problem detail section */}
      <Section id="problem" alternate>
        <ScrollReveal>
          <SectionLabel>The Problem</SectionLabel>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-navy md:text-4xl lg:text-[2.75rem]">
            You {"can't"} treat what you {"can't"} see.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Concussion symptoms are real, but invisible, intermittent, and
            deeply subjective. No scan catches them. No questionnaire tracks
            them between visits.
          </p>
        </ScrollReveal>

        {/* Symptom scatter — words at varying visibility */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-white px-6 py-12 md:px-10 md:py-16">
          <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Symptoms that no scan can see
          </p>
          <SymptomScatter />
        </div>

        {/* Snapshots vs Live Stream */}
        <div className="mt-10">
          <DiagnosticGap />
        </div>

        {/* The impossible dilemma */}
        <div className="mt-10">
          <ImpossibleDilemma />
        </div>
      </Section>
    </>
  )
}
