"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  Rocket,
} from "lucide-react";
import { Instagram, Linkedin } from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AGENCY_INFO, SERVICES_9_GRID } from "@/data/portfolioData";

export function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    service: "Meta Ads (Facebook & Instagram Ads)",
    message: "",
  });

  const [formState, setFormState] = React.useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
    }, 900);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      service: "Meta Ads (Facebook & Instagram Ads)",
      message: "",
    });
    setFormState("idle");
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F2F7F1] relative overflow-hidden">
      {/* Background Banner element using /images/p7.jpg */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-[#E2EBE0] shadow-xl bg-[#2C4018]">
          <div className="relative h-64 sm:h-80 w-full">
            <Image
              src="/images/p7.jpg"
              alt="Ready to Grow? Let's Launch - Launch Craft Banner"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A270F] via-[#2C4018]/85 to-transparent" />

            <div className="absolute inset-0 p-8 sm:p-12 md:p-16 flex flex-col justify-center max-w-2xl text-white">
              <Badge variant="olive" className="bg-[#1A270F] text-[#95B47C] border-[#7A9A60]/40 w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#95B47C]" />
                Zero Risk • High Upside
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F2F7F1] leading-tight mb-3">
                Ready to Grow? Let&apos;s Launch.
              </h2>
              <p className="text-sm sm:text-base text-[#E3EDE0] leading-relaxed">
                Take advantage of our <strong>$0 Agency Fees for 7 Days</strong>. We analyze your market, build your growth plan, and execute before you commit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Agency Channels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-5"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#7A9A60] block mb-1">
                Fast-Track Inquiries
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018]">
                Connect With Our Growth Strategists.
              </h3>
              <p className="text-sm text-[#526055] mt-2 leading-relaxed">
                Skip the back-and-forth. Fill out the scope below or drop us a direct message on Instagram.
              </p>
            </div>

            {/* Instagram DM Direct Card */}
            <a
              href={AGENCY_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-2xl border border-[#E2EBE0] shadow-xs flex items-center justify-between gap-4 hover:border-[#7A9A60] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#2C4018] to-[#7A9A60] flex items-center justify-center text-white shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#7A9A60]">
                    Direct Instagram DM
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#2C4018] group-hover:text-[#3D5922] transition-colors">
                    @{AGENCY_INFO.handle}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#526055] group-hover:text-[#2C4018] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Email Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E2EBE0] shadow-xs flex items-center gap-4 hover:border-[#7A9A60] transition-colors">
              <div className="h-12 w-12 rounded-xl bg-[#2C4018] flex items-center justify-center text-white shrink-0">
                <Mail className="w-5 h-5 text-[#95B47C]" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#7A9A60]">
                  Agency Email
                </div>
                <a
                  href={`mailto:${AGENCY_INFO.email}`}
                  className="text-sm sm:text-base font-bold text-[#2C4018] hover:text-[#7A9A60] transition-colors truncate block"
                >
                  {AGENCY_INFO.email}
                </a>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE0] shadow-xs">
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[#7A9A60]">
                  <Clock className="w-4 h-4" />
                  <span>Response Time</span>
                </div>
                <div className="text-sm font-bold text-[#2C4018]">
                  &lt; 12 Hours
                </div>
                <div className="text-xs text-[#526055] mt-0.5">
                  Direct strategist response
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE0] shadow-xs">
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[#7A9A60]">
                  <Rocket className="w-4 h-4" />
                  <span>Trial Period</span>
                </div>
                <div className="text-sm font-bold text-[#2C4018]">
                  7 Days $0 Fees
                </div>
                <div className="text-xs text-[#526055] mt-0.5">
                  Zero management retainer
                </div>
              </div>
            </div>

            {/* Assurance Guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#526055] bg-white/70 p-3.5 rounded-xl border border-[#E2EBE0]">
              <ShieldCheck className="w-4 h-4 text-[#7A9A60] shrink-0" />
              <span>Full confidentiality and proprietary growth blueprints guaranteed.</span>
            </div>
          </motion.div>

          {/* Right Column: Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#E2EBE0] shadow-xl relative"
          >
            {formState === "success" ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-[#E3EDE0] flex items-center justify-center text-[#2C4018] mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#7A9A60]" />
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C4018] mb-2">
                  Launch Request Received!
                </h4>
                <p className="text-sm sm:text-base text-[#526055] max-w-md mb-8">
                  Thank you, <span className="font-semibold text-[#2C4018]">{formData.name}</span>.
                  A Launch Craft partner will review your business and reach out within 12 hours with your 7-day trial strategy.
                </p>
                <Button variant="default" onClick={handleReset}>
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#2C4018]">
                    Claim Your 7-Day Free Trial
                  </h4>
                  <p className="text-xs sm:text-sm text-[#526055] mt-1">
                    Tell us about your brand and the primary service you are interested in testing with us.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-wider text-[#2C4018]"
                    >
                      Your Name / Brand *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g. Alex Morgan / Apex Studio"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-[#2C4018]"
                    >
                      Work Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@apexstudio.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="service"
                    className="text-xs font-bold uppercase tracking-wider text-[#2C4018]"
                  >
                    Select From Our 9 Core Services *
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="flex h-12 w-full rounded-xl border border-[#E2EBE0] bg-white px-4 py-3 text-sm text-[#1E293B] focus-visible:outline-none focus-visible:border-[#7A9A60] focus-visible:ring-2 focus-visible:ring-[#7A9A60]/20"
                  >
                    {SERVICES_9_GRID.map((s) => (
                      <option key={s.id} value={`${s.title} (${s.subtitle})`}>
                        {s.title} — {s.subtitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold uppercase tracking-wider text-[#2C4018]"
                  >
                    Current Business Challenges & Target Goals *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Describe your current ad spend, website, or marketing bottleneck..."
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={formState === "submitting"}
                  className="w-full justify-center shadow-md"
                >
                  {formState === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Your Scope...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Activate 7-Day $0 Agency Fees Trial</span>
                      <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
