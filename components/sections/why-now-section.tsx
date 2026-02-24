"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const FORCES = [
  {
    num: "01",
    tag: "The Science",
    anchor: "Amsterdam Consensus 2023",
    body: "Defined the clinical need for continuous, objective neurological monitoring, shifting the standard from 'lights off and rest' to evidence-based active recovery.",
    accent: "#3B82F6",
  },
  {
    num: "02",
    tag: "The Technology",
    anchor: "Portable Sensing at Scale",
    body: "Miniaturized eye-tracking, inertial measurement, and PPG sensors now capture multi-modal neurological signals continuously, in everyday environments, affordably.",
    accent: "#2563EB",
  },
  {
    num: "03",
    tag: "The Legislation",
    anchor: "Rowan\u2019s Law",
    body: "Ontario\u2019s concussion safety legislation mandates protocols for amateur sport. The regulatory pressure is real, and no consumer product currently meets it.",
    accent: "#0F172A",
  },
]

function ForceBlock({
  force,
  index,
}: {
  force: (typeof FORCES)[number]
  index: number
}) {
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
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative grid items-start gap-6 md:grid-cols-[80px_1fr] md:gap-8">
      {/* Large number */}
      <motion.span
        className="hidden text-7xl font-bold leading-none tracking-tighter md:block"
        style={{ color: force.accent }}
        initial={{ opacity: 0, x: -20 }}
        animate={visible ? { opacity: 0.15, x: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {force.num}
      </motion.span>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          {force.tag}
        </p>
        <h3
          className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ color: force.accent }}
        >
          {force.anchor}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 md:text-base">
          {force.body}
        </p>
      </motion.div>
    </div>
  )
}

function ConvergenceLine() {
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
    <div ref={ref} className="flex justify-center py-2 md:justify-start md:pl-[40px]">
      <svg width="2" height="48" viewBox="0 0 2 48" className="overflow-visible">
        <motion.line
          x1="1" y1="0" x2="1" y2="48"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={visible ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

export function WhyNowSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const conclusionRef = useRef<HTMLDivElement>(null)
  const [conclusionVisible, setConclusionVisible] = useState(false)

  useEffect(() => {
    const el = conclusionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setConclusionVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-now"
      className="relative overflow-hidden bg-slate-light py-24 md:py-32"
    >
      {/* Oversized background text */}
      <motion.span
        className="pointer-events-none absolute -right-8 top-12 select-none text-[10rem] font-bold leading-none tracking-tighter text-navy/[0.02] md:text-[18rem]"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        NOW
      </motion.span>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-blue">
            Why Now
          </span>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-navy md:text-4xl lg:text-[2.75rem]">
            Three forces.{" "}
            <span className="text-blue">One window.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
            This moment {"isn\u2019t"} an accident. The science, the technology,
            and the legislation have converged, creating an opportunity that
            {"didn\u2019t"} exist even two years ago.
          </p>
        </div>

        {/* Force blocks with connecting lines */}
        <div className="flex flex-col">
          {FORCES.map((force, i) => (
            <div key={force.num}>
              <ForceBlock force={force} index={i} />
              {i < FORCES.length - 1 && <ConvergenceLine />}
            </div>
          ))}
        </div>

        {/* Convergence conclusion */}
        <div ref={conclusionRef} className="mt-16 md:mt-20">
          <motion.div
            className="relative rounded-2xl bg-navy px-8 py-10 md:px-12 md:py-14"
            initial={{ opacity: 0, y: 30 }}
            animate={conclusionVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Three converging accent dots */}
            <div className="mb-6 flex items-center gap-2">
              {["#3B82F6", "#2563EB", "#0F172A"].map((c, i) => (
                <motion.div
                  key={c}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c === "#0F172A" ? "#94A3B8" : c }}
                  initial={{ scale: 0 }}
                  animate={conclusionVisible ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: "backOut" }}
                />
              ))}
              <motion.div
                className="ml-1 h-px flex-1 bg-gradient-to-r from-blue/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={conclusionVisible ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            <motion.p
              className="text-xl font-medium leading-snug text-white md:text-2xl lg:text-3xl"
              initial={{ opacity: 0 }}
              animate={conclusionVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              AI has lowered the barrier.{" "}
              <span className="text-slate-400">
                What once required institutional infrastructure can now be built
                by focused technical teams.
              </span>
            </motion.p>

            <motion.p
              className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue"
              initial={{ opacity: 0 }}
              animate={conclusionVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              That moment is now.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
