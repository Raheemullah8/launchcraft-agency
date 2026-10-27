"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Palette,
  Target,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AGENCY_INFO } from "@/data/portfolioData";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#F2F7F1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-16">
          <Badge variant="olive" className="mb-4">
            About Launch Craft
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
            Born to Help Businesses Launch, Grow & Stand Out.
          </h2>
          <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Portrait Visual Card with /images/p2.jpg */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              <div className="absolute -inset-3 bg-[#E3EDE0] rounded-3xl transform -rotate-2 -z-10 border border-[#7A9A60]/30" />

              <div className="relative rounded-2xl overflow-hidden bg-white p-3 shadow-xl border border-[#E2EBE0]">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#E2EBE0]">
                  <Image
                    src="/images/p2.jpg"
                    alt="Launch Craft Agency Overview Visual"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-top hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C4018]/75 via-transparent to-transparent" />

                  {/* Floating label */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#95B47C]">
                      Digital Growth Agency
                    </p>
                    <p className="font-serif text-lg font-bold text-white">
                      Launch Craft (launch.craft)
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-4 bg-[#2C4018] text-[#F2F7F1] px-4 py-2.5 rounded-full shadow-lg border border-[#7A9A60]/40 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7A9A60]" />
                <span className="text-xs font-medium tracking-wide">
                  ROI-First Agency
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="space-y-5 text-base sm:text-lg text-[#526055] leading-relaxed">
              <p>
                At <strong className="text-[#2C4018] font-semibold">{AGENCY_INFO.name}</strong>, we believe most businesses fail to scale not because their product is bad, but because they are shouting into the void with the wrong message, targeted at the wrong audience.
              </p>
              <p>
                We engineered Launch Craft as an antidote to bloated retainers and cookie-cutter agencies. By consolidating high-tier <strong className="text-[#2C4018]">Branding</strong>, relentless <strong className="text-[#2C4018]">Paid Media (Meta & Google Ads)</strong>, and <strong className="text-[#2C4018]">Custom Web Engineering</strong>, we construct seamless client acquisition engines.
              </p>
              <p>
                We back our confidence with our signature proposition: <strong className="text-[#7A9A60]">{AGENCY_INFO.specialOffer}</strong>. We let our creative caliber and strategy prove themselves before asking for long-term commitment.
              </p>
            </div>

            {/* Core Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8">
              <div className="bg-white p-4 rounded-xl border border-[#E2EBE0] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F2F7F1] text-[#2C4018]">
                  <Target className="w-5 h-5 text-[#2C4018]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018]">Targeting</h4>
                  <p className="text-xs text-[#526055]">High-Intent Buyers</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE0] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F2F7F1] text-[#2C4018]">
                  <Palette className="w-5 h-5 text-[#7A9A60]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018]">Editorial UI</h4>
                  <p className="text-xs text-[#526055]">Unforgettable Visuals</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE0] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F2F7F1] text-[#2C4018]">
                  <TrendingUp className="w-5 h-5 text-[#2C4018]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018]">Scale ROAS</h4>
                  <p className="text-xs text-[#526055]">4.8x Average Return</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Button href="#contact" variant="default" size="default">
                <span>Start Your 7-Day Trial</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>

              <Button href="#services" variant="secondary" size="default">
                <span>Explore Full Service Suite</span>
                <Sparkles className="w-4 h-4 ml-1 text-[#7A9A60]" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
