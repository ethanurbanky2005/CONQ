"use client"

import { useRef, useState, useEffect } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"
import { TrendingUp, Users, DollarSign, Percent, ShoppingCart, Building2 } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const B2C_KPIS = [
  {
    icon: DollarSign,
    label: "Modeled Retail Price",
    value: "$599",
    sub: "Assumption",
    color: "#3B82F6",
  },
  {
    icon: Percent,
    label: "Hardware Gross Margin",
    value: "50–63%",
    sub: "Benchmark-derived",
    color: "#2563EB",
  },
  {
    icon: TrendingUp,
    label: "Subscription (post-onboard)",
    value: "$9.99–14.99/mo",
    sub: "Assumption",
    color: "#0F172A",
  },
  {
    icon: ShoppingCart,
    label: "DTC CAC Planning Range",
    value: "$90–150",
    sub: "Conservative",
    color: "#3B82F6",
  },
]

const B2B_KPIS = [
  {
    icon: Building2,
    label: "Pilot Contract / Team-Season",
    value: "$12K–20K",
    sub: "Assumption (~25–30 athletes)",
    color: "#3B82F6",
  },
  {
    icon: Users,
    label: "Per Athlete / Year",
    value: "$400–800",
    sub: "Assumption",
    color: "#2563EB",
  },
  {
    icon: Percent,
    label: "Blended Gross Margin",
    value: "45–60%",
    sub: "At scale",
    color: "#0F172A",
  },
  {
    icon: TrendingUp,
    label: "Hardware COGS Baseline",
    value: "$220–300",
    sub: "Low-volume estimate",
    color: "#3B82F6",
  },
]

/* ------------------------------------------------------------------ */
/*  Sources                                                            */
/* ------------------------------------------------------------------ */

const B2C_SOURCES = [
  {
    num: 1,
    text: "Oura membership: $5.99/mo or $69.99/yr",
    href: "https://support.ouraring.com/hc/en-us/articles/4409086524819-Oura-Membership",
  },
  {
    num: 2,
    text: "WHOOP annual tiers: $199, $239, $359",
    href: "https://www.whoop.com/us/en/membership/",
  },
  {
    num: 3,
    text: "Ray-Ban Meta COGS ~$135 at $299 retail (Counterpoint Research)",
    href: "https://www.counterpointresearch.com/insight/ray-ban-meta-smart-glasses-hidden-value-beneath-the-surface/",
  },
  {
    num: 4,
    text: "Apple Vision Pro COGS ~$1,542 vs $3,499 retail (Omdia via CNBC)",
    href: "https://www.cnbc.com/2024/02/24/apple-vision-pro-3499-price-tag-doesnt-mean-huge-profits-analysts-say.html",
  },
  {
    num: 5,
    text: "Shopify: ecommerce CAC benchmarks $87–$129 (retail/fashion)",
    href: "https://www.shopify.com/enterprise/blog/customer-acquisition-cost",
  },
  {
    num: 6,
    text: "HubSpot: common ecommerce CAC range $50–$150",
    href: "https://blog.hubspot.com/service/customer-acquisition-cost",
  },
]

const B2B_SOURCES = [
  {
    num: 1,
    text: "WHOOP membership: $199–$359/yr (anchor for institutional willingness-to-pay)",
    href: "https://www.whoop.com/us/en/membership/",
  },
  {
    num: 2,
    text: "Oura: $69.99/yr; Apple Fitness+: $79.99/yr",
    href: "https://www.apple.com/apple-fitness-plus/",
  },
]

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */

function KpiCard({
  item,
  index,
  visible,
}: {
  item: (typeof B2C_KPIS)[number]
  index: number
  visible: boolean
}) {
  const Icon = item.icon
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${index * 80}ms`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: item.color }}
      />

      <div className="flex items-start gap-3 pl-1">
        {/* Icon */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${item.color}12`, color: item.color }}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {item.label}
          </p>
          <p
            className="mt-1 text-xl font-semibold tabular-nums leading-none"
            style={{ color: item.color }}
          >
            {item.value}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{item.sub}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Model Card                                                         */
/* ------------------------------------------------------------------ */

function ModelCard({
  title,
  description,
  kpis,
  sources,
  accentColor,
  delay,
}: {
  title: string
  description: string
  kpis: typeof B2C_KPIS
  sources: typeof B2C_SOURCES
  accentColor: string
  delay: number
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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 md:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h3 className="text-lg font-semibold tracking-tight text-navy md:text-xl">
          {title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-slate-500">{description}</p>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} item={kpi} index={i} visible={visible} />
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Sources footnotes */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Benchmark Sources
        </p>
        {sources.map((s) => (
          <div key={s.num} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
            <span
              className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {s.num}
            </span>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-navy hover:underline"
            >
              {s.text}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function EconomicsSection() {
  return (
    <Section id="economics" alternate>
      <ScrollReveal>
        <SectionLabel>Unit Economics</SectionLabel>
        <SectionHeading>Benchmarks First. Assumptions Explicit.</SectionHeading>
        <SectionBody className="mt-4">
          All figures below use public benchmarks from comparable consumer wearables,
          hardware teardowns, and DTC ecommerce data. Internal CONQ numbers are
          clearly labeled as assumptions. No fabricated internal metrics.
        </SectionBody>
      </ScrollReveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ScrollReveal>
          <ModelCard
            title="B2C Model"
            description="Direct-to-consumer — athletes and everyday users purchasing hardware and subscribing for continuous monitoring."
            kpis={B2C_KPIS}
            sources={B2C_SOURCES}
            accentColor="#3B82F6"
            delay={0}
          />
        </ScrollReveal>

        <ScrollReveal>
          <ModelCard
            title="B2B Model"
            description="Institutional — team or league licensing covering hardware deployment, software access, and clinical support for a full season."
            kpis={B2B_KPIS}
            sources={B2B_SOURCES}
            accentColor="#2563EB"
            delay={80}
          />
        </ScrollReveal>
      </div>

      {/* Shared assumption callout */}
      <ScrollReveal className="mt-6">
        <div className="rounded-xl bg-[#0F172A] px-6 py-5 md:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">
                Shared Hardware Assumption
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                COGS modeled at{" "}
                <span className="text-blue">$220–$300 landed per unit</span>
                {" "}— reflecting low-volume manufacturing and multi-sensor integration.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Anchored to Ray-Ban Meta ($135 at $299 retail)
              {" "}and Apple Vision Pro ($1,542 at $3,499 retail) component-cost benchmarks.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  )
}
