"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-background"
    >
      {/* CONQ mark watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/conq-logo-clean.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-5%] top-[10%] h-auto w-[45%] max-w-[500px] select-none opacity-[0.035]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 60]) }}
      />

      {/* Rotating rings */}
      <motion.div
        className="pointer-events-none absolute left-[55%] top-[15%] h-[400px] w-[400px] rounded-full border border-navy/[0.04] md:h-[600px] md:w-[600px]"
        style={{ rotate: ringRotate }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute left-[58%] top-[18%] h-[300px] w-[300px] rounded-full border border-blue/[0.06] md:h-[500px] md:w-[500px]"
        style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, -45]) }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32 lg:py-40"
        style={{ y: textY, opacity }}
      >
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">
          {/* Left — copy */}
          <div className="max-w-2xl lg:flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400"
            >
              Presidents Challenge 2026
            </motion.p>

            <motion.h1
              className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-navy md:text-6xl lg:text-7xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                See the Invisible.
              </motion.span>
              <motion.span
                className="block text-blue"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                Move Sooner.
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Recover Better.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-8 max-w-lg text-lg leading-relaxed text-slate-500"
            >
              Three concussions. Three stories. One shared frustration: a system
              built to treat visible injuries {"can't"} answer the questions it cannot see.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="mt-4 max-w-lg text-lg leading-relaxed text-slate-500"
            >
              CONQ is smart glasses that give athletes and clinicians a real-time
              window into neurological strain and recovery.
            </motion.p>

            <motion.a
              href="#problem"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="mt-16 inline-flex items-center gap-3 text-sm font-medium text-navy/60 transition-colors hover:text-blue"
              aria-label="Scroll to learn more"
            >
              Scroll to explore
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-4 w-4" />
              </motion.span>
            </motion.a>
          </div>

          {/* Right — story photo collage */}
          <motion.div
            className="relative hidden w-full max-w-sm shrink-0 lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Ibby — concussion moment */}
              <div className="col-span-2 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/story/ibby-concussion.jpg"
                  alt="Ibby after concussion"
                  className="h-56 w-full object-cover object-top"
                />
              </div>
              {/* Jason — promposal */}
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/story/jason-promposal.jpg"
                  alt="Jason's concussion promposal"
                  className="h-48 w-full object-cover object-center"
                />
              </div>
              {/* Ethan — video poster frame */}
              <div className="relative overflow-hidden rounded-2xl bg-navy">
                <video
                  src="/story/ethan-concussion.mp4"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="h-48 w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    Ethan, game day
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Real moments. Real concussions. This is why we build.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
