"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

const SECTIONS = [
  { id: "hero", label: "01 · Intro" },
  { id: "problem", label: "02 · Problem" },
  { id: "why-now", label: "03 · Why Now" },
  { id: "solution", label: "04 · Solution" },
  { id: "market", label: "05 · Market" },
  { id: "strategy", label: "06 · Strategy" },
  { id: "economics", label: "07 · Economics" },
  { id: "team", label: "08 · Team" },
  { id: "roadmap", label: "09 · Roadmap" },
  { id: "closing", label: "10 · Close" },
]

export function SectionIndicator() {
  const [current, setCurrent] = useState("")
  const [scrolled, setScrolled] = useState(false)

  const detect = useCallback(() => {
    setScrolled(window.scrollY > window.innerHeight * 0.5)
    const scrollPos = window.scrollY + window.innerHeight / 3

    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTIONS[i].id)
      if (el && el.offsetTop <= scrollPos) {
        setCurrent(SECTIONS[i].label)
        return
      }
    }
    setCurrent("")
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", detect, { passive: true })
    detect()
    return () => window.removeEventListener("scroll", detect)
  }, [detect])

  return (
    <AnimatePresence>
      {scrolled && current && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
        >
          <span className="block origin-center -rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-300">
            {current}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
