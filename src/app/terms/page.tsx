import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions governing the use of LaunchCraft agency website, intellectual property, and service inquiries.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="border-b border-[#D8D2C6] pb-8 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Contractual Framework • Version 1.0
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#171717] mt-2">
          Terms of Use
        </h1>
        <p className="text-xs font-mono text-[#777777] mt-2">
          Effective Date: October 29, 2026 • LaunchCraft Agency Ltd
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#444444] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or browsing this website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            2. Intellectual Property Rights
          </h2>
          <p>
            All content, visual layouts, editorial typography, case study texts, code architectures, and trademarks displayed on this website are the property of LaunchCraft Agency Ltd or used with express permission of client partners. Unauthorized duplication, reproduction, or republication without prior written consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            3. Zero Public Pricing &amp; Custom Quotations
          </h2>
          <p>
            LaunchCraft does not publish standard rates or fixed packages. All project estimates, timelines, and proposals generated following project inquiries or consultation sessions are confidential and customized based on verified scope, deliverables, and operational requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            4. Limitation of Liability
          </h2>
          <p>
            While we strive for complete accuracy, website content is provided on an &ldquo;as is&rdquo; basis for informational purposes only. In no event shall LaunchCraft Agency Ltd be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            5. Governing Law
          </h2>
          <p>
            These Terms of Use are governed by and construed in accordance with the laws of England and Wales. The courts of England shall have exclusive jurisdiction to resolve any disputes arising under or in connection with these terms.
          </p>
        </section>

        <div className="pt-8 border-t border-[#D8D2C6] flex items-center justify-between text-xs font-mono text-[#777777]">
          <span>LaunchCraft Agency Ltd</span>
          <Link href="/contact" className="underline hover:text-[#171717]">
            Contact Legal Counsel &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

