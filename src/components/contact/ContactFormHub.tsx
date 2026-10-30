"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, AlertCircle, Mail, MapPin, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import { api, getApiErrorMessage } from "@/lib/api";
import { useSiteSettings } from "@/context/SettingsContext";

const CORE_SERVICES = [
  "Business Counseling",
  "Startup Support",
  "Branding Services",
  "Marketing Strategy",
  "Product Launch Consulting",
  "Website & Online Presence Setup",
];

const BUDGET_RANGES = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
  "To be defined / Flexible",
];

const TIMELINES = [
  "Immediate (Within 2 weeks)",
  "Next 30–60 days",
  "Quarter 1–2 Roadmap",
  "Flexible / Exploring options",
];

export function ContactFormHub() {
  const { settings } = useSiteSettings();
  const searchParams = useSearchParams();
  const preselectedServiceParam = searchParams.get("service") || "";

  const [formMode, setFormMode] = React.useState<"inquiry" | "general">("inquiry");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [submittedName, setSubmittedName] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      subject: "",
      selectedServices: [],
      timeline: TIMELINES[0],
      budgetRange: BUDGET_RANGES[1],
      description: "",
      consentAccepted: false as unknown as true,
    },
    mode: "onBlur",
  });

  const selectedServices = watch("selectedServices") || [];

  // Pre-select service if passed in URL query
  React.useEffect(() => {
    if (preselectedServiceParam) {
      const match = CORE_SERVICES.find(
        (s) =>
          s.toLowerCase().replace(/[^a-z0-9]/g, "-") === preselectedServiceParam.toLowerCase() ||
          s.toLowerCase().includes(preselectedServiceParam.toLowerCase())
      );
      if (match && !selectedServices.includes(match)) {
        setValue("selectedServices", [...selectedServices, match]);
      }
    }
  }, [preselectedServiceParam, selectedServices, setValue]);

  const toggleService = (srv: string) => {
    const next = selectedServices.includes(srv)
      ? selectedServices.filter((s) => s !== srv)
      : [...selectedServices, srv];
    setValue("selectedServices", next, { shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);

    try {
      await api.post("/contact", {
        type: formMode === "inquiry" ? "project_inquiry" : "general_contact",
        name: data.name,
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        subject: formMode === "general" ? data.subject : undefined,
        selectedServices: formMode === "inquiry" ? data.selectedServices : [],
        description: data.description,
        timeline: formMode === "inquiry" ? data.timeline : undefined,
        budgetRange: formMode === "inquiry" ? data.budgetRange : undefined,
        consentAccepted: true,
      });

      setSubmittedName(data.name);
      setSuccess(true);

      const eventName =
        formMode === "inquiry" ? "inquiry_submit_success" : "contact_submit_success";
      trackEvent(eventName, { pagePath: "/contact" });
    } catch (err: unknown) {
      setServerError(getApiErrorMessage(err, "Failed to deliver submission."));
    }
  };

  if (success) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mx-auto text-[#171717]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Inquiry Received
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#171717]">
            Thank you, {submittedName.split(" ")[0]}.
          </h3>
          <p className="text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
            Your inquiry has been logged in our secure partner queue. A senior partner will review your requirements and respond within 1 business day.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition-colors"
          >
            <span>Need immediate discussion? Book 30-min call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-[#777777] hover:text-[#171717] underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Coordinates Panel */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Direct Channels
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Let&apos;s evaluate your next milestone.
          </h2>
          <p className="text-sm text-[#555555] mt-3 leading-relaxed">
            Whether you require a comprehensive brand overhaul, full-funnel acquisition, or a high-performance web platform, our partners are ready to discuss.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E0D8]">
            <Mail className="w-5 h-5 text-[#171717] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
                Executive Inquiries
              </div>
              <a
                href={`mailto:${settings?.email || "inquiries@launchcraft.agency"}`}
                className="text-sm font-semibold text-[#171717] hover:underline break-all"
              >
                {settings?.email || "inquiries@launchcraft.agency"}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E0D8]">
            <MapPin className="w-5 h-5 text-[#171717] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
                London Studio
              </div>
              <p className="text-sm text-[#171717]">
                {settings?.address || "14 Berwick Street, Soho, London W1F 0PP, United Kingdom"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#E5E0D8]">
            <Clock className="w-5 h-5 text-[#171717] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
                Response Benchmark
              </div>
              <p className="text-sm text-[#171717]">
                Within 24 hours (Monday – Friday)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
          <div className="text-xs font-mono uppercase text-[#171717] font-bold">
            Zero Public Pricing Policy
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            We provide transparent, custom quotations based strictly on project architecture and deliverables. Never arbitrary markups or hidden fees.
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:col-span-7">
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E0D8] space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E0D8] pb-4">
            <button
              type="button"
              onClick={() => setFormMode("inquiry")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                formMode === "inquiry"
                  ? "bg-[#171717] text-[#F5F1E9] font-bold"
                  : "bg-transparent text-[#777777] hover:text-[#171717]"
              }`}
            >
              Project Inquiry
            </button>
            <button
              type="button"
              onClick={() => setFormMode("general")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                formMode === "general"
                  ? "bg-[#171717] text-[#F5F1E9] font-bold"
                  : "bg-transparent text-[#777777] hover:text-[#171717]"
              }`}
            >
              General Contact
            </button>
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] flex items-center gap-3 text-xs text-[#C53030]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-mono text-[#171717]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  {...register("name")}
                  placeholder="Alexander Wright"
                  className={`w-full h-11 px-3.5 rounded-lg border bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none transition-colors ${
                    errors.name
                      ? "border-red-400 focus-visible:border-red-500"
                      : "border-[#E5E0D8] focus-visible:border-[#171717]"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-mono mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-mono text-[#171717]">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register("email")}
                  placeholder="alexander@company.com"
                  className={`w-full h-11 px-3.5 rounded-lg border bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none transition-colors ${
                    errors.email
                      ? "border-red-400 focus-visible:border-red-500"
                      : "border-[#E5E0D8] focus-visible:border-[#171717]"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 font-mono mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Company */}
              <div className="space-y-1.5">
                <label htmlFor="contact-company" className="block text-xs font-mono text-[#171717]">
                  Company / Organization
                </label>
                <input
                  id="contact-company"
                  type="text"
                  {...register("businessName")}
                  placeholder="Vanguard Holdings Ltd"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="contact-phone" className="block text-xs font-mono text-[#171717]">
                  Telephone (Optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+44 20 7000 0000"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>
            </div>

            {/* General Mode Subject */}
            {formMode === "general" && (
              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="block text-xs font-mono text-[#171717]">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  {...register("subject")}
                  placeholder="General inquiry / Media / Partnership"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>
            )}

            {/* Project Inquiry Specific Fields: Services Multi-select, Budget, Timeline */}
            {formMode === "inquiry" && (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-[#171717]">
                    Interested Capabilities (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CORE_SERVICES.map((srv) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`p-3 rounded-lg text-left text-xs font-mono transition-colors border cursor-pointer ${
                            isSelected
                              ? "bg-[#171717] text-[#F5F1E9] border-[#171717] font-semibold"
                              : "bg-[#FAF8F5] text-[#555555] border-[#E5E0D8] hover:border-[#171717]"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-timeline" className="block text-xs font-mono text-[#171717]">
                      Target Timeline
                    </label>
                    <select
                      id="contact-timeline"
                      {...register("timeline")}
                      className="w-full h-11 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    >
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-budget" className="block text-xs font-mono text-[#171717]">
                      Expected Budget Range
                    </label>
                    <select
                      id="contact-budget"
                      {...register("budgetRange")}
                      className="w-full h-11 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="contact-description" className="block text-xs font-mono text-[#171717]">
                {formMode === "inquiry" ? "Project Summary & Objectives" : "Your Message"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-description"
                rows={4}
                {...register("description")}
                placeholder={
                  formMode === "inquiry"
                    ? "Briefly describe your current bottlenecks, target audience, and desired milestones..."
                    : "How can we assist you?"
                }
                className={`w-full p-3.5 rounded-lg border bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none transition-colors ${
                  errors.description
                    ? "border-red-400 focus-visible:border-red-500"
                    : "border-[#E5E0D8] focus-visible:border-[#171717]"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 font-mono mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <input
                  id="contact-consent"
                  type="checkbox"
                  {...register("consentAccepted")}
                  className="mt-1 h-4 w-4 rounded border-[#D8D2C6] text-[#171717] focus:ring-[#171717] cursor-pointer"
                />
                <label htmlFor="contact-consent" className="text-xs text-[#555555] leading-relaxed cursor-pointer">
                  I agree to LaunchCraft collecting and processing my data to respond to this request according to the{" "}
                  <Link href="/privacy" className="text-[#171717] underline" target="_blank">
                    Privacy Policy
                  </Link>
                  . No spam; strictly confidential.
                </label>
              </div>
              {errors.consentAccepted && (
                <p className="text-[11px] text-red-500 font-mono">
                  {errors.consentAccepted.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#171717] text-white font-mono uppercase text-xs tracking-wider font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? "Validating & Submitting..."
                  : formMode === "inquiry"
                  ? "Submit Project Inquiry"
                  : "Send Message"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
