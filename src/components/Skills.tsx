"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Rocket,
  GitBranch,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SKILLS_DATA } from "@/data/portfolioData";

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F2F7F1] rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <Badge variant="olive" className="mb-4">
              Technical Capabilities
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
              A Modern, Production-Tested Tech Stack.
            </h2>
            <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
          </div>
          <p className="text-base text-[#526055] max-w-md">
            Specialized in full-stack JavaScript & TypeScript, combining enterprise resilience with
            fluid micro-animations and rock-solid database design.
          </p>
        </div>

        {/* Featured Visual Banner integration with /images/p6.jpg */}
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
              alt="Skills & Tech Stack Graphic Banner"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover opacity-45 group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A270F] via-[#2C4018]/90 to-transparent" />

            {/* Banner Inner Content */}
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-xl text-white">
              <span className="text-xs uppercase tracking-widest text-[#95B47C] font-semibold mb-2">
                Core Specialization
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2F7F1] leading-tight mb-3">
                MERN Stack & Next.js 16 Ecosystem
              </h3>
              <p className="text-sm sm:text-base text-[#E3EDE0]/90 leading-relaxed">
                Full-cycle development from high-throughput PostgreSQL/MongoDB architectures to
                sub-second React 19 server rendered interfaces.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS_DATA.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full flex flex-col bg-[#F9FBF8] border-[#E2EBE0] hover:border-[#7A9A60] hover:bg-white transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-10 w-10 rounded-xl bg-[#2C4018] flex items-center justify-center text-white">
                      {idx === 0 && <Code2 className="w-5 h-5 text-[#95B47C]" />}
                      {idx === 1 && <Server className="w-5 h-5 text-[#95B47C]" />}
                      {idx === 2 && <Database className="w-5 h-5 text-[#95B47C]" />}
                      {idx === 3 && <Rocket className="w-5 h-5 text-[#95B47C]" />}
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#7A9A60]">
                      0{idx + 1}
                    </span>
                  </div>

                  <CardTitle className="text-xl text-[#2C4018]">
                    {category.title}
                  </CardTitle>
                  <p className="text-xs text-[#526055] leading-relaxed">
                    {category.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          skill.highlight
                            ? "bg-[#2C4018] text-[#F2F7F1] border border-[#3E5723] shadow-2xs hover:bg-[#3D5922]"
                            : "bg-white text-[#2C4018] border border-[#E2EBE0] hover:border-[#7A9A60]/50"
                        }`}
                      >
                        {skill.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A60]" />
                        )}
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2EBE0] flex items-center justify-between text-xs text-[#526055]">
                    <span className="font-medium text-[#2C4018]">Production Tested</span>
                    <CheckCircle2 className="w-4 h-4 text-[#7A9A60]" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
