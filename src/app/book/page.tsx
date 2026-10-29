import { Suspense } from "react";
import type { Metadata } from "next";
import { ConsultationScheduler } from "@/components/booking/ConsultationScheduler";

export const metadata: Metadata = {
  title: "Book a Strategic Consultation",
  description:
    "Schedule a 30-minute private consultation with a senior LaunchCraft partner. Review your brand positioning, tech stack, and growth objectives.",
};

export default function BookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Direct Advisory Scheduling
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight">
          Reserve a 30-Minute Consultation
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-3xl mt-4 leading-relaxed">
          Select an available slot directly on our senior partner calendar. We provide immediate, actionable feedback on your venture&apos;s growth goals.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center font-mono text-xs text-[#777777]">
            Loading consultation calendar...
          </div>
        }
      >
        <ConsultationScheduler />
      </Suspense>
    </div>
  );
}
