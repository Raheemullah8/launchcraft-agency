"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Search, Compass, Rocket, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WORKFLOW_4_STEPS } from "@/data/portfolioData";

const STEP_ICONS = [
  <Search key="1" className="w-6 h-6 text-[#95B47C]" />,
  <Compass key="2" className="w-6 h-6 text-[#95B47C]" />,
  <Rocket key="3" className="w-6 h-6 text-[#95B47C]" />,
  <BarChart3 key="4" className="w-6 h-6 text-[#95B47C]" />,
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-20 md:py-28 bg-[#F2F7F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="olive" className="mb-4">
              Proven Methodology
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
              Our 4-Step Agency Workflow.
            </h2>
            <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
          </div>

          <p className="text-base text-[#526055] max-w-md">
            How Launch Craft takes your product from ambiguous positioning to a high-converting,
            scalable market force.
          </p>
        </div>

        {/* Process Visual Banner Integration with /images/p6.jpg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mb-16 border border-[#E2EBE0] shadow-lg group bg-[#2C4018]"
        >
          <div className="relative h-48 sm:h-64 md:h-72 w-full">
            <Image
              src="/images/p6.jpg"
              alt="Workflow & Strategy Process Graphic Banner"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover opacity-40 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A270F] via-[#2C4018]/90 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl text-white">
              <span className="text-xs uppercase tracking-widest text-[#95B47C] font-semibold mb-2">
                Predictable Growth System
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2F7F1] leading-tight mb-2">
                Discover • Strategize • Execute • Optimize
              </h3>
              <p className="text-xs sm:text-sm text-[#E3EDE0]/90 leading-relaxed">
                We remove guesswork from paid acquisition and branding. Every milestone is backed by
                conversion data, clear KPIs, and transparent client reporting.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4 Steps Horizontal / Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_4_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              <div className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E2EBE0] shadow-sm hover:border-[#7A9A60] hover:shadow-xl hover:shadow-[#2C4018]/5 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-[#2C4018] flex items-center justify-center text-white group-hover:bg-[#3D5922] transition-colors">
                      {STEP_ICONS[idx]}
                    </div>
                    <span className="font-mono text-xl font-bold text-[#7A9A60]">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#2C4018] mb-1 group-hover:text-[#3D5922] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#7A9A60] uppercase tracking-wider mb-3">
                    {step.tagline}
                  </p>

                  <p className="text-sm text-[#526055] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2EBE0] flex items-center justify-between text-xs text-[#526055]">
                  <span className="font-medium text-[#2C4018]">Stage {step.step} Complete</span>
                  <CheckCircle2 className="w-4 h-4 text-[#7A9A60]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
