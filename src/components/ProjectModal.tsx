"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { Github } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from "@/data/portfolioData";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1A270F]/60 backdrop-blur-sm"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-[#E2EBE0] z-10 flex flex-col"
        >
          {/* Header Image */}
          <div className="relative aspect-[16/9] w-full bg-[#E2EBE0] overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A270F]/80 via-transparent to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#2C4018] hover:bg-white shadow-md transition-all"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category badge */}
            <div className="absolute bottom-4 left-6">
              <Badge variant="olive" className="text-xs">
                {project.category}
              </Badge>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018] mb-2">
                {project.title}
              </h3>
              <p className="text-base text-[#7A9A60] font-medium">
                {project.tagline}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018] mb-2">
                Project Overview & Architecture
              </h4>
              <p className="text-sm sm:text-base text-[#526055] leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Key Deliverables & Metrics */}
            <div className="bg-[#F2F7F1] p-5 rounded-2xl border border-[#E2EBE0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7A9A60]" />
                Key Achievements & Metrics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E2EBE0] text-xs font-semibold text-[#2C4018]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#7A9A60] shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C4018] mb-3">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg bg-[#F9FBF8] border border-[#E2EBE0] text-xs font-medium text-[#2C4018]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E2EBE0] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button asChild variant="default" size="default">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <span>View Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>

                <Button asChild variant="secondary" size="default">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                </Button>
              </div>

              <Button variant="ghost" onClick={onClose} size="sm">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
