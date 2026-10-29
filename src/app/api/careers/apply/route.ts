import { NextRequest, NextResponse } from "next/server";
import { createApplication, getJobBySlug } from "@/lib/cms/store";
import { savePrivateCVFile } from "@/lib/cms/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Honeypot spam field
    const honeypot = formData.get("portfolio_company_trap");
    if (honeypot && String(honeypot).length > 0) {
      return NextResponse.json({ success: true, message: "Application submitted." }, { status: 200 });
    }

    const jobSlug = formData.get("jobSlug") as string;
    const candidateName = formData.get("candidateName") as string;
    const candidateEmail = formData.get("candidateEmail") as string;
    const candidatePhone = formData.get("candidatePhone") as string | null;
    const portfolioUrl = formData.get("portfolioUrl") as string | null;
    const coverNote = formData.get("coverNote") as string | null;
    const consentAccepted = formData.get("consentAccepted") === "true";
    const cvFile = formData.get("cvFile") as File | null;

    // Validate Job
    if (!jobSlug) {
      return NextResponse.json({ error: "Job reference is required." }, { status: 400 });
    }
    const job = await getJobBySlug(jobSlug);
    if (!job || job.status !== "published") {
      return NextResponse.json({ error: "This position is no longer accepting applications." }, { status: 400 });
    }

    // Validate Candidate info
    if (!candidateName || candidateName.trim().length < 2) {
      return NextResponse.json({ error: "Please provide your full name." }, { status: 400 });
    }
    if (!candidateEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!consentAccepted) {
      return NextResponse.json({ error: "Privacy consent is mandatory to process job applications." }, { status: 400 });
    }

    // Validate CV File
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json({ error: "A CV file (PDF or DOCX, max 5 MB) is required." }, { status: 400 });
    }

    let storedFile;
    try {
      storedFile = await savePrivateCVFile(cvFile);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "CV file validation failed.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const app = await createApplication({
      jobId: job.id,
      jobTitle: job.title,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim().toLowerCase(),
      candidatePhone: candidatePhone ? candidatePhone.trim() : undefined,
      portfolioUrl: portfolioUrl ? portfolioUrl.trim() : undefined,
      coverNote: coverNote ? coverNote.trim() : undefined,
      cvFileName: storedFile.originalName,
      cvStorageKey: storedFile.key,
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for applying. Your application has been logged and our recruitment team will review it shortly.",
        applicationId: app.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during CV submission. Please check file format and try again." },
      { status: 500 }
    );
  }
}

