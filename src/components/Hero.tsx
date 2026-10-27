"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { Instagram } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AGENCY_INFO } from "@/data/portfolioData";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white flex items-center">
      {/* Decorative background ambient blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#F2F7F1] rounded-full blur-3xl -z-10 opacity-80 pointer-events-none" />
      <div className="absolute top-12 right-12 w-80 h-80 bg-[#E3EDE0] rounded-full blur-2xl -z-10 opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hook, Subheadline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Agency Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <Badge variant="olive" className="px-3.5 py-1.5 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#95B47C]" />
                Digital Growth Agency • Branding & Marketing
              </Badge>
              <span className="text-xs font-medium text-[#526055] hidden sm:inline-block">
                • {AGENCY_INFO.specialOffer.split("—")[0]}
              </span>
            </div>

            {/* Editorial Serif Hook */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-bold tracking-tight text-[#2C4018] leading-[1.08] mb-6">
              You&apos;re targeting the{" "}
              <span className="italic font-serif font-normal text-[#7A9A60]">
                wrong audience.
              </span>{" "}
              We help you launch & scale.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-[#526055] max-w-2xl leading-relaxed mb-8">
              <strong className="text-[#1E293B] font-semibold">{AGENCY_INFO.name}</strong> elevates
              ambitious brands through high-converting Meta & Google ad funnels, editorial brand
              identities, viral social media engines, and custom high-speed web platforms.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <Button href="#contact" size="lg" variant="default" className="w-full sm:w-auto shadow-md">
                <span>Claim $0 Agency Fees Trial</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>

              <Button href="#services" size="lg" variant="secondary" className="w-full sm:w-auto">
                <span>View Our 9 Services</span>
                <ArrowDown className="w-4 h-4 ml-1 text-[#7A9A60]" />
              </Button>
            </div>

            {/* Credibility & Metrics Strip */}
            <div className="pt-6 border-t border-[#E2EBE0] w-full flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018]">
                    {AGENCY_INFO.averageROAS}
                  </div>
                  <div className="text-xs text-[#526055] font-medium uppercase tracking-wider">
                    Average ROAS
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E2EBE0]" />
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018]">
                    {AGENCY_INFO.brandsScaled}
                  </div>
                  <div className="text-xs text-[#526055] font-medium uppercase tracking-wider">
                    Brands Scaled
                  </div>
                </div>
                <div className="h-8 w-px bg-[#E2EBE0]" />
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018]">
                    {AGENCY_INFO.adSpendManaged}
                  </div>
                  <div className="text-xs text-[#526055] font-medium uppercase tracking-wider">
                    Ad Spend Run
                  </div>
                </div>
              </div>

              {/* Instagram direct badge */}
              <a
                href={AGENCY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 px-3.5 rounded-full border border-[#E2EBE0] bg-[#F2F7F1] text-[#2C4018] hover:bg-[#2C4018] hover:text-white transition-all duration-300 text-xs font-semibold"
              >
                <Instagram className="w-4 h-4 text-[#7A9A60]" />
                <span>@{AGENCY_INFO.handle}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Editorial Card with /images/p1.jpg */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[440px] lg:max-w-none">
              {/* Outer decorative borders and shadow */}
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-[#E2EBE0] to-white border border-[#E2EBE0] shadow-2xl shadow-[#2C4018]/10 group">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F2F7F1]">
                  <Image
                    src="/images/p1.jpg"
                    alt="Launch Craft - Brand Concept and 7-Day Free Trial Banner"
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    priority
                    loading="eager"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A270F]/85 via-transparent to-transparent opacity-90" />

                  {/* Overlay text */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-[#95B47C] font-semibold block mb-1">
                      Digital Growth Agency
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F2F7F1] leading-tight">
                      Branding • Social Media • Paid Media
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge 1 - Top Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-[#E2EBE0] rounded-2xl p-3.5 shadow-xl shadow-[#2C4018]/10 flex items-center gap-3 z-10"
              >
                <div className="h-10 w-10 rounded-xl bg-[#2C4018] flex items-center justify-center text-white">
                  <Rocket className="w-5 h-5 text-[#95B47C]" />
                </div>
                <div>
                  <div className="text-xs text-[#526055] font-medium">Special Offer</div>
                  <div className="text-sm font-bold text-[#2C4018]">$0 Fees for 7 Days</div>
                </div>
              </motion.div>

              {/* Floating Stat Badge 2 - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#E2EBE0] rounded-2xl p-3.5 shadow-xl shadow-[#2C4018]/10 flex items-center gap-3 z-10"
              >
                <div className="h-10 w-10 rounded-xl bg-[#7A9A60] flex items-center justify-center text-white">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-[#526055] font-medium">Targeted Growth</div>
                  <div className="text-sm font-bold text-[#2C4018]">High-Intent Funnels</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
