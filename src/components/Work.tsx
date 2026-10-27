"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CASE_STUDIES } from "@/data/portfolioData";

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="olive" className="mb-4">
              Real Client Outcomes
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
              Featured Case Studies & Work.
            </h2>
            <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
          </div>

          <p className="text-base text-[#526055] max-w-md">
            We measure success in revenue generated, ROAS achieved, and brand positioning elevated—not
            empty likes or vanity metrics.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Card className="overflow-hidden flex flex-col h-full bg-[#F9FBF8] border-[#E2EBE0] hover:border-[#7A9A60] transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-[#2C4018]/10">
                {/* Visual Project Mockup Card using Next.js Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2EBE0]">
                  <Image
                    src={study.image}
                    alt={`${study.title} Preview`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A270F]/75 via-transparent to-transparent opacity-65 group-hover:opacity-40 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="olive" className="text-xs">
                      {study.client}
                    </Badge>
                  </div>

                  {/* Floating metric on hover */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <span className="text-xs font-semibold text-[#95B47C] uppercase tracking-wider block">
                      {study.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <CardHeader className="p-6 md:p-8 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#7A9A60] uppercase tracking-wider">
                      {study.tagline}
                    </span>
                    <span className="text-xs font-mono text-[#526055]">
                      0{idx + 1}
                    </span>
                  </div>

                  <CardTitle className="text-2xl text-[#2C4018] group-hover:text-[#3D5922] transition-colors leading-snug">
                    {study.title}
                  </CardTitle>

                  <p className="text-sm text-[#526055] leading-relaxed pt-2">
                    {study.description}
                  </p>
                </CardHeader>

                <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                  {/* Results Highlights */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-white p-3 rounded-xl border border-[#E2EBE0]">
                    {study.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div className="font-serif text-lg sm:text-xl font-bold text-[#2C4018]">
                          {m.value}
                        </div>
                        <div className="text-[10px] text-[#526055] uppercase tracking-wider font-medium">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#E2EBE0] mt-3">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-medium text-[#526055] bg-white border border-[#E2EBE0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="p-6 md:p-8 pt-0 flex items-center justify-between border-t border-[#E2EBE0]/60 mt-2">
                  <Button href="#contact" size="sm" variant="default">
                    <span>Replicate These Results</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>

                  <span className="text-xs font-semibold text-[#7A9A60]">
                    Verified ROI
                  </span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
