import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "Explore LaunchCraft's core service offerings: Business Counseling, Startup Support, Branding Services, Marketing Strategy, Product Launch Consulting, and Website Setup.",
};


export default async function ServicesPage() {
  const services = await getServices(true);

  const specializedCapabilities = [
    {
      title: "Technical Search Engine Optimization (SEO)",
      description: "Semantic HTML architecture, JSON-LD schema integration, and high-intent programmatic content hubs that capture qualified buyer queries.",
    },
    {
      title: "Editorial Content Systems",
      description: "Authoritative whitepapers, founder perspectives, and brand manifestos that elevate thought leadership without generic AI filler.",
    },
    {
      title: "Social Architecture & Community",
      description: "Disciplined multi-platform publishing strategies and executive social presence that build organic recall and high-value partnerships.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
      {/* Header */}
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Capabilities &amp; Practice Areas
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight">
          Strategic Services Built for Market Authority
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-3xl mt-4 leading-relaxed">
          LaunchCraft delivers full-lifecycle brand and growth engineering. We partner with founders and enterprises to eliminate friction between great ideas and sustainable revenue.
        </p>
      </div>

      {/* Core Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#171717]">
            Core Service Taxonomy
          </h2>
          <span className="text-xs font-mono text-[#777777]">
            6 Primary Disciplines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="editorial-card rounded-2xl p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[#777777]">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#171717]">
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono">0{index + 1}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#171717]">
                  {service.title}
                </h3>

                <p className="text-sm text-[#555555] leading-relaxed">
                  {service.shortBenefit}
                </p>

                <div className="pt-2 border-t border-[#E5E0D8] space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#333333]">
                    {service.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#171717] flex-shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#171717] hover:underline underline-offset-4"
                >
                  <span>Full Service Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/contact?service=${service.slug}`}
                  className="text-xs font-mono text-[#777777] hover:text-[#171717] underline underline-offset-2"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Cross-Functional Offerings */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Cross-Disciplinary
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Specialized Practice Offerings
          </h2>
          <p className="text-sm text-[#555555] mt-2">
            Integrated capabilities deployed alongside our core strategic service engagements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specializedCapabilities.map((cap) => (
            <div key={cap.title} className="p-6 rounded-xl bg-white border border-[#E5E0D8] space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#171717]">
                {cap.title}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#171717] text-[#F5F1E9] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Unsure which capability best fits your milestone?
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-xl">
            Book a complimentary 30-minute discovery consultation. We review your goals and suggest an optimal engagement structure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button href="/book" variant="default" size="default" className="bg-white text-[#171717] hover:bg-[#E5E0D8]">
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/contact" variant="outline" size="default" className="border-[#444444] text-white hover:bg-[#2A2A2A]">
            <span>Request a Quote</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
