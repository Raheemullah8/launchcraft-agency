"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Services", href: "/services" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-200">
      {/* Editorial Navigation Bar */}
      <div
        className={`transition-all duration-200 ${
          scrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E5E0D8] py-3.5 shadow-xs"
            : "bg-[#F5F1E9]/80 backdrop-blur-xs border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Editorial Motto */}
            <Link
              href="/"
              className="group flex items-baseline gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-sm"
              aria-label="LaunchCraft Home"
            >
              <span className="font-serif font-black text-2xl tracking-tighter text-[#171717]">
                LAUNCHCRAFT
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#777777] uppercase tracking-widest pl-1 border-l border-[#D8D2C6]">
                From Idea to Impact
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[#E5E0D8] backdrop-blur-xs"
              aria-label="Main Navigation"
            >
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-colors ${
                      isActive
                        ? "bg-[#171717] text-[#F5F1E9] font-semibold"
                        : "text-[#171717] hover:text-[#000000] hover:bg-[#F5F1E9]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Primary Action Button */}
            <div className="hidden md:flex items-center gap-3">
              <Button href="/book" variant="default" size="default">
                <span>Book a Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button href="/book" variant="default" size="sm" className="px-3.5 text-xs">
                <span>Book</span>
              </Button>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-lg border border-[#E5E0D8] bg-white text-[#171717] hover:bg-[#FAF8F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-b border-[#E5E0D8] bg-[#FAF8F5] px-6 pt-4 pb-8 shadow-xl"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 text-sm font-mono uppercase tracking-wider rounded-lg transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-[#171717] text-[#F5F1E9] font-bold"
                        : "text-[#171717] hover:bg-[#ECE7DF]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#E5E0D8] mt-2 flex flex-col gap-3">
                <Button
                  href="/book"
                  variant="default"
                  className="w-full justify-center h-12"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Book a Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
                <div className="text-center text-xs text-[#777777] font-mono">
                  From Idea to Impact • London & Global
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
