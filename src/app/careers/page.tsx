import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import { getJobs } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Careers & Open Positions",
  description:
    "Join LaunchCraft. We are looking for senior brand strategists, front-end engineers, and performance marketers to build enduring client impact.",
};


export default async function CareersPage() {
  const jobs = await getJobs(true);

  const perks = [
    {
      title: "Autonomy & Senior Colleague Craft",
      desc: "Work alongside seasoned practice leads with zero micromanagement, bureaucratic red tape, or performative busywork.",
    },
    {
      title: "Flexible Remote & Hybrid Structure",
      desc: "Work from our central London studio, your home office, or anywhere within compatible UK/EU timezones.",
    },
    {
      title: "Continuous Craft Sabbaticals & Tools",
      desc: "Dedicated personal hardware, book budgets, and funded workshop attendance to keep your skills at the cutting edge.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
      {/* Editorial Header */}
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Recruitment &amp; Craft
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight">
          Build high-conviction work with leaders in their craft.
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-3xl mt-4 leading-relaxed">
          At LaunchCraft, we don&apos;t hire headcount to fill chairs. We seek disciplined specialists who value editorial clarity, high-speed engineering, and commercial accountability.
        </p>
      </div>

      {/* Perks & Employer Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {perks.map((perk, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-3"
          >
            <div className="text-xs font-mono text-[#777777]">Principle 0{i + 1}</div>
            <h3 className="font-serif text-xl font-bold text-[#171717]">
              {perk.title}
            </h3>
            <p className="text-sm text-[#555555] leading-relaxed">
              {perk.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Open Roles Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#171717] pb-4">
          <h2 className="font-serif text-3xl font-bold text-[#171717]">
            Active Open Roles ({jobs.length})
          </h2>
          <span className="text-xs font-mono text-[#777777]">
            Direct Applications Accepted
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-16 rounded-2xl bg-white border border-[#E5E0D8] text-center space-y-3">
            <h3 className="font-serif text-2xl font-bold text-[#171717]">
              No active vacancies at this moment
            </h3>
            <p className="text-sm text-[#777777] max-w-md mx-auto">
              We periodically open roles across strategy, engineering, and brand design. Feel free to submit a speculative inquiry via our contact form.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#171717] underline"
              >
                <span>Send Speculative Note</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D8] border border-[#E5E0D8] rounded-2xl bg-white overflow-hidden">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#777777]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#171717] font-semibold">
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location} ({job.workArrangement})
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#171717]">
                    <Link
                      href={`/careers/${job.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {job.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#555555] leading-relaxed">
                    {job.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/careers/${job.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition-colors"
                  >
                    <span>View Role &amp; Apply</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
