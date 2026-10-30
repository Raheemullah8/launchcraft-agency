import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { MapPin, Briefcase, Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { getJobBySlug } from "@/lib/cms/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Vacancy Not Found",
    };
  }

  return {
    title: `${job.title} (${job.department}) | Careers | LaunchCraft`,
    description: job.summary,
    openGraph: {
      title: `${job.title} | LaunchCraft Careers`,
      description: job.summary,
      url: `https://launchcraft.agency/careers/${job.slug}`,
    },
  };
}


export const instant = false;

export default async function JobDetailPage({ params }: PageProps) {
  await connection();
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || job.status !== "published") {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* Breadcrumb & Back Link */}
      <div className="pt-4 flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#777777]">
          <Link href="/" className="hover:text-[#171717]">Home</Link>
          <span>/</span>
          <Link href="/careers" className="hover:text-[#171717]">Careers</Link>
          <span>/</span>
          <span className="text-[#171717] font-semibold">{job.title}</span>
        </nav>

        <Link
          href="/careers"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#171717] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Vacancies</span>
        </Link>
      </div>

      {/* Role Header */}
      <div className="space-y-6 border-b border-[#D8D2C6] pb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#777777]">
          <span className="px-3 py-1 rounded-full bg-white border border-[#D8D2C6] text-[#171717] font-bold">
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
          {job.deadline && (
            <span className="flex items-center gap-1 text-[#C53030]">
              <Calendar className="w-3.5 h-3.5" />
              Deadline: {job.deadline}
            </span>
          )}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-tight max-w-4xl">
          {job.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#555555] max-w-3xl leading-relaxed">
          {job.summary}
        </p>
      </div>

      {/* Two Column Layout: Description & Direct Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Responsibilities & Qualifications */}
        <div className="lg:col-span-6 space-y-10">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#171717]">
              Core Responsibilities
            </h2>
            <ul className="space-y-3">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#555555] leading-relaxed">
                  <Check className="w-4 h-4 text-[#171717] flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E5E0D8]">
            <h2 className="font-serif text-2xl font-bold text-[#171717]">
              Required Qualifications
            </h2>
            <ul className="space-y-3">
              {job.qualifications.map((qual, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#555555] leading-relaxed">
                  <Check className="w-4 h-4 text-[#171717] flex-shrink-0 mt-0.5" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
              Application Standards
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              Every applicant receives a direct confirmation. CV files are stored encrypted in private storage with strict access controls and are retained solely for recruitment purposes.
            </p>
          </div>
        </div>

        {/* Right Column: Direct Application Form */}
        <div className="lg:col-span-6 sticky top-28">
          <JobApplicationForm job={job} />
        </div>
      </div>
    </div>
  );
}
