"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Github } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PROJECTS_DATA, ProjectItem } from "@/data/portfolioData";
import { ProjectModal } from "@/components/ProjectModal";

const CATEGORIES = ["All", "Full-Stack / SaaS", "Full-Stack / E-Commerce", "Next.js / Dashboards"];

export function Projects() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [activeModalProject, setActiveModalProject] = React.useState<ProjectItem | null>(null);

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "All") return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.category.includes(selectedCategory.split(" / ")[0]));
  }, [selectedCategory]);

  return (
    <section id="projects" className="py-20 md:py-28 bg-[#F2F7F1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge variant="olive" className="mb-4">
              Featured Case Studies
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4018] tracking-tight leading-tight">
              Selected Works & Production Products.
            </h2>
            <div className="h-1 w-20 bg-[#7A9A60] rounded-full mt-4" />
          </div>

          <p className="text-base text-[#526055] max-w-md">
            Engineered with a focus on business metrics, scalability, sub-second response times, and
            editorial user interfaces.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#2C4018] text-[#F2F7F1] shadow-xs"
                  : "bg-white text-[#526055] hover:text-[#2C4018] border border-[#E2EBE0] hover:border-[#7A9A60]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <Card className="overflow-hidden flex flex-col h-full bg-white border-[#E2EBE0] hover:border-[#7A9A60] transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-[#2C4018]/10">
                {/* Visual Project Mockup Card using Next.js Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E2EBE0]">
                  <Image
                    src={project.image}
                    alt={`${project.title} Mockup Preview`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A270F]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="olive" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Hover Quick Action to Open Modal */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#1A270F]/40 backdrop-blur-2xs">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="px-5 py-2.5 rounded-full bg-white text-[#2C4018] font-semibold text-xs tracking-wide shadow-lg hover:bg-[#F2F7F1] flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 text-[#7A9A60]" />
                      <span>Deep Dive Architecture</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <CardHeader className="p-6 md:p-8 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#7A9A60] uppercase tracking-wider">
                      {project.tagline}
                    </span>
                    <span className="text-xs font-mono text-[#526055]">
                      0{idx + 1}
                    </span>
                  </div>

                  <CardTitle className="text-2xl text-[#2C4018] group-hover:text-[#3D5922] transition-colors">
                    {project.title}
                  </CardTitle>

                  <p className="text-sm text-[#526055] leading-relaxed pt-2">
                    {project.description}
                  </p>
                </CardHeader>

                <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                  {/* Key Metrics / Highlights */}
                  <div className="flex flex-wrap gap-2 py-3">
                    {project.metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2F7F1] text-[11px] font-semibold text-[#2C4018] border border-[#E2EBE0]"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#7A9A60]" />
                        {metric}
                      </span>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#E2EBE0]">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-medium text-[#526055] bg-[#F9FBF8] border border-[#E2EBE0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Card Footer with Links */}
                <CardFooter className="p-6 md:p-8 pt-0 flex items-center justify-between border-t border-[#E2EBE0]/60 mt-2">
                  <div className="flex items-center gap-3">
                    <Button asChild size="sm" variant="default">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1.5"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>

                    <Button asChild size="sm" variant="secondary">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    </Button>
                  </div>

                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-semibold text-[#2C4018] hover:text-[#7A9A60] flex items-center gap-1 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
