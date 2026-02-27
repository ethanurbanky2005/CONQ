"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"

const DAY_TO_DAY_ITEMS = [
  "Improve focus during work or study",
  "Detect stress before it affects performance",
  "Optimize mental clarity before high-stakes moments",
  "Understand how sleep, travel, and workload impact your brain",
  "Adjust your day based on real cognitive readiness",
  "Build long-term neurological resilience",
  "Prevent burnout before it happens",
  "Make smarter decisions with objective insight",
]

export function DayToDaySection() {
  return (
    <>
      <Section id="day-to-day">
        <ScrollReveal>
          <SectionLabel>Daily Utility</SectionLabel>
          <SectionHeading>Day-to-Day with CONQ</SectionHeading>
          <SectionBody className="mt-4">
            Not concussed?? CONQ still helps you understand and manage daily neurological load.
          </SectionBody>
        </ScrollReveal>

        <ScrollReveal className="mt-10">
          <ul className="grid list-disc gap-3 pl-5 md:grid-cols-2">
            {DAY_TO_DAY_ITEMS.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </Section>

      <Section id="conq-flow" alternate>
        <ScrollReveal>
          <SectionLabel>Consumer Side Product</SectionLabel>
          <SectionHeading>CONQ Flow</SectionHeading>
          <SectionBody className="mt-4">
            CONQ Flow is a side product built for everyday consumers who want steadier focus,
            stress awareness, and better day-to-day cognitive routines. It is positioned
            separately from the core CONQ glasses system, which remains focused on
            neurological strain monitoring and recovery workflows. Flow is designed for
            regular life contexts like workdays, studying, travel, and high-pressure moments.
            It helps users notice patterns earlier and adjust behavior before overload builds.
            The goal is practical daily guidance that supports long-term brain wellness.
          </SectionBody>
        </ScrollReveal>
        <ScrollReveal className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
        </ScrollReveal>
      </Section>
    </>
  )
}
