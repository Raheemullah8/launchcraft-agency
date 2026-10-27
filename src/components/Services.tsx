"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  Palette,
  Share2,
  Target,
  Search,
  Code2,
  Gauge,
  ShoppingBag,
  CheckCircle2,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { SERVICES_9_GRID, AGENCY_INFO } from "@/data/portfolioData";

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#95B47C]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#95B47C]" />,
  Palette: <Palette className="w-5 h-5 text-[#95B47C]" />,
  Share2: <Share2 className="w-5 h-5 text-[#95B47C]" />,
  Target: <Target className="w-5 h-5 text-[#95B47C]" />,
  Search: <Search className="w-5 h-5 text-[#95B47C]" />,
  Code2: <Code2 className="w-5 h-5 text-[#95B47C]" />,
  Gauge: <Gauge className="w-5 h-5 text-[#95B47C]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#95B47C]" />,
};

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="olive" className="mb-4">
              Comprehensive Growth Suite
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
              Our 9 Core Agency Services.
            </h2>
            <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
          </div>

          <p className="text-base text-[#526055] max-w-md">
            Everything your brand needs to launch, capture attention, and scale revenue predictably
            without juggling disconnected freelancers.
          </p>
        </div>

        {/* Feature Visual Banner with /images/p3.jpg */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-16 border border-[#E2EBE0] bg-gradient-to-br from-[#F2F7F1] to-white shadow-xl group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual element card with /images/p3.jpg */}
            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] overflow-hidden bg-[#E2EBE0]">
              <Image
                src="/images/p3.jpg"
                alt="Launch Craft Services Visual Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A270F]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#F2F7F1]/20" />
              <div className="absolute top-4 left-4">
                <Badge variant="olive" className="text-xs">
                  Full-Cycle Agency
                </Badge>
              </div>
            </div>

            {/* Content description */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A9A60] mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#7A9A60]" />
                Zero-Friction Client Onboarding
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018] mb-4 leading-tight">
                {AGENCY_INFO.specialOffer}
              </h3>
              <p className="text-sm sm:text-base text-[#526055] leading-relaxed mb-6">
                Test our strategy, review our custom ad creatives, and inspect our campaign architecture.
                Experience how Launch Craft operates for 7 full days with $0 in agency management fees.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="#contact" variant="default" size="default">
                  <span>Claim Your 7-Day Trial</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
                <span className="text-xs text-[#526055] font-medium">
                  • No long-term lock-in contracts
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 9 Services 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_9_GRID.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col bg-[#F9FBF8] border-[#E2EBE0] hover:border-[#7A9A60] hover:bg-white transition-all duration-300 group hover:shadow-xl hover:shadow-[#2C4018]/5">
                <CardHeader className="p-6 md:p-7 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-[#2C4018] flex items-center justify-center text-white group-hover:bg-[#3D5922] transition-colors">
                      {ICON_MAP[service.iconName] || <Sparkles className="w-5 h-5 text-[#95B47C]" />}
                    </div>

                    <span className="text-xs font-mono font-bold text-[#7A9A60]">
                      0{idx + 1}
                    </span>
                  </div>

                  <CardTitle className="text-xl text-[#2C4018] group-hover:text-[#3D5922] transition-colors">
                    {service.title}
                  </CardTitle>

                  <p className="text-xs font-semibold text-[#7A9A60] uppercase tracking-wider pt-0.5">
                    {service.subtitle}
                  </p>

                  <p className="text-sm text-[#526055] leading-relaxed pt-2">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="p-6 md:p-7 pt-0 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 pt-3 border-t border-[#E2EBE0]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C4018] block mb-1">
                      Deliverables Included
                    </span>
                    {service.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs text-[#526055]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7A9A60] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 md:p-7 pt-0 border-t border-[#E2EBE0]/60 flex items-center justify-between">
                  <a
                    href="#contact"
                    className="text-xs font-bold text-[#2C4018] group-hover:text-[#7A9A60] flex items-center gap-1 transition-colors"
                  >
                    <span>Inquire for {service.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
