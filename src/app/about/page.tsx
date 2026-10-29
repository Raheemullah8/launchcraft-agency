import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CheckCircle2, ShieldCheck, Compass, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Agency & Positioning",
  description:
    "LaunchCraft is a boutique creative & growth agency based in London. We partner with ambitious founders to build enduring brands and scalable acquisition engines.",
};

export default function AboutPage() {
  const leadershipCraft = [
    {
      name: "Marcus Vance",
      role: "Partner & Head of Strategy",
      bio: "Former venture studio partner with 12+ years advising high-growth tech firms on go-to-market architecture, unit economics, and executive positioning.",
      image: "/images/p1.jpg",
    },
    {
      name: "Elena Rostova",
      role: "Creative Director",
      bio: "Editorial brand designer focused on micro-typography, high-recall visual identities, and disciplined digital design systems.",
      image: "/images/p2.jpg",
    },
    {
      name: "Julian Thorne",
      role: "Technical Director",
      bio: "Next.js architect and web performance specialist dedicated to WCAG 2.2 accessibility, zero-runtime bloat, and fast data flows.",
      image: "/images/p3.jpg",
    },
  ];

  const agencyStrengths = [
    {
      title: "Senior Partners on Every Engagement",
      description: "You never get pitched by founders only to be handed down to junior generalists. Every strategy sprint is led and executed by experienced senior craftspeople.",
    },
    {
      title: "Zero Public Pricing Fluff",
      description: "We don't sell off-the-shelf commodity packages or artificial discounts. Every engagement is scoped to your exact business objectives and milestone requirements.",
    },
    {
      title: "Disciplined Editorial Aesthetic",
      description: "We eschew generic template cards and heavy gradients. We prioritize generous negative space, bold condensed typography, and uncluttered utility.",
    },
    {
      title: "Commercially Accountable Outcomes",
      description: "Every brand asset and web system is engineered to convert qualified interest into measurable pipeline, verified retention, and market authority.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
      {/* Header & Positioning */}
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Agency Positioning &amp; Ethos
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight max-w-4xl leading-tight">
          We build what ambitious brands need to lead their markets.
        </h1>
        <p className="text-lg sm:text-xl text-[#555555] max-w-3xl mt-6 leading-relaxed">
          Founded in London, LaunchCraft operates as a specialized creative and growth partner. We combine rigorous business counseling with world-class editorial craft to transform early-stage momentum into compounding commercial impact.
        </p>
      </div>

      {/* Mission & Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Our Mission
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            From Idea to Impact: Eliminating the gap between ambition and market authority.
          </h2>
          <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
            Too many brilliant products stay unnoticed because of mediocre brand perception or disjointed digital platforms. We reject surface-level decoration in favor of high-conviction identity and precision web systems that earn the trust of discriminating customers.
          </p>
          <div className="pt-2">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#171717] hover:underline"
            >
              <span>Examine our case archive</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#E5E0D8] border border-[#D8D2C6]">
          <Image
            src="/images/p7.jpg"
            alt="LaunchCraft Studio"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Agency Strengths */}
      <div className="space-y-8 pt-8 border-t border-[#D8D2C6]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Why LaunchCraft
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Core Agency Strengths
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agencyStrengths.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-3"
            >
              <div className="text-xs font-mono text-[#777777]">Strength 0{i + 1}</div>
              <h3 className="font-serif text-xl font-bold text-[#171717]">
                {item.title}
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership & Craft */}
      <div className="space-y-8 pt-8 border-t border-[#D8D2C6]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Leadership &amp; Craft
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Experienced Practice Leads
          </h2>
          <p className="text-sm text-[#555555] mt-2 max-w-xl">
            A tight-knit, cross-disciplinary leadership team with verified backgrounds across venture capital, brand studios, and high-scale software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadershipCraft.map((lead) => (
            <div
              key={lead.name}
              className="editorial-card rounded-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#E5E0D8]">
                <Image
                  src={lead.image}
                  alt={lead.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#171717]">
                  {lead.name}
                </h3>
                <div className="text-xs font-mono text-[#777777] uppercase tracking-wider mt-0.5">
                  {lead.role}
                </div>
              </div>

              <p className="text-xs text-[#555555] leading-relaxed">
                {lead.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-10 rounded-2xl bg-[#171717] text-[#F5F1E9] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Discuss your next chapter with our leadership team
          </h2>
          <p className="text-sm text-[#A3A3A3]">
            We keep our active client roster intentionally selective to maintain senior partner attention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" variant="default" size="default" className="bg-white text-[#171717] hover:bg-[#E5E0D8]">
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/book" variant="outline" size="default" className="border-[#444444] text-white hover:bg-[#2A2A2A]">
            <span>Book Consultation</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

