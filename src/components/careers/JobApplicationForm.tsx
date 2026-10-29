"use client";

import * as React from "react";
import Link from "next/link";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Job } from "@/lib/cms/types";
import { trackEvent } from "@/lib/analytics";

interface JobApplicationFormProps {
  job: Job;
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
  const [candidateName, setCandidateName] = React.useState("");
  const [candidateEmail, setCandidateEmail] = React.useState("");
  const [candidatePhone, setCandidatePhone] = React.useState("");
  const [portfolioUrl, setPortfolioUrl] = React.useState("");
  const [coverNote, setCoverNote] = React.useState("");
  const [consentAccepted, setConsentAccepted] = React.useState(false);
  const [cvFile, setCvFile] = React.useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successData, setSuccessData] = React.useState<{ applicationId: string } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("CV file size exceeds the 5 MB limit.");
      setCvFile(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isValidFormat = lowerName.endsWith(".pdf") || lowerName.endsWith(".docx");
    if (!isValidFormat) {
      setErrorMsg("Please upload a PDF or DOCX file.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cvFile) {
      setErrorMsg("Please attach your CV in PDF or DOCX format.");
      return;
    }

    if (!consentAccepted) {
      setErrorMsg("You must accept the privacy policy to submit your application.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobSlug", job.slug);
      formData.append("candidateName", candidateName);
      formData.append("candidateEmail", candidateEmail);
      if (candidatePhone) formData.append("candidatePhone", candidatePhone);
      if (portfolioUrl) formData.append("portfolioUrl", portfolioUrl);
      if (coverNote) formData.append("coverNote", coverNote);
      formData.append("consentAccepted", "true");
      formData.append("cvFile", cvFile);

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSuccessData({ applicationId: data.applicationId });
      trackEvent("job_apply_success", {
        jobSlug: job.slug,
        pagePath: `/careers/${job.slug}`,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mx-auto text-[#171717]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Application Acknowledged
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#171717]">
            Thank you, {candidateName.split(" ")[0]}.
          </h3>
          <p className="text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
            Your application for <span className="font-semibold text-[#171717]">{job.title}</span> has been securely logged. Our recruitment lead reviews every CV and will reach out if there is a mutual fit.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] max-w-sm mx-auto text-xs font-mono text-[#777777]">
          Reference ID: <span className="font-bold text-[#171717]">{successData.applicationId}</span>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/careers"
            className="text-xs font-mono uppercase tracking-wider font-bold text-[#171717] hover:underline"
          >
            &larr; Return to Open Roles
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-[#777777] hover:text-[#171717]"
          >
            Agency Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E0D8] space-y-6">
      <div className="border-b border-[#E5E0D8] pb-4">
        <h3 className="font-serif text-2xl font-bold text-[#171717]">
          Direct Application
        </h3>
        <p className="text-xs text-[#777777] font-mono mt-1">
          Role: {job.title} • {job.department}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] flex items-center gap-3 text-xs text-[#C53030]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Honeypot field */}
      <input
        type="text"
        name="portfolio_company_trap"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="app-name" className="block text-xs font-mono text-[#171717]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="app-name"
            type="text"
            required
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="app-email" className="block text-xs font-mono text-[#171717]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="app-email"
            type="email"
            required
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="app-phone" className="block text-xs font-mono text-[#171717]">
            Telephone (Optional)
          </label>
          <input
            id="app-phone"
            type="tel"
            value={candidatePhone}
            onChange={(e) => setCandidatePhone(e.target.value)}
            placeholder="+44 7700 900077"
            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="app-portfolio" className="block text-xs font-mono text-[#171717]">
            Portfolio / LinkedIn URL (Optional)
          </label>
          <input
            id="app-portfolio"
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
          />
        </div>
      </div>

      {/* CV File Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-[#171717]">
          Curriculum Vitae / Resume (PDF or DOCX, max 5 MB) <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D8D2C6] hover:border-[#171717] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#FAF8F5]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFileChange}
          />
          {cvFile ? (
            <div className="flex items-center justify-center gap-2 text-sm text-[#171717] font-medium">
              <FileText className="w-5 h-5" />
              <span>{cvFile.name} ({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              <span className="text-xs text-[#777777] ml-2 underline">Click to change</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <UploadCloud className="w-7 h-7 mx-auto text-[#777777]" />
              <div className="text-xs font-mono text-[#171717] font-semibold">
                Click to browse or drop your CV here
              </div>
              <p className="text-[11px] text-[#777777]">
                Accepted: PDF, DOCX (Max file size: 5 MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cover Note */}
      <div className="space-y-1.5">
        <label htmlFor="app-note" className="block text-xs font-mono text-[#171717]">
          Brief Cover Note (Optional)
        </label>
        <textarea
          id="app-note"
          rows={3}
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          placeholder="Tell us what draws you to LaunchCraft and highlight your most relevant project experience..."
          className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3 pt-2">
        <input
          id="app-consent"
          type="checkbox"
          required
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[#D8D2C6] text-[#171717] focus:ring-[#171717] cursor-pointer"
        />
        <label htmlFor="app-consent" className="text-xs text-[#555555] leading-relaxed cursor-pointer">
          I consent to LaunchCraft processing my personal data and CV strictly for recruitment evaluation in accordance with the{" "}
          <Link href="/privacy" className="text-[#171717] underline" target="_blank">
            Privacy Policy
          </Link>
          . I understand my data is stored securely in private storage and not shared with third parties.
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-full bg-[#171717] text-white font-mono uppercase text-xs tracking-wider font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <span>{isSubmitting ? "Uploading CV & Submitting..." : "Submit Direct Application"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

