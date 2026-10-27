"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUp,
  Mail,
  Rocket,
} from "lucide-react";
import { Instagram } from "@/components/icons/SocialIcons";
import { AGENCY_INFO, SERVICES_9_GRID } from "@/data/portfolioData";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A270F] text-[#F2F7F1] border-t border-[#2C4018] relative overflow-hidden">
      {/* Decorative ambient bloom */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2C4018]/40 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2C4018]">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="#" className="flex items-center gap-2.5 mb-4 group">
              <div className="h-10 w-10 rounded-xl bg-[#7A9A60] flex items-center justify-center text-[#1A270F] shadow-xs group-hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5 text-[#1A270F]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-[#F2F7F1] tracking-tight group-hover:text-[#95B47C] transition-colors">
                  {AGENCY_INFO.name}
                </span>
                <span className="text-[11px] font-mono font-medium text-[#95B47C] tracking-wider">
                  @{AGENCY_INFO.handle}
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#B6CDA9] max-w-sm leading-relaxed mb-6">
              {AGENCY_INFO.subTagline}
            </p>

            <div className="flex items-center gap-2">
              <a
                href={AGENCY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#2C4018] text-[#F2F7F1] hover:bg-[#7A9A60] hover:text-[#1A270F] transition-all duration-200"
                aria-label="Instagram Profile"
                title="DM us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${AGENCY_INFO.email}`}
                className="p-2.5 rounded-xl bg-[#2C4018] text-[#F2F7F1] hover:bg-[#7A9A60] hover:text-[#1A270F] transition-all duration-200"
                aria-label="Email Agency"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#95B47C] mb-4">
              Agency Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E3EDE0]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Our 9 Services
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  4-Step Workflow
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-white transition-colors">
                  Featured Case Studies
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Launch Craft
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Claim $0 Fees Trial
                </a>
              </li>
            </ul>
          </div>

          {/* 9 Services Summary */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#95B47C] mb-4">
              9 Core Growth Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2 text-xs text-[#B6CDA9]">
              {SERVICES_9_GRID.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A60] shrink-0" />
                  <span className="truncate">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top (Static year to prevent SSR hydration/unstable date warning) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B6CDA9]">
          <div className="flex items-center gap-1">
            <span>&copy; 2026 Launch Craft (launch.craft). All rights reserved. Helping businesses launch, grow & stand out.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={AGENCY_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              Instagram @{AGENCY_INFO.handle}
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C4018] hover:bg-[#3D5922] text-[#F2F7F1] transition-colors"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
