"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { FadeInOnScroll } from "@/components/parallax"
import { BrainCircuit, Rocket, FlaskConical } from "lucide-react"

const TEAM_MEMBERS = [
  {
    name: "Ethan",
    role: "ML / AI Technical Lead",
    icon: BrainCircuit,
    photo: "/team/ethan.jpg",
    bio: "Deep experience in machine learning and AI modeling, with internship experience in financial technology and a formal background in data science. Leads the development of CONQ's proprietary biometric algorithms and multi-sensor fusion pipeline.",
    expertise: ["Machine Learning", "Data Science", "Sensor Fusion"],
  },
  {
    name: "Ibby",
    role: "Operations & Growth",
    icon: Rocket,
    photo: "/team/ibby.jpg",
    bio: "Experience inside a glasses-based wearable startup focused on enterprise applications. Has also led the design and development of an AI-driven platform integrating behavioral modeling and statistical systems into a live product environment.",
    expertise: ["Wearable Hardware", "Product Strategy", "AI Systems"],
  },
  {
    name: "Jason",
    role: "Clinical & Research Advisor",
    icon: FlaskConical,
    photo: null as string | null,
    bio: "Domain expertise in concussion research through past projects in the space, alongside a strong entrepreneurial background in marketing and media ventures. Contributes protocol knowledge and institutional relationship development.",
    expertise: ["Concussion Research", "Marketing", "Partnerships"],
  },
]

const MILESTONES = [
  { label: "Team", done: true },
  { label: "Prototype", done: true },
  { label: "Pilot Agreements", done: true },
  { label: "Clinical Validation", done: false },
  { label: "Market Entry", done: false },
]

function ValidationStatus() {
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

  const activeIndex = MILESTONES.findIndex((m) => !m.done)

  return (
    <div ref={ref} className="mt-14 rounded-2xl bg-navy p-8 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        {/* Left — label & copy */}
        <div className="shrink-0 md:w-[280px]">
          <motion.p
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            Where we stand
          </motion.p>
          <motion.p
            className="mt-3 text-sm leading-relaxed text-slate-400"
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Actively pursuing structured academic partnerships to
            validate our metrics and build the credibility required for
            institutional adoption.
          </motion.p>
        </div>

        {/* Right — milestone track */}
        <div className="flex-1">
          <div className="flex items-center">
            {MILESTONES.map((m, i) => (
              <div key={m.label} className="flex flex-1 items-center last:flex-none">
                {/* Dot */}
                <motion.div
                  className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    m.done
                      ? "border-blue bg-blue"
                      : i === activeIndex
                        ? "border-blue bg-transparent"
                        : "border-slate-600 bg-transparent"
                  }`}
                  initial={{ scale: 0 }}
                  animate={visible ? { scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4, ease: "backOut" }}
                >
                  {m.done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {i === activeIndex && (
                    <motion.div
                      className="h-2 w-2 rounded-full bg-blue"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>

                {/* Connector line */}
                {i < MILESTONES.length - 1 && (
                  <div className="relative mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-blue"
                      initial={{ scaleX: 0 }}
                      animate={visible && m.done ? { scaleX: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Labels below dots */}
          <div className="mt-3 flex">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.label}
                className="flex-1 last:flex-none"
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
              >
                <p
                  className={`text-[10px] font-medium leading-tight ${
                    m.done
                      ? "text-slate-400"
                      : i === activeIndex
                        ? "text-white"
                        : "text-slate-600"
                  }`}
                >
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TeamSection() {
  return (
    <Section id="team" alternate>
        <ScrollReveal>
          <SectionLabel>Our Team</SectionLabel>
          <SectionHeading>Built by People Who Lived the Problem</SectionHeading>
          <SectionBody className="mt-4">
            We combine multi-sensor hardware integration, AI modeling, and
            concussion-specific protocol knowledge. That alignment allows us to
            move from concept to validated system, because we{"'re"} not just building
            a product, {"we're"} solving something we each experienced firsthand.
          </SectionBody>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TEAM_MEMBERS.map((member, i) => (
            <FadeInOnScroll key={member.name} delay={i * 0.12} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
              <div className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="mb-5 h-20 w-20 rounded-full object-cover object-top ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy to-blue text-2xl font-semibold text-white ring-2 ring-slate-100">
                    {member.name[0]}
                  </div>
                )}

                <h3 className="text-xl font-semibold text-navy">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-blue">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {member.bio}
                </p>

                {/* Expertise tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {member.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>

        {/* Clinical validation — status bar */}
        <ValidationStatus />
      </Section>
  )
}
