import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getPortfolioProjects } from "@/lib/cms/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPortfolioProjects({ onlyPublished: true });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: project.metaTitle || `${project.title} | Case Study | LaunchCraft`,
    description: project.metaDescription || project.outcome,
    openGraph: {
      title: project.metaTitle || `${project.title} | LaunchCraft`,
      description: project.metaDescription || project.outcome,
      images: [{ url: project.heroImage }],
      url: `https://launchcraft.agency/work/${project.slug}`,
    },
  };
}


export const instant = false;

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPortfolioProjects({ onlyPublished: true });
  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-4 flex items-center gap-2 text-xs font-mono text-[#777777]">
        <Link href="/" className="hover:text-[#171717]">Home</Link>
        <span>/</span>
        <Link href="/work" className="hover:text-[#171717]">Work</Link>
        <span>/</span>
        <span className="text-[#171717] font-semibold">{project.title}</span>
      </nav>

      {/* Case Study Header */}
      <div className="space-y-6 border-b border-[#D8D2C6] pb-12">
        <div className="flex flex-wrap items-center gap-2">
          {project.categories.map((c) => (
            <span
              key={c}
              className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-white border border-[#D8D2C6] text-[#555555]"
            >
              {c}
            </span>
          ))}
          <span className="text-xs font-mono text-[#777777]">• Client: {project.client}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-tight max-w-4xl">
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#555555] max-w-3xl leading-relaxed">
          {project.outcome}
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative aspect-[21/10] w-full overflow-hidden rounded-2xl bg-[#E5E0D8] border border-[#D8D2C6]">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>

      {/* Meta Specs Rail & Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Project Meta Details */}
        <div className="lg:col-span-4 space-y-8 p-6 rounded-2xl bg-white border border-[#E5E0D8]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Client
            </span>
            <div className="font-serif text-lg font-bold text-[#171717] mt-1">
              {project.client}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Industry
            </span>
            <div className="text-sm text-[#333333] mt-1">
              {project.industry}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Scope of Delivery
            </span>
            <ul className="mt-2 space-y-1.5 text-xs text-[#555555]">
              {project.scope.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="pt-4 border-t border-[#E5E0D8] space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                Verified Metrics
              </span>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-serif text-2xl font-bold text-[#171717]">
                      {m.value}
                    </div>
                    <div className="text-[10px] font-mono text-[#777777] uppercase">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Narrative: Challenge & Approach */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              01 / The Challenge
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
              De-risking the critical growth bottleneck
            </h2>
            <p className="text-base text-[#555555] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E5E0D8]">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              02 / Strategic Approach
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
              Disciplined architecture &amp; editorial execution
            </h2>
            <p className="text-base text-[#555555] leading-relaxed">
              {project.approach}
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E5E0D8]">
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              03 / Outcome &amp; Impact
            </span>
            <p className="text-base text-[#171717] font-medium leading-relaxed">
              {project.outcome}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Showcase */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#D8D2C6]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
              Visual Artifacts
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mt-1">
              Curated Production Assets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#E5E0D8] border border-[#D8D2C6]"
              >
                <Image
                  src={imgUrl}
                  alt={`${project.title} detail visual ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Projects */}
      <div className="space-y-8 pt-8 border-t border-[#D8D2C6]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#171717]">
            More Case Studies
          </h2>
          <Link
            href="/work"
            className="text-xs font-mono uppercase font-bold text-[#171717] hover:underline"
          >
            View Complete Index &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {relatedProjects.map((rel) => (
            <Link
              key={rel.id}
              href={`/work/${rel.slug}`}
              className="group block space-y-4"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E5E0D8] border border-[#D8D2C6]">
                <Image
                  src={rel.heroImage}
                  alt={rel.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <span className="text-xs font-mono text-[#777777] uppercase">
                  {rel.client}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#171717] group-hover:underline">
                  {rel.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-10 rounded-2xl bg-[#171717] text-[#F5F1E9] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Have a project with similar ambition?
          </h2>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Let&apos;s evaluate your scope, architecture, and timeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button href="/contact" variant="default" size="default" className="bg-white text-[#171717] hover:bg-[#E5E0D8]">
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/book" variant="outline" size="default" className="border-[#444444] text-white hover:bg-[#2A2A2A]">
            <span>Book Consultation</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
