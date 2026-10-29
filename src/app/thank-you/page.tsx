import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank You",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
      <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mx-auto text-[#171717]">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Transmission Confirmed
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#171717]">
          Thank you for reaching out.
        </h1>
        <p className="text-base text-[#555555] max-w-lg mx-auto leading-relaxed">
          Your request has been logged in our partner queue. Our team reviews submissions daily and will respond within 24 business hours.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] max-w-md mx-auto space-y-2 text-left">
        <div className="text-xs font-mono uppercase text-[#777777]">Next Steps</div>
        <ul className="text-xs text-[#555555] space-y-1.5 list-disc pl-4">
          <li>Senior partner review of your requirements</li>
          <li>Preliminary audit of competitive whitespace &amp; tech stack</li>
          <li>Direct follow-up to coordinate next milestones</li>
        </ul>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="default" size="default">
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button href="/work" variant="secondary" size="default">
          <span>Browse Case Studies</span>
        </Button>
      </div>
    </div>
  );
}

