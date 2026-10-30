import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { PortfolioHub } from "@/components/portfolio/PortfolioHub";
import { getPortfolioProjects } from "@/lib/cms/store";

export const instant = false;

export const metadata: Metadata = {
  title: "Selected Work & Case Studies",
  description:
    "Explore LaunchCraft's portfolio of verified client transformations across Branding, Websites, Marketing Strategy, SEO, and Launch Campaigns.",
};

export default async function WorkPage() {
  await connection();
  const projects = await getPortfolioProjects({ onlyPublished: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      {/* Editorial Header */}
      <div className="border-b border-[#D8D2C6] pb-12 pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
          Index of Work • Case Archive
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-[#171717] mt-3 tracking-tight">
          Crafted for Market Velocity &amp; Enduring Recall
        </h1>
        <p className="text-base sm:text-lg text-[#555555] max-w-3xl mt-4 leading-relaxed">
          A curated selection of verified client engagements. Every case study documents authentic commercial challenges, strategic execution, and measured outcomes.
        </p>
      </div>

      {/* Interactive Portfolio Filter & List Wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="py-20 text-center font-mono text-xs text-[#777777]">
            Loading case archive...
          </div>
        }
      >
        <PortfolioHub initialProjects={projects} />
      </Suspense>
    </div>
  );
}
