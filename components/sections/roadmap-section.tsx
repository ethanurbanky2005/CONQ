"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { Calendar, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface Milestone {
  id: string
  date: string
  title: string
  description: string
  icon: React.ReactNode
  background: "white" | "slate"
}

const milestones: Milestone[] = [
  {
    id: "current",
    date: "Current Status",
    title: "Active Development Phase",
    description:
      "Active development phase with biometric algorithm refinement and hardware prototyping. Building the foundation for accurate, continuous concussion monitoring.",
    icon: <Cpu className="h-6 w-6" />,
    background: "white",
  },
  {
    id: "june-2026",
    date: "June 2026",
    title: "Institutional Research Partner",
    description:
      "Secure institutional research partner for clinical validation and pilot testing. Establishing medical credibility and gathering real-world performance data.",
    icon: <Calendar className="h-6 w-6" />,
    background: "slate",
  },
  {
    id: "ohl-season",
    date: "2026-27 OHL Season",
    title: "OHL Pilot Launch",
    description:
      "Launch pilot program with Ontario Hockey League, targeting 500+ athletes across multiple teams. Real-world deployment with high-impact athlete population.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C19.2 3 21 4.8 21 7C21 9.2 19.2 11 17 11H13L7 21H3L7 11H5C3.3 11 2 9.7 2 8V7C2 5.3 3.3 4 5 4H7L9 3H17Z" />
      </svg>
    ),
    background: "white",
  },
]

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isLeft = index % 2 === 0

  return (
    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left side (desktop) */}
      <div
        className={cn(
          "flex justify-start lg:justify-end",
          !isLeft && "lg:order-2"
        )}
      >
        <div
          ref={cardRef}
          className={cn(
            "w-full max-w-md transition-all duration-700 ease-out",
            isVisible
              ? "translate-x-0 opacity-100"
              : isLeft
              ? "-translate-x-8 opacity-0"
              : "translate-x-8 opacity-0"
          )}
          style={{ transitionDelay: `${index * 150}ms` }}
        >
          <div
            className={cn(
              "group relative rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md lg:p-8",
              milestone.background === "white"
                ? "bg-white"
                : "bg-slate-light"
            )}
          >
            {/* Date Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue px-4 py-1.5 text-sm font-semibold text-white">
              {milestone.date}
            </div>

            {/* Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-white transition-transform duration-300 group-hover:scale-110">
              {milestone.icon}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-xl font-semibold leading-tight text-navy lg:text-2xl">
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="leading-relaxed text-slate-600">
              {milestone.description}
            </p>

            {/* Decorative corner accent */}
            <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden rounded-tr-xl opacity-5">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rotate-45 bg-blue"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline node (desktop only) */}
      <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 lg:flex lg:flex-col lg:items-center">
        {/* Connecting line */}
        <div
          className={cn(
            "absolute left-1/2 top-0 w-1 -translate-x-1/2 bg-blue transition-all duration-1000 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            height: index === milestones.length - 1 ? "50%" : "100%",
            transitionDelay: `${index * 150 + 200}ms`,
          }}
        />

        {/* Node circle */}
        <div
          className={cn(
            "relative z-10 mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue bg-white shadow-lg transition-all duration-700 ease-out",
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
          style={{ transitionDelay: `${index * 150 + 400}ms` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white">
            {milestone.icon}
          </div>
          
          {/* Pulse animation for current milestone */}
          {index === 0 && (
            <div className="absolute inset-0 animate-ping rounded-full bg-blue opacity-20"></div>
          )}
        </div>
      </div>

      {/* Mobile timeline (left side) */}
      <div className="absolute left-0 top-0 flex h-full flex-col items-center lg:hidden">
        {/* Connecting line */}
        <div
          className={cn(
            "absolute left-1/2 top-0 w-0.5 -translate-x-1/2 bg-blue transition-all duration-1000 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            height: index === milestones.length - 1 ? "50%" : "100%",
            transitionDelay: `${index * 150 + 200}ms`,
          }}
        />

        {/* Node circle */}
        <div
          className={cn(
            "relative z-10 mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue bg-white shadow-lg transition-all duration-700 ease-out",
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
          style={{ transitionDelay: `${index * 150 + 400}ms` }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-white">
            {milestone.icon}
          </div>
          
          {/* Pulse animation for current milestone */}
          {index === 0 && (
            <div className="absolute inset-0 animate-ping rounded-full bg-blue opacity-20"></div>
          )}
        </div>
      </div>

      {/* Right side placeholder (desktop) */}
      <div className={cn("hidden lg:block", !isLeft && "lg:order-1")} />
    </div>
  )
}

export function RoadmapSection() {
  return (
    <Section id="roadmap">
      <ScrollReveal>
        <SectionLabel>Traction & Roadmap</SectionLabel>
        <SectionHeading>{"We're"} Not Planning. {"We're"} Moving.</SectionHeading>
        <SectionBody className="mt-4">
          Build, validate, deploy. In that order. Institutional proof first,
          then scale. Every milestone has a date, a target, and a reason it
          matters.
        </SectionBody>
      </ScrollReveal>

      {/* Vertical Timeline */}
      <div className="relative mt-16 pl-16 lg:pl-0">
        <div className="space-y-12 lg:space-y-16">
          {milestones.map((milestone, index) => (
            <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}
