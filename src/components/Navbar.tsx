"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AGENCY_INFO } from "@/data/portfolioData";

const NAV_LINKS = [
  { name: "Services", href: "#services" },
  { name: "Process", href: "#process" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Special Offer Announcement Bar */}
      <div className="bg-[#2C4018] text-[#F2F7F1] py-1.5 px-4 text-center text-xs font-medium border-b border-[#3E5723]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7A9A60] text-white text-[10px] font-bold uppercase tracking-wider">
            Limited Offer
          </span>
          <span className="truncate">
            {AGENCY_INFO.specialOffer}
          </span>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#95B47C] hover:text-white underline underline-offset-2 ml-1"
          >
            Claim Yours
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E2EBE0] py-3"
            : "bg-white/80 backdrop-blur-xs py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="#"
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9A60] rounded-xl"
            >
              <div className="h-10 w-10 rounded-xl bg-[#2C4018] flex items-center justify-center text-[#F2F7F1] shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#3D5922]">
                <Rocket className="w-5 h-5 text-[#95B47C]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-[#2C4018] tracking-tight leading-none group-hover:text-[#7A9A60] transition-colors">
                  Launch Craft
                </span>
                <span className="text-[11px] font-mono font-medium text-[#7A9A60] tracking-wider mt-0.5">
                  @{AGENCY_INFO.handle}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#F2F7F1] px-4 py-1.5 rounded-full border border-[#E2EBE0]">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-1.5 text-sm font-medium text-[#1E293B] hover:text-[#2C4018] rounded-full transition-all duration-200 hover:bg-white hover:shadow-xs"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA & Instagram Direct Link */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={AGENCY_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F7F1] border border-[#E2EBE0] text-xs font-semibold text-[#2C4018] hover:border-[#7A9A60] transition-colors"
                title="DM us on Instagram"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#7A9A60]" />
                <span>DM Us</span>
              </a>

              <Button href="#contact" variant="default" size="default">
                <span>Let&apos;s Launch</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button href="#contact" variant="default" size="sm" className="px-3 text-xs">
                <span>Launch</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl border border-[#E2EBE0] bg-white text-[#2C4018] hover:bg-[#F2F7F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9A60]"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-[#E2EBE0] bg-white/98 backdrop-blur-lg px-6 pt-4 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-xl bg-[#F2F7F1] border border-[#E2EBE0] text-xs text-[#2C4018] mb-2">
                <span className="font-bold block text-[#2C4018] mb-0.5">Special Launch Offer</span>
                <span className="text-[#526055]">{AGENCY_INFO.specialOffer}</span>
              </div>

              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-4 py-2.5 text-base font-medium text-[#1E293B] hover:text-[#2C4018] hover:bg-[#F2F7F1] rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3 border-t border-[#E2EBE0] mt-1 flex flex-col gap-2">
                <Button href="#contact" variant="default" className="w-full justify-center">
                  <span>Start Your 7-Day Free Trial</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>

                <a
                  href={AGENCY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#7A9A60] hover:text-[#2C4018]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>DM us on Instagram (@{AGENCY_INFO.handle})</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
