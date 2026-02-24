import { Navbar } from "@/components/navbar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SectionIndicator } from "@/components/section-indicator"
import { HeroSection } from "@/components/sections/hero-section"
import { ProblemSection } from "@/components/sections/problem-section"
import { SolutionSection } from "@/components/sections/solution-section"
import { AppShowcaseSection } from "@/components/sections/app-showcase-section"
import { CompetitiveSection } from "@/components/sections/competitive-section"
import { MarketSection } from "@/components/sections/market-section"
import { GtmSection } from "@/components/sections/gtm-section"
import { EconomicsSection } from "@/components/sections/economics-section"
import { TeamSection } from "@/components/sections/team-section"
import { WhyNowSection } from "@/components/sections/why-now-section"
import { RoadmapSection } from "@/components/sections/roadmap-section"
import { ClosingSection } from "@/components/sections/closing-section"
import { Footer } from "@/components/footer"
import { QuoteBreaker, Divider } from "@/components/interstitials"

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />

      <ProblemSection />
      <WhyNowSection />

      <QuoteBreaker
        quote="What if you could see the invisible?"
        dark
      />

      <SolutionSection />
      <AppShowcaseSection />

      <Divider label="Landscape" />

      <CompetitiveSection />

      <QuoteBreaker
        quote="Rowan's Law is creating regulatory demand that no consumer product currently meets."
      />

      <MarketSection />

      <Divider label="Strategy" />

      {/* Cinematic hockey banner */}
      <div className="relative overflow-hidden bg-[#0F172A]">
        {/* Background video */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src="/hockey-film.mp4"
          muted
          playsInline
          loop
          autoPlay
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/60 via-transparent to-[#0F172A]/80" />
        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/ohl.svg"
            alt="Ontario Hockey League"
            className="mb-6 h-12 w-auto opacity-70"
          />
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Hockey hits hardest.<br />
            <span className="text-slate-400">{"That's"} why we start here.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400">
            5.05 concussions per 100 player-games. Concentrated teams.
            Institutional buyers. The OHL is the proving ground.
          </p>
          {/* Pilot team logos */}
          <div className="mt-8 flex items-center gap-8">
            {[
              { src: "/logos/windsor-spitfires.png", alt: "Windsor Spitfires" },
              { src: "/logos/london-knights.png", alt: "London Knights" },
              { src: "/logos/oshawa-generals.png", alt: "Oshawa Generals" },
            ].map((team) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={team.alt}
                src={team.src}
                alt={team.alt}
                className="h-10 w-auto opacity-60 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
        </div>
      </div>

      <GtmSection />
      <EconomicsSection />

      <QuoteBreaker
        quote="Many ventures in this space fail because they start too broad, overengineer early, and build products too expensive for everyday consumers. We do the opposite."
        dark
      />

      <TeamSection />
      <RoadmapSection />
      <ClosingSection />
      <Footer />
      <ScrollToTop />
      <SectionIndicator />
    </main>
  )
}
