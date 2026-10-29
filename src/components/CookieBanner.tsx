"use client";

import * as React from "react";
import Link from "next/link";
import { setConsentStatus, getConsentStatus } from "@/lib/analytics";

export function CookieBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("launchcraft_cookie_consent_v1");
    if (!stored) {
      // Delay slightly for smooth page load
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

  const handleAccept = () => {
    setConsentStatus(true);
    setVisible(false);
  };

  const handleDecline = () => {
    setConsentStatus(false);
    setVisible(false);
  };

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-xl bg-[#171717] text-[#F5F1E9] border border-[#2B2B2B] shadow-2xl"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-[#AAAAAA]">
            Privacy &amp; Cookies
          </span>
          <span className="text-[10px] font-mono text-[#777777]">Consent Aware</span>
        </div>
        <p className="text-xs text-[#CCCCCC] leading-relaxed">
          We use strictly necessary cookies to ensure our site functions properly, and optional analytics to evaluate content performance without collecting personal identifiers.
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-md bg-[#FFFFFF] text-[#171717] font-semibold hover:bg-[#E5E0D8] transition-colors cursor-pointer"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2 px-3 rounded-md bg-[#2A2A2A] text-[#CCCCCC] hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            Decline
          </button>
          <Link
            href="/cookies"
            className="px-2 py-2 text-[11px] text-[#888888] hover:text-white underline underline-offset-2"
          >
            Manage
          </Link>
        </div>
      </div>
    </aside>
  );
}

