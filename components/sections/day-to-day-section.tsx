"use client"

import { useRef, useState, useEffect } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Shield,
  Heart,
  Eye,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const DAY_TO_DAY_ITEMS = [
  {
    icon: Brain,
    text: "Improve focus during work or study",
    color: "#3B82F6",
  },
  {
    icon: Zap,
    text: "Detect stress before it affects performance",
    color: "#2563EB",
  },
  {
    icon: Target,
    text: "Optimize mental clarity before high-stakes moments",
    color: "#0F172A",
  },
  {
    icon: TrendingUp,
    text: "Understand how sleep, travel, and workload impact your brain",
    color: "#3B82F6",
  },
  {
    icon: BarChart3,
    text: "Adjust your day based on real cognitive readiness",
    color: "#2563EB",
  },
  {
    icon: Shield,
    text: "Build long-term neurological resilience",
    color: "#0F172A",
  },
  {
    icon: Heart,
    text: "Prevent burnout before it happens",
    color: "#3B82F6",
  },
  {
    icon: Eye,
    text: "Make smarter decisions with objective insight",
    color: "#2563EB",
  },
]

/* ------------------------------------------------------------------ */
/*  Benefit Card                                                       */
/* ------------------------------------------------------------------ */

function BenefitCard({
  item,
  index,
  visible,
}: {
  item: (typeof DAY_TO_DAY_ITEMS)[number]
  index: number
  visible: boolean
}) {
  const Icon = item.icon

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-500 hover:border-blue/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.08)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        style={{ backgroundColor: item.color, opacity: 0.15, transition: "opacity 0.3s" }}
      />
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: item.color }}
      />

      {/* Icon */}
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300"
        style={{
          backgroundColor: `${item.color}12`,
          color: item.color,
        }}
      >
        <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
      </div>

      {/* Text */}
      <p className="text-sm font-medium leading-snug text-slate-700 transition-colors duration-300 group-hover:text-navy">
        {item.text}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function DayToDaySection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = gridRef.current
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
    <>
      {/* ---- Day-to-Day Section ---- */}
      <Section id="day-to-day">
        <ScrollReveal>
          <SectionLabel>Daily Utility</SectionLabel>
          <SectionHeading>Day-to-Day with CONQ</SectionHeading>
          <SectionBody className="mt-4">
            Not recovering from an injury? CONQ still works for you. Beyond
            concussion monitoring, CONQ helps anyone understand and actively
            manage their daily neurological load.
          </SectionBody>
        </ScrollReveal>

        <div
          ref={gridRef}
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DAY_TO_DAY_ITEMS.map((item, i) => (
            <BenefitCard key={item.text} item={item} index={i} visible={visible} />
          ))}
        </div>
      </Section>

      {/* ---- CONQ Flow Section ---- */}
      <Section id="conq-flow" alternate>
        <ScrollReveal>
          <SectionLabel>Consumer Side Product</SectionLabel>
          <SectionHeading>CONQ Flow</SectionHeading>
          <SectionBody className="mt-4">
            CONQ Flow is a side product built for everyday consumers who want
            steadier focus, stress awareness, and better day-to-day cognitive
            routines. Positioned separately from the core CONQ glasses system,
            Flow is designed for regular life — workdays, studying, travel, and
            high-pressure moments. It helps users notice patterns earlier and
            adjust behavior before overload builds, supporting long-term brain
            wellness through practical daily guidance.
          </SectionBody>
        </ScrollReveal>

        <ScrollReveal className="mt-10">
          <div className="overflow-hidden rounded-2xl bg-[#0F172A]">
            <div className="flex flex-col md:flex-row">
              {/* Video */}
              <div className="relative aspect-video w-full md:w-3/5">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src="/conq-flow.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Copy */}
              <div className="flex flex-col justify-center gap-4 p-8 md:w-2/5 md:p-10">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue">
                  Everyday Intelligence
                </span>
                <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
                  Built for daily life.{" "}
                  <span className="text-slate-400">Not just recovery.</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  Stress, focus, clarity, and cognitive readiness — tracked
                  continuously so your daily decisions are informed by something
                  real.
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["Focus", "Stress Awareness", "Daily Load", "Readiness"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/60"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>
    </>
  )
}
