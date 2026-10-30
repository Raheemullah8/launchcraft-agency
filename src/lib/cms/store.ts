import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import {
  CMSData,
  Service,
  ServiceStatus,
  PortfolioProject,
  Job,
  Application,
  ApplicationStatus,
  Lead,
  LeadType,
  LeadStatus,
  Subscriber,
  Booking,
  BookingSchedule,
  SiteSettings,
} from "./types";
import { initialCMSData } from "./initialData";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const STORE_PATH = path.join(DATA_DIR, "cms-store.json");

// Cache in memory for fast execution
let memoryData: CMSData | null = null;

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialCMSData, null, 2), "utf8");
  }
}

export async function getCMSData(): Promise<CMSData> {
  let fileData: CMSData;
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    fileData = JSON.parse(raw) as CMSData;
  } catch (error) {
    console.error("Error reading CMS store file:", error);
    fileData = JSON.parse(JSON.stringify(initialCMSData));
  }

  // Load Services dynamically from PostgreSQL
  try {
    const dbServices = await getServices(false);
    if (Array.isArray(dbServices)) {
      fileData.services = dbServices;
    }
  } catch (dbErr) {
    console.warn("Could not load services from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Projects dynamically from PostgreSQL
  try {
    const dbProjects = await getPortfolioProjects({ onlyPublished: false });
    if (Array.isArray(dbProjects)) {
      fileData.portfolio = dbProjects;
    }
  } catch (dbErr) {
    console.warn("Could not load projects from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Jobs dynamically from PostgreSQL
  try {
    const dbJobs = await getJobs(false);
    if (Array.isArray(dbJobs)) {
      fileData.jobs = dbJobs;
    }
  } catch (dbErr) {
    console.warn("Could not load jobs from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Applications dynamically from PostgreSQL
  try {
    const dbApps = await getApplications();
    if (Array.isArray(dbApps)) {
      fileData.applications = dbApps;
    }
  } catch (dbErr) {
    console.warn("Could not load applications from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Leads dynamically from PostgreSQL
  try {
    const dbLeads = await getLeads();
    if (Array.isArray(dbLeads)) {
      fileData.leads = dbLeads;
    }
  } catch (dbErr) {
    console.warn("Could not load leads from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Bookings dynamically from PostgreSQL
  try {
    const dbBookings = await getBookings();
    if (dbBookings) {
      fileData.bookings = dbBookings;
    }
  } catch (dbErr) {
    console.warn("Could not load bookings from PostgreSQL, fallback to local:", dbErr);
  }

  // Load BookingSchedule dynamically from PostgreSQL
  try {
    const dbSchedule = await getBookingSchedule();
    if (dbSchedule) {
      fileData.bookingSchedule = dbSchedule;
    }
  } catch (dbErr) {
    console.warn("Could not load booking schedule from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Subscribers dynamically from PostgreSQL
  try {
    const dbSubscribers = await getSubscribers();
    if (Array.isArray(dbSubscribers)) {
      fileData.subscribers = dbSubscribers;
    }
  } catch (dbErr) {
    console.warn("Could not load subscribers from PostgreSQL, fallback to local:", dbErr);
  }

  // Load Settings dynamically from PostgreSQL
  try {
    const dbSettings = await getSettings();
    if (dbSettings) {
      fileData.settings = dbSettings;
    }
  } catch (dbErr) {
    console.warn("Could not load settings from PostgreSQL, fallback to local:", dbErr);
  }

  memoryData = fileData;
  return fileData;
}

export async function saveCMSData(data: CMSData): Promise<void> {
  try {
    ensureDataFile();
    memoryData = data;
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing CMS store file:", error);
    memoryData = data;
  }
}

// ----------------------------------------------------
// Services (PostgreSQL / Prisma Dynamic Engine)
// ----------------------------------------------------
export async function getServices(onlyPublished: boolean = true): Promise<Service[]> {
  try {
    const list = await prisma.service.findMany({
      where: onlyPublished ? { status: "published" } : undefined,
      orderBy: { order: "asc" },
    });

    if (Array.isArray(list)) {
      return list.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        icon: s.icon,
        shortBenefit: s.shortBenefit,
        heroHeadline: s.heroHeadline,
        valueProp: s.valueProp,
        whoItHelps: s.whoItHelps || [],
        deliverables: s.deliverables || [],
        workflowSteps: (s.workflowSteps as unknown as { step: number; title: string; description: string }[]) || [],
        faqs: (s.faqs as unknown as { question: string; answer: string }[]) || [],
        order: s.order,
        status: s.status as ServiceStatus,
        metaTitle: s.metaTitle || "",
        metaDescription: s.metaDescription || "",
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching services from PostgreSQL:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  try {
    const s = await prisma.service.findUnique({
      where: { slug },
    });
    if (s) {
      return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        icon: s.icon,
        shortBenefit: s.shortBenefit,
        heroHeadline: s.heroHeadline,
        valueProp: s.valueProp,
        whoItHelps: s.whoItHelps || [],
        deliverables: s.deliverables || [],
        workflowSteps: (s.workflowSteps as unknown as { step: number; title: string; description: string }[]) || [],
        faqs: (s.faqs as unknown as { question: string; answer: string }[]) || [],
        order: s.order,
        status: s.status as ServiceStatus,
        metaTitle: s.metaTitle || "",
        metaDescription: s.metaDescription || "",
      };
    }
  } catch (error) {
    console.error("Error fetching service by slug from PostgreSQL:", error);
  }

  return undefined;
}

export async function saveService(service: Service): Promise<Service> {
  const dataToSave = {
    slug: service.slug,
    title: service.title,
    icon: service.icon || "Briefcase",
    shortBenefit: service.shortBenefit || "",
    heroHeadline: service.heroHeadline || service.title,
    valueProp: service.valueProp || "",
    whoItHelps: service.whoItHelps || [],
    deliverables: service.deliverables || [],
    workflowSteps: (service.workflowSteps as any) || [],
    faqs: (service.faqs as any) || [],
    order: Number(service.order) || 0,
    status: service.status || "published",
    metaTitle: service.metaTitle || null,
    metaDescription: service.metaDescription || null,
  };

  let savedRecord: Service;

  try {
    if (service.id && !service.id.startsWith("temp-") && !service.id.startsWith("new-") && !service.id.startsWith("srv-")) {
      const existing = await prisma.service.findUnique({ where: { id: service.id } });
      if (existing) {
        const updated = await prisma.service.update({
          where: { id: service.id },
          data: dataToSave,
        });
        savedRecord = {
          ...updated,
          status: updated.status as ServiceStatus,
          workflowSteps: (updated.workflowSteps as any) || [],
          faqs: (updated.faqs as any) || [],
          metaTitle: updated.metaTitle || "",
          metaDescription: updated.metaDescription || "",
        };
      } else {
        const upserted = await prisma.service.upsert({
          where: { slug: service.slug },
          update: dataToSave,
          create: dataToSave,
        });
        savedRecord = {
          ...upserted,
          status: upserted.status as ServiceStatus,
          workflowSteps: (upserted.workflowSteps as any) || [],
          faqs: (upserted.faqs as any) || [],
          metaTitle: upserted.metaTitle || "",
          metaDescription: upserted.metaDescription || "",
        };
      }
    } else {
      const upserted = await prisma.service.upsert({
        where: { slug: service.slug },
        update: dataToSave,
        create: dataToSave,
      });
      savedRecord = {
        ...upserted,
        status: upserted.status as ServiceStatus,
        workflowSteps: (upserted.workflowSteps as any) || [],
        faqs: (upserted.faqs as any) || [],
        metaTitle: upserted.metaTitle || "",
        metaDescription: upserted.metaDescription || "",
      };
    }
  } catch (dbError) {
    console.error("Database saveService error:", dbError);
    savedRecord = {
      ...service,
      ...dataToSave,
      id: service.id || `srv-${Date.now()}`,
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
    };
  }

  // Sync to local json file as well
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (!data.services) data.services = [];
    const idx = data.services.findIndex((s: Service) => s.id === savedRecord.id || s.slug === savedRecord.slug);
    if (idx >= 0) {
      data.services[idx] = savedRecord;
    } else {
      data.services.push(savedRecord);
    }
    await saveCMSData(data);
  } catch (err) {
    console.warn("Could not sync saved service to cms-store.json:", err);
  }

  return savedRecord;
}

export async function deleteService(id: string): Promise<void> {
  try {
    await prisma.service.delete({
      where: { id },
    });
  } catch {
    try {
      await prisma.service.delete({
        where: { slug: id },
      });
    } catch (e) {
      console.warn("Could not delete service from PostgreSQL by id or slug:", id, e);
    }
  }

  // Also remove from local json file
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (data.services) {
      data.services = data.services.filter((s: Service) => s.id !== id && s.slug !== id);
      await saveCMSData(data);
    }
  } catch (err) {
    console.warn("Could not remove service from cms-store.json:", err);
  }
}

// ----------------------------------------------------
// Portfolio
// ----------------------------------------------------
export async function getPortfolioProjects(options?: {
  category?: string;
  search?: string;
  onlyPublished?: boolean;
}): Promise<PortfolioProject[]> {
  try {
    const whereClause: any = {};

    if (options?.onlyPublished !== false) {
      whereClause.status = "published";
    }

    if (options?.category && options.category !== "All") {
      whereClause.categories = {
        has: options.category,
      };
    }

    const list = await prisma.project.findMany({
      where: whereClause,
      orderBy: { order: "asc" },
    });

    let mapped: PortfolioProject[] = list.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      industry: p.industry,
      categories: p.categories || [],
      heroImage: p.heroImage,
      gallery: p.gallery || [],
      challenge: p.challenge,
      scope: p.scope || [],
      approach: p.approach,
      outcome: p.outcome,
      metrics: (p.metrics as unknown as { label: string; value: string }[]) || [],
      featured: p.featured,
      order: p.order,
      status: p.status as "published" | "draft",
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
    }));

    if (options?.search && options.search.trim() !== "") {
      const q = options.search.toLowerCase().trim();
      mapped = mapped.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.industry.toLowerCase().includes(q) ||
          p.outcome.toLowerCase().includes(q)
      );
    }

    return mapped;
  } catch (error) {
    console.error("Error fetching projects from PostgreSQL:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  try {
    const p = await prisma.project.findUnique({
      where: { slug },
    });
    if (p) {
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        client: p.client,
        industry: p.industry,
        categories: p.categories || [],
        heroImage: p.heroImage,
        gallery: p.gallery || [],
        challenge: p.challenge,
        scope: p.scope || [],
        approach: p.approach,
        outcome: p.outcome,
        metrics: (p.metrics as unknown as { label: string; value: string }[]) || [],
        featured: p.featured,
        order: p.order,
        status: p.status as "published" | "draft",
        metaTitle: p.metaTitle || "",
        metaDescription: p.metaDescription || "",
      };
    }
  } catch (error) {
    console.error("Error fetching project by slug from PostgreSQL:", error);
  }

  return undefined;
}

export async function saveProject(project: PortfolioProject): Promise<PortfolioProject> {
  const dataToSave = {
    slug: project.slug,
    title: project.title,
    client: project.client || "Confidential Partner",
    industry: project.industry || "Technology",
    categories: project.categories || ["Branding"],
    heroImage: project.heroImage || "/images/p1.jpg",
    gallery: project.gallery || [],
    challenge: project.challenge || "",
    scope: project.scope || [],
    approach: project.approach || "",
    outcome: project.outcome || "",
    metrics: (project.metrics as any) || [],
    featured: Boolean(project.featured),
    order: Number(project.order) || 0,
    status: project.status || "published",
    metaTitle: project.metaTitle || null,
    metaDescription: project.metaDescription || null,
  };

  if (project.id && !project.id.startsWith("temp-") && !project.id.startsWith("new-")) {
    const updated = await prisma.project.upsert({
      where: { id: project.id },
      create: {
        ...dataToSave,
        id: project.id,
      },
      update: dataToSave,
    });
    return {
      ...updated,
      status: updated.status as "published" | "draft",
      metrics: (updated.metrics as any) || [],
      metaTitle: updated.metaTitle || "",
      metaDescription: updated.metaDescription || "",
    };
  } else {
    const created = await prisma.project.create({
      data: dataToSave,
    });
    return {
      ...created,
      status: created.status as "published" | "draft",
      metrics: (created.metrics as any) || [],
      metaTitle: created.metaTitle || "",
      metaDescription: created.metaDescription || "",
    };
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const existing = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });
    if (existing) {
      await prisma.project.delete({
        where: { id: existing.id },
      });
    }
    if (memoryData && Array.isArray(memoryData.portfolio)) {
      memoryData.portfolio = memoryData.portfolio.filter((p) => p.id !== id && p.slug !== id);
    }
  } catch (err) {
    console.warn("Could not delete project from PostgreSQL (may already be deleted):", err);
  }
}

// ----------------------------------------------------
// Jobs & Careers (PostgreSQL / Prisma Dynamic Engine)
// ----------------------------------------------------
export async function getJobs(onlyPublished: boolean = true): Promise<Job[]> {
  try {
    const list = await prisma.job.findMany({
      where: onlyPublished ? { status: "published" } : undefined,
      orderBy: { postedDate: "desc" },
    });

    if (Array.isArray(list)) {
      return list.map((j) => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        department: j.department,
        location: j.location,
        workArrangement: j.workArrangement as "Remote" | "Hybrid" | "On-site",
        type: j.type as "Full-time" | "Contract" | "Part-time",
        postedDate: j.postedDate ? j.postedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        summary: j.summary,
        responsibilities: j.responsibilities || [],
        qualifications: j.qualifications || [],
        deadline: j.deadline ? j.deadline.toISOString().split("T")[0] : undefined,
        status: j.status as "published" | "draft" | "closed",
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching jobs from PostgreSQL:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  try {
    const j = await prisma.job.findUnique({
      where: { slug },
    });
    if (j) {
      return {
        id: j.id,
        slug: j.slug,
        title: j.title,
        department: j.department,
        location: j.location,
        workArrangement: j.workArrangement as "Remote" | "Hybrid" | "On-site",
        type: j.type as "Full-time" | "Contract" | "Part-time",
        postedDate: j.postedDate ? j.postedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        summary: j.summary,
        responsibilities: j.responsibilities || [],
        qualifications: j.qualifications || [],
        deadline: j.deadline ? j.deadline.toISOString().split("T")[0] : undefined,
        status: j.status as "published" | "draft" | "closed",
      };
    }
  } catch (error) {
    console.error("Error fetching job by slug from PostgreSQL:", error);
  }

  return undefined;
}

export async function saveJob(job: Job): Promise<Job> {
  const dataToSave = {
    slug: job.slug,
    title: job.title,
    department: job.department,
    location: job.location,
    workArrangement: job.workArrangement || "Remote",
    type: job.type || "Full-time",
    postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
    summary: job.summary || "",
    responsibilities: job.responsibilities || [],
    qualifications: job.qualifications || [],
    deadline: job.deadline ? new Date(job.deadline) : null,
    status: job.status || "published",
  };

  let savedRecord: Job;

  try {
    if (job.id && !job.id.startsWith("temp-") && !job.id.startsWith("new-") && !job.id.startsWith("job-")) {
      const existing = await prisma.job.findUnique({ where: { id: job.id } });
      if (existing) {
        const updated = await prisma.job.update({
          where: { id: job.id },
          data: dataToSave,
        });
        savedRecord = {
          ...updated,
          workArrangement: updated.workArrangement as "Remote" | "Hybrid" | "On-site",
          type: updated.type as "Full-time" | "Contract" | "Part-time",
          postedDate: updated.postedDate.toISOString().split("T")[0],
          deadline: updated.deadline ? updated.deadline.toISOString().split("T")[0] : undefined,
          status: updated.status as "published" | "draft" | "closed",
        };
      } else {
        const upserted = await prisma.job.upsert({
          where: { slug: job.slug },
          update: dataToSave,
          create: dataToSave,
        });
        savedRecord = {
          ...upserted,
          workArrangement: upserted.workArrangement as "Remote" | "Hybrid" | "On-site",
          type: upserted.type as "Full-time" | "Contract" | "Part-time",
          postedDate: upserted.postedDate.toISOString().split("T")[0],
          deadline: upserted.deadline ? upserted.deadline.toISOString().split("T")[0] : undefined,
          status: upserted.status as "published" | "draft" | "closed",
        };
      }
    } else {
      const upserted = await prisma.job.upsert({
        where: { slug: job.slug },
        update: dataToSave,
        create: dataToSave,
      });
      savedRecord = {
        ...upserted,
        workArrangement: upserted.workArrangement as "Remote" | "Hybrid" | "On-site",
        type: upserted.type as "Full-time" | "Contract" | "Part-time",
        postedDate: upserted.postedDate.toISOString().split("T")[0],
        deadline: upserted.deadline ? upserted.deadline.toISOString().split("T")[0] : undefined,
        status: upserted.status as "published" | "draft" | "closed",
      };
    }
  } catch (dbError) {
    console.error("Database saveJob error:", dbError);
    savedRecord = {
      ...job,
      id: job.id || `job-${Date.now()}`,
    };
  }

  // Sync to local json file as well
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (!data.jobs) data.jobs = [];
    const idx = data.jobs.findIndex((j: Job) => j.id === savedRecord.id || j.slug === savedRecord.slug);
    if (idx >= 0) {
      data.jobs[idx] = savedRecord;
    } else {
      data.jobs.push(savedRecord);
    }
    await saveCMSData(data);
  } catch (err) {
    console.warn("Could not sync saved job to cms-store.json:", err);
  }

  return savedRecord;
}

export async function deleteJob(id: string): Promise<void> {
  try {
    await prisma.job.delete({
      where: { id },
    });
  } catch {
    try {
      await prisma.job.delete({
        where: { slug: id },
      });
    } catch (e) {
      console.warn("Could not delete job from PostgreSQL by id or slug:", id, e);
    }
  }

  // Also remove from local json file
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (data.jobs) {
      data.jobs = data.jobs.filter((j: Job) => j.id !== id && j.slug !== id);
      await saveCMSData(data);
    }
  } catch (err) {
    console.warn("Could not remove job from cms-store.json:", err);
  }
}

// ----------------------------------------------------
// Applications (PostgreSQL / Prisma Dynamic Engine)
// ----------------------------------------------------
export async function getApplications(options?: {
  jobId?: string;
  status?: ApplicationStatus;
  search?: string;
}): Promise<Application[]> {
  try {
    const where: Record<string, unknown> = {};
    if (options?.jobId) {
      where.jobId = options.jobId;
    }
    if (options?.status) {
      where.status = options.status;
    }

    const list = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(list)) {
      let mapped: Application[] = list.map((a) => ({
        id: a.id,
        jobId: a.jobId,
        jobTitle: a.job?.title || "Position Opening",
        candidateName: a.candidateName,
        candidateEmail: a.candidateEmail,
        candidatePhone: a.candidatePhone || undefined,
        portfolioUrl: a.portfolioUrl || undefined,
        coverNote: a.coverNote || undefined,
        cvFileName: a.cvFileName,
        cvStorageKey: a.cvStorageKey,
        consentAccepted: a.consentAccepted,
        consentTimestamp: a.consentTimestamp.toISOString(),
        status: a.status as ApplicationStatus,
        createdAt: a.createdAt.toISOString(),
      }));

      if (options?.search && options.search.trim()) {
        const q = options.search.toLowerCase().trim();
        mapped = mapped.filter(
          (app) =>
            app.candidateName.toLowerCase().includes(q) ||
            app.candidateEmail.toLowerCase().includes(q) ||
            app.jobTitle.toLowerCase().includes(q)
        );
      }

      return mapped;
    }
  } catch (error) {
    console.error("Error fetching applications from PostgreSQL:", error);
  }

  // Fallback to local json file
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    let list: Application[] = data.applications || [];
    if (options?.jobId) {
      list = list.filter((a) => a.jobId === options.jobId);
    }
    if (options?.status) {
      list = list.filter((a) => a.status === options.status);
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function getApplicationById(id: string): Promise<Application | null> {
  try {
    const a = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            department: true,
          },
        },
      },
    });
    if (a) {
      return {
        id: a.id,
        jobId: a.jobId,
        jobTitle: a.job?.title || "Position Opening",
        candidateName: a.candidateName,
        candidateEmail: a.candidateEmail,
        candidatePhone: a.candidatePhone || undefined,
        portfolioUrl: a.portfolioUrl || undefined,
        coverNote: a.coverNote || undefined,
        cvFileName: a.cvFileName,
        cvStorageKey: a.cvStorageKey,
        consentAccepted: a.consentAccepted,
        consentTimestamp: a.consentTimestamp.toISOString(),
        status: a.status as ApplicationStatus,
        createdAt: a.createdAt.toISOString(),
      };
    }
  } catch (error) {
    console.error("Error fetching application by id from PostgreSQL:", error);
  }

  try {
    const apps = await getApplications();
    return apps.find((a) => a.id === id) || null;
  } catch {
    return null;
  }
}

export async function createApplication(
  app: Omit<Application, "id" | "createdAt" | "status">
): Promise<Application> {
  let resolvedJobId = app.jobId;

  // Ensure jobId exists in PostgreSQL
  try {
    const existingJob = await prisma.job.findUnique({ where: { id: app.jobId } });
    if (!existingJob) {
      // Try finding by slug
      const jobBySlug = await prisma.job.findUnique({ where: { slug: app.jobId } });
      if (jobBySlug) {
        resolvedJobId = jobBySlug.id;
      } else {
        // Fallback to first available job if foreign key is missing
        const firstJob = await prisma.job.findFirst();
        if (firstJob) resolvedJobId = firstJob.id;
      }
    }
  } catch (lookupErr) {
    console.warn("Job lookup error during application creation:", lookupErr);
  }

  let createdApp: Application;

  try {
    const created = await prisma.application.create({
      data: {
        jobId: resolvedJobId,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail.toLowerCase().trim(),
        candidatePhone: app.candidatePhone || null,
        portfolioUrl: app.portfolioUrl || null,
        coverNote: app.coverNote || null,
        cvFileName: app.cvFileName,
        cvStorageKey: app.cvStorageKey,
        consentAccepted: Boolean(app.consentAccepted),
        consentTimestamp: app.consentTimestamp ? new Date(app.consentTimestamp) : new Date(),
        status: "New",
      },
      include: {
        job: { select: { title: true } },
      },
    });

    createdApp = {
      id: created.id,
      jobId: created.jobId,
      jobTitle: created.job?.title || app.jobTitle || "Position Opening",
      candidateName: created.candidateName,
      candidateEmail: created.candidateEmail,
      candidatePhone: created.candidatePhone || undefined,
      portfolioUrl: created.portfolioUrl || undefined,
      coverNote: created.coverNote || undefined,
      cvFileName: created.cvFileName,
      cvStorageKey: created.cvStorageKey,
      consentAccepted: created.consentAccepted,
      consentTimestamp: created.consentTimestamp.toISOString(),
      status: created.status as ApplicationStatus,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (dbError) {
    console.error("Database createApplication error, fallback to local:", dbError);
    createdApp = {
      ...app,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
  }

  // Sync to local json file as well
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (!data.applications) data.applications = [];
    data.applications.unshift(createdApp);
    await saveCMSData(data);
  } catch (err) {
    console.warn("Could not sync created application to cms-store.json:", err);
  }

  return createdApp;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<Application | null> {
  const validStatuses: ApplicationStatus[] = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid application status: ${status}`);
  }

  let updatedApp: Application | null = null;

  try {
    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: { job: { select: { title: true } } },
    });

    updatedApp = {
      id: updated.id,
      jobId: updated.jobId,
      jobTitle: updated.job?.title || "Position Opening",
      candidateName: updated.candidateName,
      candidateEmail: updated.candidateEmail,
      candidatePhone: updated.candidatePhone || undefined,
      portfolioUrl: updated.portfolioUrl || undefined,
      coverNote: updated.coverNote || undefined,
      cvFileName: updated.cvFileName,
      cvStorageKey: updated.cvStorageKey,
      consentAccepted: updated.consentAccepted,
      consentTimestamp: updated.consentTimestamp.toISOString(),
      status: updated.status as ApplicationStatus,
      createdAt: updated.createdAt.toISOString(),
    };
  } catch (dbError) {
    console.warn("Database updateApplicationStatus error, checking local store:", dbError);
  }

  // Also update local file
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (data.applications) {
      const idx = data.applications.findIndex((a: Application) => a.id === id);
      if (idx >= 0) {
        data.applications[idx].status = status;
        if (!updatedApp) updatedApp = data.applications[idx];
        await saveCMSData(data);
      }
    }
  } catch (err) {
    console.warn("Could not sync status update to cms-store.json:", err);
  }

  return updatedApp;
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    await prisma.application.delete({
      where: { id },
    });
  } catch (dbError) {
    console.warn("Could not delete application from PostgreSQL:", id, dbError);
  }

  // Also remove from local json file
  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const data = JSON.parse(raw);
    if (data.applications) {
      data.applications = data.applications.filter((a: Application) => a.id !== id);
      await saveCMSData(data);
    }
  } catch (err) {
    console.warn("Could not remove application from cms-store.json:", err);
  }
}

// ----------------------------------------------------
// Leads (Inquiries & General Contact - PostgreSQL model Lead)
// ----------------------------------------------------
export async function getLeads(options?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<Lead[]> {
  try {
    const whereClause: Record<string, unknown> = {};
    if (options?.status && options.status !== "all") {
      whereClause.status = options.status;
    }
    if (options?.type && options.type !== "all") {
      whereClause.type = options.type;
    }
    if (options?.search) {
      const q = options.search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { businessName: { contains: q, mode: "insensitive" } },
        { message: { contains: q, mode: "insensitive" } },
      ];
    }

    const dbLeads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(dbLeads)) {
      return dbLeads.map((l) => ({
        id: l.id,
        type: (l.type as LeadType) || "project_inquiry",
        name: l.name,
        businessName: l.businessName || undefined,
        email: l.email,
        phone: l.phone || undefined,
        service: l.service || undefined,
        selectedServices: l.service ? l.service.split(", ").map((s) => s.trim()).filter(Boolean) : [],
        budget: l.budget || undefined,
        budgetRange: l.budget || undefined,
        timeline: l.timeline || undefined,
        message: l.message,
        description: l.message,
        status: (l.status as LeadStatus) || "New",
        source: l.source || "website",
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }));
    }
  } catch (error) {
    console.warn("Failed to load leads from PostgreSQL, falling back to local store:", error);
  }

  // Fallback to local store
  const data = await getCMSData();
  let list = data.leads || [];
  if (options?.status && options.status !== "all") {
    list = list.filter((l) => l.status.toLowerCase() === options.status!.toLowerCase());
  }
  if (options?.type && options.type !== "all") {
    list = list.filter((l) => l.type.toLowerCase() === options.type!.toLowerCase());
  }
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.businessName && l.businessName.toLowerCase().includes(q))
    );
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    const dbLead = await prisma.lead.findUnique({
      where: { id },
    });
    if (dbLead) {
      return {
        id: dbLead.id,
        type: (dbLead.type as LeadType) || "project_inquiry",
        name: dbLead.name,
        businessName: dbLead.businessName || undefined,
        email: dbLead.email,
        phone: dbLead.phone || undefined,
        service: dbLead.service || undefined,
        selectedServices: dbLead.service ? dbLead.service.split(", ").map((s) => s.trim()).filter(Boolean) : [],
        budget: dbLead.budget || undefined,
        budgetRange: dbLead.budget || undefined,
        timeline: dbLead.timeline || undefined,
        message: dbLead.message,
        description: dbLead.message,
        status: (dbLead.status as LeadStatus) || "New",
        source: dbLead.source || "website",
        createdAt: dbLead.createdAt.toISOString(),
        updatedAt: dbLead.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch lead ${id} from PostgreSQL:`, error);
  }

  const data = await getCMSData();
  return data.leads?.find((l) => l.id === id) || null;
}

export async function createLead(
  lead: Partial<Lead> & { name: string; email: string }
): Promise<Lead> {
  const serviceVal =
    lead.service ||
    (Array.isArray(lead.selectedServices) && lead.selectedServices.length > 0
      ? lead.selectedServices.join(", ")
      : null);
  const messageVal = lead.message || lead.description || "Inquiry from website";
  const budgetVal = lead.budget || lead.budgetRange || null;
  const statusVal = lead.status || "New";
  const typeVal = lead.type || "project_inquiry";
  const sourceVal = lead.source || "website";

  try {
    const created = await prisma.lead.create({
      data: {
        type: typeVal,
        name: lead.name.trim(),
        businessName: lead.businessName ? lead.businessName.trim() : null,
        email: lead.email.trim().toLowerCase(),
        phone: lead.phone ? lead.phone.trim() : null,
        service: serviceVal,
        budget: budgetVal,
        timeline: lead.timeline ? lead.timeline.trim() : null,
        message: messageVal.trim(),
        status: statusVal,
        source: sourceVal,
      },
    });

    const resultLead: Lead = {
      id: created.id,
      type: (created.type as LeadType) || "project_inquiry",
      name: created.name,
      businessName: created.businessName || undefined,
      email: created.email,
      phone: created.phone || undefined,
      service: created.service || undefined,
      selectedServices: created.service ? created.service.split(", ").map((s) => s.trim()).filter(Boolean) : [],
      budget: created.budget || undefined,
      budgetRange: created.budget || undefined,
      timeline: created.timeline || undefined,
      message: created.message,
      description: created.message,
      status: (created.status as LeadStatus) || "New",
      source: created.source || "website",
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    // Keep memory store synced
    if (memoryData) {
      if (!memoryData.leads) memoryData.leads = [];
      memoryData.leads.unshift(resultLead);
    }

    return resultLead;
  } catch (error) {
    console.warn("Failed to create lead in PostgreSQL, falling back to local store:", error);
    const data = await getCMSData();
    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: (typeVal as LeadType) || "project_inquiry",
      name: lead.name.trim(),
      businessName: lead.businessName || undefined,
      email: lead.email.trim().toLowerCase(),
      phone: lead.phone || undefined,
      service: serviceVal || undefined,
      selectedServices: lead.selectedServices || [],
      budget: budgetVal || undefined,
      budgetRange: budgetVal || undefined,
      timeline: lead.timeline || undefined,
      message: messageVal,
      description: messageVal,
      status: (statusVal as LeadStatus) || "New",
      source: sourceVal,
      consentAccepted: lead.consentAccepted ?? true,
      consentTimestamp: lead.consentTimestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    if (!data.leads) data.leads = [];
    data.leads.unshift(newLead);
    await saveCMSData(data);
    return newLead;
  }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus | string
): Promise<Lead | null> {
  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    const mapped: Lead = {
      id: updated.id,
      type: (updated.type as LeadType) || "project_inquiry",
      name: updated.name,
      businessName: updated.businessName || undefined,
      email: updated.email,
      phone: updated.phone || undefined,
      service: updated.service || undefined,
      selectedServices: updated.service ? updated.service.split(", ").map((s) => s.trim()).filter(Boolean) : [],
      budget: updated.budget || undefined,
      budgetRange: updated.budget || undefined,
      timeline: updated.timeline || undefined,
      message: updated.message,
      description: updated.message,
      status: (updated.status as LeadStatus) || "New",
      source: updated.source || "website",
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    if (memoryData?.leads) {
      const idx = memoryData.leads.findIndex((l) => l.id === id);
      if (idx !== -1) memoryData.leads[idx] = mapped;
    }

    return mapped;
  } catch (error) {
    console.warn(`Failed to update lead status for ${id} in PostgreSQL:`, error);
  }

  const data = await getCMSData();
  const item = data.leads?.find((l) => l.id === id);
  if (!item) return null;
  item.status = status as LeadStatus;
  await saveCMSData(data);
  return item;
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    await prisma.lead.delete({
      where: { id },
    });

    if (memoryData?.leads) {
      memoryData.leads = memoryData.leads.filter((l) => l.id !== id);
    }

    return true;
  } catch (error) {
    console.warn(`Failed to delete lead ${id} from PostgreSQL:`, error);
  }

  const data = await getCMSData();
  if (!data.leads) return false;
  const initialLen = data.leads.length;
  data.leads = data.leads.filter((l) => l.id !== id);
  if (data.leads.length !== initialLen) {
    await saveCMSData(data);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// Subscribers (Newsletter - PostgreSQL model Subscriber)
// ----------------------------------------------------
export async function getSubscribers(options?: {
  active?: boolean;
  search?: string;
}): Promise<Subscriber[]> {
  try {
    const where: Record<string, unknown> = {};
    if (typeof options?.active === "boolean") {
      where.active = options.active;
    }
    if (options?.search) {
      const q = options.search.trim();
      where.email = { contains: q, mode: "insensitive" };
    }

    const list = await prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (Array.isArray(list)) {
      return list.map((s) => ({
        id: s.id,
        email: s.email,
        source: s.source || "footer",
        active: s.active,
        status: s.active ? "Active" : "Unsubscribed",
        createdAt: s.createdAt.toISOString(),
      }));
    }
  } catch (error) {
    console.warn("Failed to load subscribers from PostgreSQL, fallback to local:", error);
  }

  const data = await getCMSData();
  let list = data.subscribers || [];
  if (typeof options?.active === "boolean") {
    list = list.filter((s) => s.active === options.active);
  }
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter((s) => s.email.toLowerCase().includes(q));
  }
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createSubscriber(
  email: string,
  source: string = "footer"
): Promise<{ subscriber: Subscriber; alreadySubscribed: boolean }> {
  const normalized = email.trim().toLowerCase();

  try {
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      if (!existing.active) {
        const reactivated = await prisma.subscriber.update({
          where: { id: existing.id },
          data: { active: true },
        });
        const mapped: Subscriber = {
          id: reactivated.id,
          email: reactivated.email,
          source: reactivated.source || source,
          active: reactivated.active,
          status: "Active",
          createdAt: reactivated.createdAt.toISOString(),
        };
        if (memoryData?.subscribers) {
          const idx = memoryData.subscribers.findIndex((s) => s.id === existing.id);
          if (idx !== -1) memoryData.subscribers[idx] = mapped;
        }
        return { subscriber: mapped, alreadySubscribed: false };
      }

      return {
        subscriber: {
          id: existing.id,
          email: existing.email,
          source: existing.source || source,
          active: existing.active,
          status: "Active",
          createdAt: existing.createdAt.toISOString(),
        },
        alreadySubscribed: true,
      };
    }

    const created = await prisma.subscriber.create({
      data: {
        email: normalized,
        source,
        active: true,
      },
    });

    const newSub: Subscriber = {
      id: created.id,
      email: created.email,
      source: created.source || source,
      active: created.active,
      status: "Active",
      createdAt: created.createdAt.toISOString(),
    };

    if (memoryData) {
      if (!memoryData.subscribers) memoryData.subscribers = [];
      memoryData.subscribers.unshift(newSub);
    }

    return { subscriber: newSub, alreadySubscribed: false };
  } catch (error) {
    console.warn("Failed to create subscriber in PostgreSQL, fallback to local store:", error);
    const data = await getCMSData();
    if (!data.subscribers) data.subscribers = [];
    const localExisting = data.subscribers.find((s) => s.email.toLowerCase() === normalized);
    if (localExisting) {
      if (!localExisting.active) {
        localExisting.active = true;
        localExisting.status = "Active";
        await saveCMSData(data);
      }
      return { subscriber: localExisting, alreadySubscribed: true };
    }

    const fallbackSub: Subscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalized,
      source,
      active: true,
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    data.subscribers.unshift(fallbackSub);
    await saveCMSData(data);
    return { subscriber: fallbackSub, alreadySubscribed: false };
  }
}

export async function updateSubscriberStatus(
  id: string,
  active: boolean
): Promise<Subscriber | null> {
  try {
    const updated = await prisma.subscriber.update({
      where: { id },
      data: { active },
    });
    const mapped: Subscriber = {
      id: updated.id,
      email: updated.email,
      source: updated.source || "footer",
      active: updated.active,
      status: updated.active ? "Active" : "Unsubscribed",
      createdAt: updated.createdAt.toISOString(),
    };
    if (memoryData?.subscribers) {
      const idx = memoryData.subscribers.findIndex((s) => s.id === id);
      if (idx !== -1) memoryData.subscribers[idx] = mapped;
    }
    return mapped;
  } catch (error) {
    console.warn(`Failed to update subscriber ${id} in PostgreSQL:`, error);
  }

  const data = await getCMSData();
  const item = data.subscribers?.find((s) => s.id === id);
  if (!item) return null;
  item.active = active;
  item.status = active ? "Active" : "Unsubscribed";
  await saveCMSData(data);
  return item;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  try {
    await prisma.subscriber.delete({ where: { id } });
    if (memoryData?.subscribers) {
      memoryData.subscribers = memoryData.subscribers.filter((s) => s.id !== id);
    }
    return true;
  } catch (error) {
    console.warn(`Failed to delete subscriber ${id} from PostgreSQL:`, error);
  }

  const data = await getCMSData();
  if (!data.subscribers) return false;
  const initialLen = data.subscribers.length;
  data.subscribers = data.subscribers.filter((s) => s.id !== id);
  if (data.subscribers.length !== initialLen) {
    await saveCMSData(data);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// Site Settings (PostgreSQL model Setting)
// ----------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "site_settings" },
    });
    if (record && record.value) {
      return record.value as unknown as SiteSettings;
    }

    // Return default settings without storing into PostgreSQL
    return initialCMSData.settings;
  } catch (error) {
    console.warn("Failed to load settings from PostgreSQL, fallback to local:", error);
  }

  const data = await getCMSData();
  return data.settings || initialCMSData.settings;
}

export async function updateSettings(settings: SiteSettings): Promise<SiteSettings> {
  try {
    const upserted = await prisma.setting.upsert({
      where: { key: "site_settings" },
      update: { value: settings as any },
      create: {
        key: "site_settings",
        value: settings as any,
      },
    });

    const val = upserted.value as unknown as SiteSettings;
    if (memoryData) {
      memoryData.settings = val;
    }
    return val;
  } catch (error) {
    console.warn("Failed to update settings in PostgreSQL, fallback to local:", error);
  }

  const data = await getCMSData();
  data.settings = settings;
  await saveCMSData(data);
  return settings;
}



// ----------------------------------------------------
// Bookings & Consultation Calendar (PostgreSQL)
// ----------------------------------------------------
export async function getBookings(options?: {
  date?: string;
  status?: string;
  search?: string;
}): Promise<Booking[]> {
  try {
    const where: Record<string, unknown> = {};
    if (options?.date) where.date = options.date;
    if (options?.status && options.status !== "all") where.status = options.status;
    if (options?.search) {
      const q = options.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { businessName: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ];
    }

    const list = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return list.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      businessName: b.businessName,
      serviceInterest: b.serviceInterest,
      date: b.date,
      timeSlot: b.timeSlot,
      timezone: b.timezone,
      notes: b.notes,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Failed to load bookings from PostgreSQL:", error);
  }

  const data = await getCMSData();
  let list = data.bookings || [];
  if (options?.date) list = list.filter((b) => b.date === options.date);
  if (options?.status && options.status !== "all") list = list.filter((b) => b.status === options.status);
  return list;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const b = await prisma.booking.findUnique({ where: { id } });
    if (b) {
      return {
        id: b.id,
        name: b.name,
        email: b.email,
        businessName: b.businessName,
        serviceInterest: b.serviceInterest,
        date: b.date,
        timeSlot: b.timeSlot,
        timezone: b.timezone,
        notes: b.notes,
        status: b.status,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch booking ${id}:`, error);
  }
  const data = await getCMSData();
  return data.bookings?.find((b) => b.id === id) || null;
}

export async function createBooking(data: {
  name: string;
  email: string;
  businessName?: string | null;
  serviceInterest?: string | null;
  date: string;
  timeSlot: string;
  timezone?: string;
  notes?: string | null;
}): Promise<Booking> {
  try {
    const created = await prisma.booking.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        businessName: data.businessName?.trim() || null,
        serviceInterest: data.serviceInterest || "Consultation",
        date: data.date,
        timeSlot: data.timeSlot,
        timezone: data.timezone || "Europe/London (GMT/BST)",
        notes: data.notes?.trim() || null,
        status: "Confirmed",
      },
    });

    const mapped: Booking = {
      id: created.id,
      name: created.name,
      email: created.email,
      businessName: created.businessName,
      serviceInterest: created.serviceInterest,
      date: created.date,
      timeSlot: created.timeSlot,
      timezone: created.timezone,
      notes: created.notes,
      status: created.status,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    if (memoryData) {
      if (!memoryData.bookings) memoryData.bookings = [];
      memoryData.bookings.unshift(mapped);
    }

    return mapped;
  } catch (error) {
    console.warn("Failed to create booking in PostgreSQL, falling back to local store:", error);
    const storeData = await getCMSData();
    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
      serviceInterest: data.serviceInterest,
      date: data.date,
      timeSlot: data.timeSlot,
      timezone: data.timezone || "Europe/London (GMT/BST)",
      notes: data.notes,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };
    if (!storeData.bookings) storeData.bookings = [];
    storeData.bookings.unshift(newBooking);
    await saveCMSData(storeData);
    return newBooking;
  }
}

export async function updateBookingStatus(
  id: string,
  status: string
): Promise<Booking | null> {
  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    const mapped: Booking = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      businessName: updated.businessName,
      serviceInterest: updated.serviceInterest,
      date: updated.date,
      timeSlot: updated.timeSlot,
      timezone: updated.timezone,
      notes: updated.notes,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
    if (memoryData?.bookings) {
      const idx = memoryData.bookings.findIndex((b) => b.id === id);
      if (idx !== -1) memoryData.bookings[idx] = mapped;
    }
    return mapped;
  } catch (error) {
    console.warn(`Failed to update booking status for ${id}:`, error);
  }
  const storeData = await getCMSData();
  const item = storeData.bookings?.find((b) => b.id === id);
  if (!item) return null;
  item.status = status;
  await saveCMSData(storeData);
  return item;
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    await prisma.booking.delete({ where: { id } });
    if (memoryData?.bookings) {
      memoryData.bookings = memoryData.bookings.filter((b) => b.id !== id);
    }
    return true;
  } catch (error) {
    console.warn(`Failed to delete booking ${id}:`, error);
  }
  const storeData = await getCMSData();
  if (!storeData.bookings) return false;
  const prevLen = storeData.bookings.length;
  storeData.bookings = storeData.bookings.filter((b) => b.id !== id);
  if (storeData.bookings.length !== prevLen) {
    await saveCMSData(storeData);
    return true;
  }
  return false;
}

export async function getBookedSlotsForDate(date: string): Promise<string[]> {
  try {
    const list = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ["Confirmed", "Pending"] },
      },
      select: { timeSlot: true },
    });
    return list.map((b) => b.timeSlot);
  } catch (error) {
    console.warn("Failed to get booked slots from DB:", error);
  }
  const storeData = await getCMSData();
  return (storeData.bookings || [])
    .filter((b) => b.date === date && b.status === "Confirmed")
    .map((b) => b.timeSlot);
}

// ----------------------------------------------------
// Booking Schedule & Configuration
// ----------------------------------------------------
export async function getBookingSchedule(): Promise<BookingSchedule> {
  const defaultSchedule: BookingSchedule = initialCMSData.bookingSchedule || {
    id: "default-schedule",
    workingDays: [1, 2, 3, 4, 5],
    timeSlots: [
      "09:30 AM",
      "11:00 AM",
      "01:30 PM",
      "03:00 PM",
      "04:30 PM",
    ],
    blockedDates: [],
    durationMinutes: 30,
    maxAdvanceDays: 14,
    notice: "30-Minute Video Consultation with a Senior Executive Partner",
  };

  try {
    const found = await prisma.bookingSchedule.findUnique({
      where: { id: "default-schedule" },
    });
    if (found) {
      return {
        id: found.id,
        workingDays: found.workingDays,
        timeSlots: found.timeSlots,
        blockedDates: found.blockedDates,
        durationMinutes: found.durationMinutes,
        maxAdvanceDays: found.maxAdvanceDays,
        notice: found.notice,
        updatedAt: found.updatedAt.toISOString(),
      };
    }

    // Return default in memory without writing to database
    return defaultSchedule;
  } catch (error) {
    console.warn("Failed to fetch booking schedule from PostgreSQL, fallback to local:", error);
  }

  const storeData = await getCMSData();
  return storeData.bookingSchedule || defaultSchedule;
}

export async function saveBookingSchedule(
  update: Partial<BookingSchedule>
): Promise<BookingSchedule> {
  try {
    const upserted = await prisma.bookingSchedule.upsert({
      where: { id: "default-schedule" },
      update: {
        workingDays: update.workingDays,
        timeSlots: update.timeSlots,
        blockedDates: update.blockedDates,
        durationMinutes: update.durationMinutes,
        maxAdvanceDays: update.maxAdvanceDays,
        notice: update.notice,
      },
      create: {
        id: "default-schedule",
        workingDays: update.workingDays || [1, 2, 3, 4, 5],
        timeSlots: update.timeSlots || [
          "09:30 AM",
          "11:00 AM",
          "01:30 PM",
          "03:00 PM",
          "04:30 PM",
        ],
        blockedDates: update.blockedDates || [],
        durationMinutes: update.durationMinutes || 30,
        maxAdvanceDays: update.maxAdvanceDays || 14,
        notice: update.notice || "30-Minute Video Consultation with a Senior Executive Partner",
      },
    });

    const mapped: BookingSchedule = {
      id: upserted.id,
      workingDays: upserted.workingDays,
      timeSlots: upserted.timeSlots,
      blockedDates: upserted.blockedDates,
      durationMinutes: upserted.durationMinutes,
      maxAdvanceDays: upserted.maxAdvanceDays,
      notice: upserted.notice,
      updatedAt: upserted.updatedAt.toISOString(),
    };

    if (memoryData) {
      memoryData.bookingSchedule = mapped;
    }

    return mapped;
  } catch (error) {
    console.warn("Failed to save booking schedule in PostgreSQL:", error);
    const storeData = await getCMSData();
    const current = storeData.bookingSchedule || initialCMSData.bookingSchedule;
    const merged = { ...current, ...update };
    storeData.bookingSchedule = merged;
    await saveCMSData(storeData);
    return merged;
  }
}
