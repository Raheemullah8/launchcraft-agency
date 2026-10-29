import fs from "fs";
import path from "path";
import {
  CMSData,
  Service,
  PortfolioProject,
  Job,
  Application,
  ApplicationStatus,
  Lead,
  LeadStatus,
  Subscriber,
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
  if (memoryData) return memoryData;

  try {
    ensureDataFile();
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    memoryData = JSON.parse(raw) as CMSData;
    return memoryData;
  } catch (error) {
    console.error("Error reading CMS store file:", error);
    memoryData = JSON.parse(JSON.stringify(initialCMSData));
    return memoryData!;
  }
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
// Services
// ----------------------------------------------------
export async function getServices(onlyPublished: boolean = true): Promise<Service[]> {
  const data = await getCMSData();
  let list = data.services || [];
  if (onlyPublished) {
    list = list.filter((s) => s.status === "published");
  }
  return list.sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const data = await getCMSData();
  return data.services.find((s) => s.slug === slug);
}

export async function saveService(service: Service): Promise<void> {
  const data = await getCMSData();
  const idx = data.services.findIndex((s) => s.id === service.id);
  if (idx >= 0) {
    data.services[idx] = service;
  } else {
    data.services.push(service);
  }
  await saveCMSData(data);
}

export async function deleteService(id: string): Promise<void> {
  const data = await getCMSData();
  data.services = data.services.filter((s) => s.id !== id);
  await saveCMSData(data);
}

// ----------------------------------------------------
// Portfolio
// ----------------------------------------------------
export async function getPortfolioProjects(options?: {
  category?: string;
  search?: string;
  onlyPublished?: boolean;
}): Promise<PortfolioProject[]> {
  const data = await getCMSData();
  let list = data.portfolio || [];

  if (options?.onlyPublished !== false) {
    list = list.filter((p) => p.status === "published");
  }

  if (options?.category && options.category !== "All") {
    const cat = options.category.toLowerCase();
    list = list.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === cat)
    );
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.outcome.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const data = await getCMSData();
  return data.portfolio.find((p) => p.slug === slug);
}

export async function saveProject(project: PortfolioProject): Promise<void> {
  const data = await getCMSData();
  const idx = data.portfolio.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    data.portfolio[idx] = project;
  } else {
    data.portfolio.push(project);
  }
  await saveCMSData(data);
}

export async function deleteProject(id: string): Promise<void> {
  const data = await getCMSData();
  data.portfolio = data.portfolio.filter((p) => p.id !== id);
  await saveCMSData(data);
}

// ----------------------------------------------------
// Jobs & Careers
// ----------------------------------------------------
export async function getJobs(onlyPublished: boolean = true): Promise<Job[]> {
  const data = await getCMSData();
  let list = data.jobs || [];
  if (onlyPublished) {
    list = list.filter((j) => j.status === "published");
  }
  return list;
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const data = await getCMSData();
  return data.jobs.find((j) => j.slug === slug);
}

export async function saveJob(job: Job): Promise<void> {
  const data = await getCMSData();
  const idx = data.jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    data.jobs[idx] = job;
  } else {
    data.jobs.push(job);
  }
  await saveCMSData(data);
}

export async function deleteJob(id: string): Promise<void> {
  const data = await getCMSData();
  data.jobs = data.jobs.filter((j) => j.id !== id);
  await saveCMSData(data);
}

// ----------------------------------------------------
// Applications (Careers Direct Application)
// ----------------------------------------------------
export async function getApplications(): Promise<Application[]> {
  const data = await getCMSData();
  return (data.applications || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createApplication(
  app: Omit<Application, "id" | "createdAt" | "status">
): Promise<Application> {
  const data = await getCMSData();
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  if (!data.applications) data.applications = [];
  data.applications.push(newApp);
  await saveCMSData(data);
  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<Application | null> {
  const data = await getCMSData();
  const app = data.applications.find((a) => a.id === id);
  if (!app) return null;
  app.status = status;
  await saveCMSData(data);
  return app;
}

// ----------------------------------------------------
// Leads (Inquiries & General Contact)
// ----------------------------------------------------
export async function getLeads(): Promise<Lead[]> {
  const data = await getCMSData();
  return (data.leads || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt" | "status">
): Promise<Lead> {
  const data = await getCMSData();
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  if (!data.leads) data.leads = [];
  data.leads.push(newLead);
  await saveCMSData(data);
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  const data = await getCMSData();
  const item = data.leads.find((l) => l.id === id);
  if (!item) return null;
  item.status = status;
  await saveCMSData(data);
  return item;
}

// ----------------------------------------------------
// Subscribers (Newsletter Popup)
// ----------------------------------------------------
export async function getSubscribers(): Promise<Subscriber[]> {
  const data = await getCMSData();
  return (data.subscribers || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createSubscriber(
  email: string,
  source: string = "homepage_popup"
): Promise<{ subscriber: Subscriber; alreadySubscribed: boolean }> {
  const data = await getCMSData();
  if (!data.subscribers) data.subscribers = [];
  const normalized = email.trim().toLowerCase();
  const existing = data.subscribers.find((s) => s.email.toLowerCase() === normalized);
  if (existing) {
    if (existing.status === "Unsubscribed") {
      existing.status = "Active";
      existing.consentTimestamp = new Date().toISOString();
      await saveCMSData(data);
    }
    return { subscriber: existing, alreadySubscribed: true };
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: normalized,
    source,
    consentTimestamp: new Date().toISOString(),
    status: "Active",
    createdAt: new Date().toISOString(),
  };
  data.subscribers.push(newSub);
  await saveCMSData(data);
  return { subscriber: newSub, alreadySubscribed: false };
}

// ----------------------------------------------------
// Site Settings
// ----------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  const data = await getCMSData();
  return data.settings || initialCMSData.settings;
}

export async function updateSettings(settings: SiteSettings): Promise<void> {
  const data = await getCMSData();
  data.settings = settings;
  await saveCMSData(data);
}

