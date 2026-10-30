export type ServiceStatus = "published" | "draft";

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon: string;
  shortBenefit: string;
  heroHeadline: string;
  valueProp: string;
  whoItHelps: string[];
  deliverables: string[];
  workflowSteps: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  order: number;
  status: ServiceStatus;
  metaTitle: string;
  metaDescription: string;
}

export type ProjectCategory =
  | "All"
  | "Branding"
  | "Websites"
  | "Marketing"
  | "Social Media"
  | "SEO"
  | "Launch Campaigns"
  | "Consulting";

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  industry: string;
  categories: string[];
  heroImage: string;
  gallery: string[];
  challenge: string;
  scope: string[];
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  featured: boolean;
  order: number;
  status: "published" | "draft";
  metaTitle: string;
  metaDescription: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  workArrangement: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Contract" | "Part-time";
  postedDate: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  deadline?: string;
  status: "published" | "draft" | "closed";
}

export type ApplicationStatus =
  | "New"
  | "Reviewing"
  | "Shortlisted"
  | "Rejected"
  | "Hired";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  portfolioUrl?: string;
  coverNote?: string;
  cvFileName: string;
  cvStorageKey: string;
  consentAccepted: boolean;
  consentTimestamp: string;
  status: ApplicationStatus;
  createdAt: string;
}

export type LeadType = "general_contact" | "project_inquiry";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Closed";

export interface Lead {
  id: string;
  type: LeadType | string;
  name: string;
  businessName?: string | null;
  email: string;
  phone?: string | null;
  service?: string | null;
  selectedServices?: string[];
  budget?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
  description?: string;
  subject?: string;
  status: LeadStatus | string;
  source?: string | null;
  consentAccepted?: boolean;
  consentTimestamp?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source?: string | null;
  active: boolean;
  status?: "Active" | "Unsubscribed" | string;
  consentTimestamp?: string;
  createdAt: string;
}

export interface SiteSettings {
  agencyName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  email: string;
  phone: string;
  address: string;
  socials: { platform: string; url: string; handle: string }[];
  trustpilotUrl: string;
  trustpilotScore: number;
  trustpilotReviewCount: number;
  bookingUrl: string;
  bookingNotice: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  businessName?: string | null;
  serviceInterest?: string | null;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  timezone: string;
  notes?: string | null;
  status: "Confirmed" | "Completed" | "Cancelled" | string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingSchedule {
  id: string;
  workingDays: number[]; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
  timeSlots: string[]; // e.g. ["09:30 AM", "11:00 AM", ...]
  blockedDates: string[]; // Array of "YYYY-MM-DD"
  durationMinutes: number;
  maxAdvanceDays: number;
  notice?: string | null;
  updatedAt?: string;
}

export interface CMSData {
  services: Service[];
  portfolio: PortfolioProject[];
  jobs: Job[];
  applications: Application[];
  leads: Lead[];
  subscribers: Subscriber[];
  bookings: Booking[];
  bookingSchedule: BookingSchedule;
  settings: SiteSettings;
}

