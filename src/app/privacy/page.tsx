import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "LaunchCraft privacy policy, data protection, CV handling, and user rights under GDPR and UK DPA 2018.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="border-b border-[#D8D2C6] pb-8 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Legal Framework • Version 1.0
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#171717] mt-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-[#777777] mt-2">
          Effective Date: October 29, 2026 • LaunchCraft Agency Ltd
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#444444] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            1. Overview &amp; Data Controller
          </h2>
          <p>
            LaunchCraft Agency Ltd (&ldquo;LaunchCraft&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy outlines how we collect, store, and process personal data across our website and client service engagements in compliance with the UK Data Protection Act 2018 and the General Data Protection Regulation (GDPR).
          </p>
          <p>
            The data controller is LaunchCraft Agency Ltd, located at 14 Berwick Street, Soho, London W1F 0PP. For all inquiries regarding data protection, please contact: <a href="mailto:privacy@launchcraft.agency" className="text-[#171717] underline">privacy@launchcraft.agency</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            2. Personal Data We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Project Inquiries &amp; Contact:</strong> Name, business email, organization name, telephone number, service interests, project requirements, and communication logs.
            </li>
            <li>
              <strong>Consultation Bookings:</strong> Name, work email, company name, requested date/time slots, timezone, and preparatory meeting notes.
            </li>
            <li>
              <strong>Careers &amp; Job Applications:</strong> Candidate full name, email, phone number, portfolio/LinkedIn URL, cover letter note, and curriculum vitae (CV/resume files).
            </li>
            <li>
              <strong>Newsletter Subscriptions:</strong> Email address, timestamp of opt-in, and acquisition channel.
            </li>
            <li>
              <strong>Telemetry &amp; Analytics:</strong> Aggregated, non-personally identifiable usage data (e.g., page views, filter interactions) collected strictly upon consent.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            3. CV &amp; Direct Application File Security
          </h2>
          <p>
            We adhere to strict information security standards. Curriculum Vitae (CV) documents submitted through our careers portal are stored in <strong>private, non-public object storage</strong> behind server-side authentication. CV files are never stored in public web directories, never indexed by search engines, and accessible only by authorized recruitment partners.
          </p>
          <p>
            Candidate records are retained for a maximum duration of 12 months for active consideration, after which they are securely purged unless extended consent is explicitly granted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            4. Purpose &amp; Lawful Bases for Processing
          </h2>
          <p>
            We process your personal information under the following lawful bases:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contractual Necessity:</strong> To review, scope, and deliver requested agency services or schedule consultations.</li>
            <li><strong>Legitimate Interests:</strong> To evaluate qualified job candidates and respond to general communications.</li>
            <li><strong>Consent:</strong> For opt-in newsletter dispatches and optional analytics cookies. Consent can be revoked at any time.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            5. Your Statutory Rights
          </h2>
          <p>
            Under applicable data protection legislation, you hold the following rights:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Right of access to the personal data we hold about you.</li>
            <li>Right to rectification of inaccurate or incomplete information.</li>
            <li>Right to erasure (&ldquo;Right to be forgotten&rdquo;).</li>
            <li>Right to restrict or object to processing.</li>
            <li>Right to data portability.</li>
          </ul>
          <p>
            To exercise any of these rights, email <a href="mailto:privacy@launchcraft.agency" className="text-[#171717] underline">privacy@launchcraft.agency</a>. Requests are responded to within 30 days without fee.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-[#171717]">
            6. Third-Party Processors
          </h2>
          <p>
            We work only with vetted infrastructure and platform providers (such as hosting, email delivery, and official Trustpilot integrations) that comply with strict data protection and confidentiality agreements. We never sell, rent, or trade your personal data.
          </p>
        </section>

        <div className="pt-8 border-t border-[#D8D2C6] flex items-center justify-between text-xs font-mono text-[#777777]">
          <span>LaunchCraft Agency Ltd</span>
          <Link href="/cookies" className="underline hover:text-[#171717]">
            Manage Cookie Preferences &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

