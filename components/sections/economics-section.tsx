"use client"

import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Section,
  SectionLabel,
  SectionHeading,
  SectionBody,
} from "@/components/section"

export function EconomicsSection() {
  return (
    <Section id="economics" alternate>
      <ScrollReveal>
        <SectionLabel>Unit Economics</SectionLabel>
        <SectionHeading>Benchmarks First. Assumptions Explicit.</SectionHeading>
        <SectionBody className="mt-4">
          The model below avoids internal performance claims and uses public benchmarks
          plus clearly labeled assumptions to frame early-stage economics.
        </SectionBody>
      </ScrollReveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h3 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">
              A) B2C Model
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                Subscription benchmarks: Oura membership is
                {" "}
                <a
                  href="https://support.ouraring.com/hc/en-us/articles/4409086524819-Oura-Membership"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $5.99/month or $69.99/year
                </a>
                ; WHOOP annual tiers are
                {" "}
                <a
                  href="https://www.whoop.com/us/en/membership/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $199, $239, and $359
                </a>
                ; Apple Fitness+ is
                {" "}
                <a
                  href="https://www.apple.com/apple-fitness-plus/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $9.99/month or $79.99/year
                </a>
                .
              </li>
              <li>
                Assumption: CONQ app monetization is modeled at $9.99-$14.99/month
                after onboarding.
              </li>
              <li>
                Hardware benchmark: Counterpoint estimates Ray-Ban Meta production
                cost near
                {" "}
                <a
                  href="https://www.counterpointresearch.com/insight/ray-ban-meta-smart-glasses-hidden-value-beneath-the-surface/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $135 at a $299 retail price
                </a>
                . Omdia estimates Apple Vision Pro component cost at
                {" "}
                <a
                  href="https://www.cnbc.com/2024/02/24/apple-vision-pro-3499-price-tag-doesnt-mean-huge-profits-analysts-say.html"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $1,542 versus a $3,499 retail price
                </a>
                .
              </li>
              <li>
                Assumption: early CONQ landed hardware COGS is modeled at $220-$300
                per unit to reflect low-volume manufacturing and sensor integration.
              </li>
              <li>
                Assumption: at a modeled $599 retail price, hardware gross margin
                ranges about 50%-63%.
              </li>
              <li>
                DTC CAC benchmark: Shopify reports ecommerce CAC benchmarks around
                {" "}
                <a
                  href="https://www.shopify.com/enterprise/blog/customer-acquisition-cost"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $87 (retail) and $129 (fashion)
                </a>
                ; HubSpot cites a common ecommerce CAC range of
                {" "}
                <a
                  href="https://blog.hubspot.com/service/customer-acquisition-cost"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $50-$150
                </a>
                .
              </li>
              <li>
                Assumption: conservative CONQ DTC CAC planning range is $90-$150.
              </li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h3 className="text-xl font-semibold tracking-tight text-navy md:text-2xl">
              B) B2B Model
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                Assumption: pilot contracts are modeled at $12,000-$20,000 per
                team-season (roughly 25-30 athletes), equivalent to about $400-$800
                per athlete-year.
              </li>
              <li>
                Benchmark anchor: consumer annual health-subscription spend already
                supports
                {" "}
                <a
                  href="https://www.whoop.com/us/en/membership/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $199-$359 (WHOOP tiers)
                </a>
                ,
                {" "}
                <a
                  href="https://support.ouraring.com/hc/en-us/articles/4409086524819-Oura-Membership"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $69.99/year (Oura)
                </a>
                , and
                {" "}
                <a
                  href="https://www.apple.com/apple-fitness-plus/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue hover:underline"
                >
                  $79.99/year (Apple Fitness+)
                </a>
                .
              </li>
              <li>
                Assumption: COGS uses the same $220-$300 landed hardware band plus
                deployment, support, and software servicing layers.
              </li>
              <li>
                Assumption: blended gross margin is modeled in a 45%-60% band once
                deployment workflows are standardized.
              </li>
              <li>
                Assumption: concentrated institutional buyers reduce acquisition cost
                per athlete versus pure DTC, with renewals becoming the primary
                margin driver.
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  )
}
