"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  })
  const textY = useTransform(scrollYProgress, [0, 0.6, 1], [80, 0, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="closing"
      className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-navy px-6 py-28 md:px-8"
    >
      {/* Large background watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/conq-logo-clean.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[60%] max-w-[450px] -translate-x-1/2 -translate-y-1/2 select-none brightness-0 invert opacity-[0.04]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [40, -20]) }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        style={{ y: textY, opacity }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/conq-logo-clean.png"
          alt="CONQ"
          className="mx-auto mb-10 h-20 w-auto brightness-0 invert opacity-50"
        />

        <p className="text-sm uppercase tracking-[0.25em] text-blue-light/50">
          Ethan &middot; Ibby &middot; Jason
        </p>

        <h2 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          See the invisible.
          <br />
          <span className="text-blue">Move sooner.</span>
          <br />
          Recover better.
        </h2>

        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-slate-500">
          The science, the technology, and the legislation have all arrived
          at the same moment.
        </p>

        <div className="mt-12">
          <a
            href="#hero"
            className="inline-flex items-center rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            Back to Top
          </a>
        </div>

        <p className="mt-16 text-[11px] tracking-wider text-slate-600 uppercase">
          Presidents Challenge 2026 · University of Western Ontario
        </p>
      </motion.div>
    </section>
  )
}
