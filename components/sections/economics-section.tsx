"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { EconomicsKpiDashboard } from "@/components/sections/economics-kpi-dashboard"

export function EconomicsSection() {
  return (
    <Section id="economics" alternate>
      <ScrollReveal>
        <SectionLabel>Unit Economics</SectionLabel>
        <SectionHeading>Margin Is Not Profit. {"It's"} Fuel.</SectionHeading>
        <SectionBody className="mt-4">
          At an initial production run of 1,000 units, the full hardware build (dual
          IR eye-tracking cameras, IMU, PPG sensor, custom PCB, battery, frame, assembly,
          and packaging) lands at approximately $220-240 per unit. At $599 retail, CONQ
          maintains 60-63% gross margins. In early rollouts, this margin is immediately
          reinvested into R&D, clinical validation, and manufacturing optimization.
        </SectionBody>
      </ScrollReveal>

      <EconomicsKpiDashboard />
    </Section>
  )
}
