import type { Metadata } from "next";
import { CookieManager } from "@/components/cookies/CookieManager";

export const metadata: Metadata = {
  title: "Cookie Policy & Preferences",
  description: "Learn about LaunchCraft's cookie usage and manage your tracking preferences in compliance with GDPR.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="border-b border-[#D8D2C6] pb-8 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Consent Management
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#171717] mt-2">
          Cookie Policy &amp; Preferences
        </h1>
        <p className="text-xs font-mono text-[#777777] mt-2">
          Effective Date: October 29, 2026 • LaunchCraft Agency Ltd
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#444444] leading-relaxed">
        <p>
          This Cookie Policy explains how LaunchCraft Agency Ltd uses cookies and similar client-side storage technologies when you visit our website. We believe in complete transparency and give you full control over non-essential data collection.
        </p>

        <CookieManager />

        <section className="space-y-3 pt-6 border-t border-[#D8D2C6]">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            What are cookies?
          </h2>
          <p>
            Cookies are small text fragments stored by your browser when you access websites. They allow sites to remember session state and preferences. You may also configure your web browser to reject cookies globally.
          </p>
        </section>
      </div>
    </div>
  );
}

