import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { getServices, getPortfolioProjects, getSettings } from "@/lib/cms/store";


export default async function HomePage() {
  const [services, allProjects, settings] = await Promise.all([
    getServices(true),
    getPortfolioProjects({ onlyPublished: true }),
    getSettings(),
  ]);

  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3);

  const processSteps = [
    {
      step: "01",
      title: "Discover",
      desc: "We diagnose unit economics, customer whitespace, and competitive positioning to eliminate unvalidated assumptions.",
    },
    {
      step: "02",
      title: "Build",
      desc: "We engineer bespoke brand architectures, high-performance web systems, and conversion-tested messaging.",
    },
    {
      step: "03",
      title: "Launch",
      desc: "We coordinate timed go-to-market choreography that aligns press, communities, and high-intent acquisition channels.",
    },
    {
      step: "04",
      title: "Grow",
      desc: "We compound customer acquisition and optimize lifetime retention through disciplined quantitative sprints.",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-36 pb-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D8D2C6] bg-white/70 text-xs font-mono tracking-widest uppercase text-[#555555]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
              Creative &amp; Growth Partner
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#171717] tracking-tight leading-[0.98]">
              From Idea <br />
              <span className="italic font-normal">to Impact.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] max-w-2xl leading-relaxed">
              We partner with visionary founders and leadership teams to build enduring brand identities, high-converting digital flagships, and disciplined customer acquisition engines.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="default" size="lg">
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                <span>Explore Our Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Credibility Rail */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#D8D2C6] pt-8 lg:pt-0 lg:pl-8 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                Selected Philosophy
              </span>
              <p className="text-sm text-[#171717] mt-2 font-medium leading-relaxed">
                No bloated decks. No vanity impressions. We execute with speed, precision, and commercial accountability.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#777777]">
                <ShieldCheck className="w-4 h-4 text-[#171717]" />
                Client Guarantee
              </div>
              <p className="text-xs text-[#666666] leading-normal">
                Strict confidentiality, dedicated senior partners on every account, and zero public price markups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ICON-LED SERVICE OVERVIEW (Section 4 & 5.1: Luxury editorial card architecture) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#171717] pt-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              01 / Core Practice Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
              Integrated Capabilities
            </h2>
            <p className="text-sm text-[#555555] max-w-xl leading-relaxed">
              Strategic advisory, visual systems, and performance architectures engineered to take ventures from early traction to market authority.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E5E0D8] hover:border-[#171717] text-xs font-mono uppercase tracking-wider font-bold text-[#171717] hover:bg-[#171717] hover:text-[#F5F1E9] transition-all shadow-xs"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Premium Editorial Cards with Generous Whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.slice(0, 6).map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group rounded-2xl bg-white border border-[#E5E0D8] p-8 sm:p-9 flex flex-col justify-between hover:border-[#171717] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 shadow-xs"
            >
              <div className="space-y-6">
                {/* Card Header: Icon container & Number index */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-white group-hover:border-[#171717] transition-all duration-300">
                    <ServiceIcon name={service.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#888888] font-bold tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                {/* Title & Benefit */}
                <div className="space-y-2.5">
                  <h3 className="font-serif text-2xl font-bold text-[#171717] tracking-tight leading-snug group-hover:text-black transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#555555] leading-relaxed line-clamp-3">
                    {service.shortBenefit}
                  </p>
                </div>

                {/* Key Deliverables Pills Preview */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-4 border-t border-[#F2ECE1] flex flex-wrap gap-1.5">
                    {service.deliverables.slice(0, 2).map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#666666] border border-[#E5E0D8]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Clean interactive CTA button */}
              <div className="pt-6 mt-6 border-t border-[#F2ECE1] flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#171717] font-bold tracking-wider group-hover:underline underline-offset-4">
                  Explore Offering
                </span>

                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-white group-hover:border-[#171717] group-hover:translate-x-1 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SELECTED WORK (Large editorial thumbnails + category labels) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#171717] pt-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              02 / Featured Proof
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] mt-2">
              Selected Case Studies
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#171717] hover:underline underline-offset-4 font-medium"
          >
            <span>Browse All Work ({allProjects.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Alternating Editorial Showcase */}
        <div className="space-y-16">
          {displayProjects.map((project, idx) => (
            <article
              key={project.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                idx % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`lg:col-span-7 overflow-hidden rounded-xl bg-[#E5E0D8] border border-[#D8D2C6] ${
                  idx % 2 === 1 ? "lg:col-start-6" : ""
                }`}
              >
                <Link href={`/work/${project.slug}`} className="group block overflow-hidden">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                </Link>
              </div>

              <div
                className={`lg:col-span-5 space-y-6 ${
                  idx % 2 === 1 ? "lg:col-start-1" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {project.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white border border-[#D8D2C6] text-[#555555]"
                    >
                      {cat}
                    </span>
                  ))}
                  <span className="text-xs font-mono text-[#777777]">• {project.client}</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] leading-tight">
                  <Link
                    href={`/work/${project.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-[#555555] leading-relaxed">
                  {project.outcome}
                </p>

                {/* Approved Metrics Grid */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#E5E0D8]">
                    {project.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-serif text-2xl font-bold text-[#171717]">
                          {m.value}
                        </div>
                        <div className="text-[11px] font-mono text-[#777777] uppercase tracking-wider">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-mono uppercase font-bold text-[#171717] hover:underline underline-offset-4"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. PROCESS: Discover -> Build -> Launch -> Grow */}
      <section className="bg-[#171717] text-[#F5F1E9] py-20 my-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-[#2C2C2C] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                03 / Working Method
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-2">
                The Four-Step Engine
              </h2>
            </div>
            <p className="text-sm text-[#A3A3A3] max-w-md">
              A sequenced framework designed to move high-impact ideas from validation to compounding market scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.step} className="space-y-4 pt-4 border-t border-[#333333]">
                <span className="text-xs font-mono text-[#777777] block">
                  Phase {step.step}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF & TRUSTPILOT (Official widget profile link, no fabricated ratings) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                Authentic Verification
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
                Proven Client Satisfaction
              </h2>
              <p className="text-sm text-[#555555]">
                We pride ourselves on direct, transparent collaboration. Read unedited reviews on our official Trustpilot profile.
              </p>
            </div>

            <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[#00B67A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 font-serif font-bold text-lg text-[#171717]">
                    {settings.trustpilotScore} / 5.0
                  </span>
                </div>
                <div className="text-xs font-mono text-[#666666]">
                  Based on {settings.trustpilotReviewCount} verified founder &amp; enterprise evaluations
                </div>
              </div>

              <a
                href={settings.trustpilotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition-colors"
              >
                <span>Read Official Reviews</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLOSING CTA: Consultation Prompt + Book a Consultation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 rounded-3xl bg-[#171717] text-[#F5F1E9] text-center space-y-8 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
              Next Step
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Ready to take your brand from idea to market impact?
            </h2>
            <p className="text-base sm:text-lg text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
              Book a private 30-minute consultation with a senior partner. We review your goals and provide immediate strategic direction.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/book" variant="default" size="lg" className="bg-white text-[#171717] hover:bg-[#E5E0D8]">
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="border-[#444444] text-white hover:bg-[#2A2A2A]">
              <span>Submit Project Inquiry</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs font-mono text-[#777777]">
            Never public pricing • Confidential NDA on request • Fast 24h response
          </p>
        </div>
      </section>
    </div>
  );
}
