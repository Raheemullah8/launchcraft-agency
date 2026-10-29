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
  type: LeadType;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  subject?: string;
  selectedServices: string[];
  description: string;
  timeline?: string;
  budgetRange?: string;
  consentAccepted: boolean;
  consentTimestamp: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  consentTimestamp: string;
  status: "Active" | "Unsubscribed";
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

export interface CMSData {
  services: Service[];
  portfolio: PortfolioProject[];
  jobs: Job[];
  applications: Application[];
  leads: Lead[];
  subscribers: Subscriber[];
  settings: SiteSettings;
}

