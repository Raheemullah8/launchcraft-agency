"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { PortfolioProject } from "@/lib/cms/types";
import { trackEvent } from "@/lib/analytics";

const CATEGORIES = [
  "All",
  "Branding",
  "Websites",
  "Marketing",
  "Social Media",
  "SEO",
  "Launch Campaigns",
  "Consulting",
];

interface PortfolioHubProps {
  initialProjects: PortfolioProject[];
}

export function PortfolioHub({ initialProjects }: PortfolioHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL query parameters
  const activeCategory = searchParams.get("category") || "All";
  const urlSearchQuery = searchParams.get("q") || "";

  // Live real-time search state
  const [search, setSearch] = React.useState(urlSearchQuery);
  const [displayCount, setDisplayCount] = React.useState(6);

  // Sync internal search input if URL changes externally (e.g. browser back/forward)
  React.useEffect(() => {
    setSearch(urlSearchQuery);
  }, [urlSearchQuery]);

  // Debounced URL updater to keep URL query string in sync with live search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const currentQuery = params.get("q") || "";
      const trimmed = search.trim();

      if (trimmed !== currentQuery) {
        if (trimmed) {
          params.set("q", trimmed);
        } else {
          params.delete("q");
        }
        const qs = params.toString();
        const newPath = qs ? `/work?${qs}` : "/work";
        router.replace(newPath, { scroll: false });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search, router]);

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== "All") {
      params.set("category", cat);
    }
    if (search.trim()) {
      params.set("q", search.trim());
    }

    const qs = params.toString();
    const newPath = qs ? `/work?${qs}` : "/work";
    router.push(newPath, { scroll: false });

    // Track analytics event without PII
    trackEvent("portfolio_filter", {
      category: cat,
      pagePath: "/work",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory !== "All") {
      params.set("category", activeCategory);
    }
    if (search.trim()) {
      params.set("q", search.trim());
    }
    const qs = params.toString();
    const newPath = qs ? `/work?${qs}` : "/work";
    router.replace(newPath, { scroll: false });
  };

  const handleClearFilters = () => {
    setSearch("");
    router.push("/work", { scroll: false });
  };

  // Instant real-time filtering across all fields
  const filteredProjects = React.useMemo(() => {
    const q = search.toLowerCase().trim();

    return initialProjects.filter((p) => {
      // Category filter
      if (activeCategory !== "All") {
        const matchesCategory = p.categories.some(
          (c) => c.toLowerCase() === activeCategory.toLowerCase()
        );
        if (!matchesCategory) return false;
      }

      // Live search query matching
      if (q !== "") {
        const inTitle = p.title.toLowerCase().includes(q);
        const inClient = p.client.toLowerCase().includes(q);
        const inIndustry = p.industry.toLowerCase().includes(q);
        const inOutcome = p.outcome.toLowerCase().includes(q);
        const inChallenge = p.challenge?.toLowerCase().includes(q);
        const inCategories = p.categories.some((c) => c.toLowerCase().includes(q));
        const inScope = p.scope?.some((s) => s.toLowerCase().includes(q));

        if (!inTitle && !inClient && !inIndustry && !inOutcome && !inChallenge && !inCategories && !inScope) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, activeCategory, search]);

  const visibleProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  return (
    <div className="space-y-12">
      {/* Category Filter Chips & Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#171717] text-[#F5F1E9] font-bold shadow-xs"
                      : "bg-white text-[#555555] border border-[#E5E0D8] hover:border-[#171717] hover:text-[#171717]"
                  }`}
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input with Instant Real-Time Filtering */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-[260px] sm:w-72"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input
              type="text"
              placeholder="Search case studies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-white border border-[#E5E0D8] text-xs font-mono text-[#171717] placeholder:text-[#888888] focus-visible:outline-none focus-visible:border-[#171717]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Active Filter Indicators */}
        {(activeCategory !== "All" || search.trim()) && (
          <div className="flex items-center gap-3 text-xs font-mono text-[#777777]">
            <span>
              Showing {filteredProjects.length} result
              {filteredProjects.length === 1 ? "" : "s"}
              {search.trim() ? ` for "${search.trim()}"` : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-[#171717] underline underline-offset-2 hover:text-black cursor-pointer font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid: Editorial Masonry & Alternating Visual Rows */}
      {visibleProjects.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-4">
          <p className="font-serif text-2xl font-bold text-[#171717]">
            No case studies found
          </p>
          <p className="text-sm text-[#777777] max-w-md mx-auto">
            We couldn&apos;t find any projects matching &ldquo;{search || activeCategory}&rdquo;.
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
          >
            Clear Filters &amp; View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {visibleProjects.map((project, idx) => (
            <article
              key={project.id}
              className={`editorial-card rounded-2xl overflow-hidden flex flex-col justify-between ${
                idx % 3 === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className="space-y-4">
                <Link
                  href={`/work/${project.slug}`}
                  className="group block relative overflow-hidden bg-[#E5E0D8]"
                >
                  <div
                    className={`relative w-full overflow-hidden ${
                      idx % 3 === 0 ? "aspect-[21/9]" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </Link>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {project.categories.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#FAF8F5] border border-[#E5E0D8] text-[#555555]"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="text-xs font-mono text-[#777777]">
                      • {project.client}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] leading-snug">
                    <Link
                      href={`/work/${project.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#555555] leading-relaxed">
                    {project.outcome}
                  </p>

                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E0D8]">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="font-serif text-xl font-bold text-[#171717]">
                            {m.value}
                          </div>
                          <div className="text-[10px] font-mono text-[#777777] uppercase tracking-wider">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#171717] hover:underline underline-offset-4"
                >
                  <span>Read Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="px-8 py-3.5 rounded-full bg-white border border-[#171717] text-xs font-mono uppercase tracking-wider font-bold text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
          >
            Load More Case Studies
          </button>
        </div>
      )}
    </div>
  );
}
