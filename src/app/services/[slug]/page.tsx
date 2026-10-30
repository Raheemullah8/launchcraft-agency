import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { getServiceBySlug, getPortfolioProjects } from "@/lib/cms/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.metaTitle || `${service.title} | LaunchCraft`,
    description: service.metaDescription || service.shortBenefit,
    openGraph: {
      title: service.metaTitle || `${service.title} | LaunchCraft`,
      description: service.metaDescription || service.shortBenefit,
      url: `https://launchcraft.agency/services/${service.slug}`,
    },
  };
}


export const instant = false;

export default async function ServiceDetailPage({ params }: PageProps) {
  await connection();
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service || service.status !== "published") {
    notFound();
  }

  const allProjects = await getPortfolioProjects({ onlyPublished: true });
  // Find related work matching this service title or categories
  const relatedProjects = allProjects.filter((p) =>
    p.categories.some((c) =>
      service.title.toLowerCase().includes(c.toLowerCase()) ||
      c.toLowerCase().includes(service.title.toLowerCase().split(" ")[0])
    )
  ).slice(0, 2);

  const displayRelated = relatedProjects.length > 0 ? relatedProjects : allProjects.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="pt-4 flex items-center gap-2 text-xs font-mono text-[#777777]">
        <Link href="/" className="hover:text-[#171717]">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-[#171717]">Services</Link>
        <span>/</span>
        <span className="text-[#171717] font-semibold">{service.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="border-b border-[#D8D2C6] pb-12">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#777777] mb-4">
          <div className="p-2 rounded-lg bg-white border border-[#D8D2C6] text-[#171717]">
            <ServiceIcon name={service.icon} className="w-5 h-5" />
          </div>
          <span>Practice Area • 0{service.order}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] tracking-tight max-w-4xl leading-tight">
          {service.heroHeadline}
        </h1>

        <p className="text-lg sm:text-xl text-[#555555] max-w-3xl mt-6 leading-relaxed">
          {service.valueProp}
        </p>

        <div className="pt-8 flex flex-wrap items-center gap-4">
          <Button
            href={`/contact?service=${encodeURIComponent(service.slug)}`}
            variant="default"
            size="lg"
          >
            <span>Request a Quote for {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/book" variant="secondary" size="lg">
            <span>Book Consultation Call</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid: Who It Helps & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Who It Helps */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-t border-[#171717] pt-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Audience &amp; Fit
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mt-1">
              Who This Practice Helps
            </h2>
          </div>
          <p className="text-sm text-[#666666] leading-relaxed">
            Our engagements are designed for teams seeking senior strategic execution without operational friction.
          </p>
          <ul className="space-y-3">
            {service.whoItHelps.map((target, idx) => (
              <li
                key={idx}
                className="p-4 rounded-xl bg-white border border-[#E5E0D8] text-sm text-[#171717] font-medium flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#171717] mt-2 flex-shrink-0" />
                <span>{target}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables (3-6 Short Bullets) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-t border-[#171717] pt-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Scope &amp; Artifacts
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mt-1">
              Core Deliverables
            </h2>
          </div>
          <p className="text-sm text-[#666666] leading-relaxed">
            Every deliverable is crafted with commercial rigor and delivered as production-ready documentation and digital systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2"
              >
                <div className="text-xs font-mono text-[#777777]">Deliverable 0{idx + 1}</div>
                <div className="font-serif text-base font-bold text-[#171717] leading-snug">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Workflow Steps */}
      <div className="space-y-8 pt-8 border-t border-[#D8D2C6]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Structured Delivery
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Engagement Workflow
          </h2>
          <p className="text-sm text-[#555555] mt-2">
            A transparent 4-stage cadence from initial discovery to milestone signoff.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.workflowSteps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-xl bg-white border border-[#E5E0D8] space-y-3"
            >
              <div className="text-xs font-mono text-[#777777]">Step 0{step.step}</div>
              <h3 className="font-serif text-lg font-bold text-[#171717]">
                {step.title}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Case Studies */}
      <div className="space-y-8 pt-8 border-t border-[#D8D2C6]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Applied Proof
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
              Relevant Work
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#171717] hover:underline"
          >
            <span>All Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {displayRelated.map((proj) => (
            <Link
              key={proj.id}
              href={`/work/${proj.slug}`}
              className="group block space-y-4"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E5E0D8] border border-[#D8D2C6]">
                <Image
                  src={proj.heroImage}
                  alt={proj.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#777777] uppercase">
                  {proj.client} • {proj.categories[0]}
                </div>
                <h3 className="font-serif text-xl font-bold text-[#171717] group-hover:underline">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#555555] line-clamp-2">
                  {proj.outcome}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs (Genuine Content Only) */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#D8D2C6]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Clarification
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mt-1">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white border border-[#E5E0D8] space-y-2"
              >
                <div className="flex items-center gap-2 font-serif text-base font-bold text-[#171717]">
                  <HelpCircle className="w-4 h-4 text-[#777777] flex-shrink-0" />
                  <h4>{faq.question}</h4>
                </div>
                <p className="text-sm text-[#555555] leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Preselected Inquiry CTA */}
      <div className="p-10 rounded-2xl bg-[#171717] text-[#F5F1E9] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
            Engagement Inquiry
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Discuss your requirements for {service.title}
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-xl">
            Submit a project inquiry with {service.title} preselected, or reserve a 30-minute private consultation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            href={`/contact?service=${encodeURIComponent(service.slug)}`}
            variant="default"
            size="lg"
            className="bg-white text-[#171717] hover:bg-[#E5E0D8]"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/book" variant="outline" size="lg" className="border-[#444444] text-white hover:bg-[#2A2A2A]">
            <span>Book Consultation</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
