import { Suspense } from "react";
import type { Metadata } from "next";
import { ContactFormHub } from "@/components/contact/ContactFormHub";

export const metadata: Metadata = {
  title: "Contact & Project Inquiry",
  description:
    "Discuss your upcoming brand overhaul, web build, or acquisition milestone with LaunchCraft partners. Direct 24-hour response.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Initiate Discussion
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight">
          Request a Quote or Consultation
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-3xl mt-4 leading-relaxed">
          Tell us about your venture, milestones, and timeline. Every inquiry is personally reviewed by a senior partner under strict confidentiality.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center font-mono text-xs text-[#777777]">
            Loading inquiry form...
          </div>
        }
      >
        <ContactFormHub />
      </Suspense>
    </div>
  );
}

