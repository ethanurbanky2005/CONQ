"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Why Now", href: "#why-now" },
  { label: "Solution", href: "#solution" },
  { label: "Market", href: "#market" },
  { label: "Strategy", href: "#strategy" },
  { label: "Economics", href: "#economics" },
  { label: "Team", href: "#team" },
  { label: "Roadmap", href: "#roadmap" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSectionDetection = useCallback(() => {
    const sections = NAV_LINKS.map((link) => {
      const id = link.href.replace("#", "")
      const el = document.getElementById(id)
      return { id, el }
    })

    const scrollPos = window.scrollY + window.innerHeight / 3

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      if (section.el && section.el.offsetTop <= scrollPos) {
        setActiveSection(section.id)
        return
      }
    }
    setActiveSection("")
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleSectionDetection, { passive: true })
    handleSectionDetection()
    return () => window.removeEventListener("scroll", handleSectionDetection)
  }, [handleSectionDetection])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/55 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] origin-left bg-gradient-to-r from-blue to-blue-light"
        style={{
          scaleX,
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/conq-logo-clean.png"
            alt="CONQ logo"
            className="h-8 w-auto"
          />
          <span className="text-xl font-semibold tracking-tight text-navy">
            CONQ
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "")
            const isActive = activeSection === sectionId
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue"
                      : "text-slate-500 hover:text-navy"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 -z-10 rounded-full bg-blue/8"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-md p-2 text-navy transition-colors hover:bg-slate-light md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t border-slate-200 bg-white/95 px-6 pb-6 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-light hover:text-navy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  )
}
