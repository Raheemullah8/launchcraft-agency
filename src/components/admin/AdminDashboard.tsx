"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  LayoutDashboard,
  Layers,
  Briefcase,
  FileText,
  Users,
  Mail,
  Send,
  Settings,
  LogOut,
  ExternalLink,
  Download,
  CheckCircle2,
  RefreshCw,
  Search,
  Menu,
  X,
  Star,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import { CMSData, Service, Job, PortfolioProject, Booking, BookingSchedule, SiteSettings } from "@/lib/cms/types";
import { api, getApiErrorMessage } from "@/lib/api";

type AdminTab =
  | "overview"
  | "services"
  | "portfolio"
  | "jobs"
  | "applications"
  | "leads"
  | "bookings"
  | "subscribers"
  | "settings";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentAdminUser, setCurrentAdminUser] = React.useState<{ name?: string | null; email?: string } | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  const [cmsData, setCmsData] = React.useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = React.useState<AdminTab>("overview");
  const [loadingData, setLoadingData] = React.useState(false);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Global action confirmation popup modal state
  interface ActionModalState {
    isOpen: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    actionName?: string;
    timestamp?: string;
  }
  const [actionModal, setActionModal] = React.useState<ActionModalState | null>(null);

  // Auto-dismiss popup after 6 seconds if not manually closed
  React.useEffect(() => {
    if (actionModal?.isOpen) {
      const timer = setTimeout(() => {
        setActionModal(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [actionModal]);

  // Search filter inside active tab
  const [searchFilter, setSearchFilter] = React.useState("");
  const [appStatusFilter, setAppStatusFilter] = React.useState<string>("all");
  const [leadStatusFilter, setLeadStatusFilter] = React.useState<string>("all");
  const [bookingStatusFilter, setBookingStatusFilter] = React.useState<string>("all");
  const [subscribersStatusFilter, setSubscribersStatusFilter] = React.useState<string>("all");
  const [settingsState, setSettingsState] = React.useState<SiteSettings>(cmsData?.settings || {
    agencyName: "LaunchCraft",
    tagline: "From Idea to Impact.",
    heroHeadline: "Creative & Growth Partner for Modern Ambitious Brands.",
    heroSubheadline: "We partner with visionary founders and leadership teams to architect enduring brand identities, high-converting digital platforms, and disciplined growth campaigns.",
    email: "inquiries@launchcraft.agency",
    phone: "+44 (0) 20 7946 0192",
    address: "14 Berwick Street, Soho, London W1F 0PP",
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/launch.craft", handle: "@launch.craft" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/company/launchcraft", handle: "LaunchCraft Agency" },
      { platform: "X / Twitter", url: "https://x.com/launchcraft", handle: "@launchcraft" },
      { platform: "GitHub", url: "https://github.com/launchcraft", handle: "launchcraft" },
    ],
    trustpilotUrl: "https://www.trustpilot.com/review/launchcraft.agency",
    trustpilotScore: 4.9,
    trustpilotReviewCount: 38,
    bookingUrl: "/book",
    bookingNotice: "30-minute private consultation with an executive partner to explore your growth objectives.",
  });

  React.useEffect(() => {
    if (cmsData?.settings) {
      setSettingsState(cmsData.settings);
    }
  }, [cmsData]);
  const [newSlotText, setNewSlotText] = React.useState("");
  const [newBlockedDateText, setNewBlockedDateText] = React.useState("");
  const [scheduleState, setScheduleState] = React.useState<{
    workingDays: number[];
    timeSlots: string[];
    blockedDates: string[];
    durationMinutes: number;
    maxAdvanceDays: number;
    notice: string;
  }>({
    workingDays: [1, 2, 3, 4, 5],
    timeSlots: ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"],
    blockedDates: [],
    durationMinutes: 30,
    maxAdvanceDays: 14,
    notice: "30-Minute Video Consultation with a Senior Executive Partner",
  });

  // Sync scheduleState when cmsData arrives
  React.useEffect(() => {
    if (cmsData?.bookingSchedule) {
      setScheduleState({
        workingDays: cmsData.bookingSchedule.workingDays || [1, 2, 3, 4, 5],
        timeSlots: cmsData.bookingSchedule.timeSlots || ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"],
        blockedDates: cmsData.bookingSchedule.blockedDates || [],
        durationMinutes: cmsData.bookingSchedule.durationMinutes || 30,
        maxAdvanceDays: cmsData.bookingSchedule.maxAdvanceDays || 14,
        notice: cmsData.bookingSchedule.notice || "30-Minute Video Consultation with a Senior Executive Partner",
      });
    }
  }, [cmsData]);

  // --------------------------------------------------------------------------
  // Core Service Modal State & Handlers (PostgreSQL dynamic CRUD)
  // --------------------------------------------------------------------------
  const [serviceModalOpen, setServiceModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = React.useState({
    id: "",
    title: "",
    slug: "",
    icon: "Compass",
    order: 1,
    status: "published" as "published" | "draft",
    shortBenefit: "",
    heroHeadline: "",
    valueProp: "",
    deliverablesText: "",
    whoItHelpsText: "",
    metaTitle: "",
    metaDescription: "",
  });

  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceFormData({
      id: "",
      title: "",
      slug: "",
      icon: "Compass",
      order: (cmsData?.services?.length || 0) + 1,
      status: "published",
      shortBenefit: "",
      heroHeadline: "",
      valueProp: "",
      deliverablesText: "",
      whoItHelpsText: "",
      metaTitle: "",
      metaDescription: "",
    });
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: Service) => {
    setEditingService(srv);
    setServiceFormData({
      id: srv.id,
      title: srv.title,
      slug: srv.slug,
      icon: srv.icon || "Compass",
      order: srv.order,
      status: srv.status,
      shortBenefit: srv.shortBenefit || "",
      heroHeadline: srv.heroHeadline || "",
      valueProp: srv.valueProp || "",
      deliverablesText: (srv.deliverables || []).join("\n"),
      whoItHelpsText: (srv.whoItHelps || []).join("\n"),
      metaTitle: srv.metaTitle || "",
      metaDescription: srv.metaDescription || "",
    });
    setServiceModalOpen(true);
  };

  const handleSaveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title.trim() || !serviceFormData.slug.trim()) {
      alert("Please provide both Title and Slug for the service.");
      return;
    }

    const deliverables = serviceFormData.deliverablesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const whoItHelps = serviceFormData.whoItHelpsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Service = {
      id: serviceFormData.id || editingService?.id || "",
      title: serviceFormData.title,
      slug: serviceFormData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      icon: serviceFormData.icon,
      order: Number(serviceFormData.order) || 1,
      status: serviceFormData.status,
      shortBenefit: serviceFormData.shortBenefit,
      heroHeadline: serviceFormData.heroHeadline || serviceFormData.title,
      valueProp: serviceFormData.valueProp,
      deliverables,
      whoItHelps,
      workflowSteps: editingService?.workflowSteps || [],
      faqs: editingService?.faqs || [],
      metaTitle: serviceFormData.metaTitle,
      metaDescription: serviceFormData.metaDescription,
    };

    await performAction(
      "save_service",
      payload,
      `Service "${payload.title}" saved successfully to PostgreSQL database.`
    );
    setServiceModalOpen(false);
  };

  const handleDeleteService = async (srv: Service) => {
    if (confirm(`Are you sure you want to delete service "${srv.title}" from PostgreSQL database?`)) {
      await performAction(
        "delete_service",
        { id: srv.id },
        `Service "${srv.title}" deleted from database.`
      );
    }
  };

  // --------------------------------------------------------------------------
  // Job Vacancy Modal State & Handlers (PostgreSQL dynamic CRUD)
  // --------------------------------------------------------------------------
  const [jobModalOpen, setJobModalOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<Job | null>(null);
  const [jobFormData, setJobFormData] = React.useState({
    id: "",
    title: "",
    slug: "",
    department: "Engineering",
    location: "London, UK / Remote",
    workArrangement: "Remote" as "Remote" | "Hybrid" | "On-site",
    type: "Full-time" as "Full-time" | "Contract" | "Part-time",
    postedDate: "",
    deadline: "",
    status: "published" as "published" | "draft" | "closed",
    summary: "",
    responsibilitiesText: "",
    qualificationsText: "",
  });

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobFormData({
      id: "",
      title: "",
      slug: "",
      department: "Engineering",
      location: "London, UK / Remote",
      workArrangement: "Remote",
      type: "Full-time",
      postedDate: "",
      deadline: "",
      status: "published",
      summary: "",
      responsibilitiesText: "",
      qualificationsText: "",
    });
    setJobModalOpen(true);
  };

  const openEditJobModal = (job: Job) => {
    setEditingJob(job);
    setJobFormData({
      id: job.id,
      title: job.title,
      slug: job.slug,
      department: job.department,
      location: job.location,
      workArrangement: job.workArrangement,
      type: job.type,
      postedDate: job.postedDate || new Date().toISOString().split("T")[0],
      deadline: job.deadline || "",
      status: job.status,
      summary: job.summary,
      responsibilitiesText: (job.responsibilities || []).join("\n"),
      qualificationsText: (job.qualifications || []).join("\n"),
    });
    setJobModalOpen(true);
  };

  const handleSaveJobForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobFormData.title.trim() || !jobFormData.slug.trim()) {
      alert("Please provide both Title and Slug for the job vacancy.");
      return;
    }

    const responsibilities = jobFormData.responsibilitiesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const qualifications = jobFormData.qualificationsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Job = {
      id: jobFormData.id || editingJob?.id || "",
      title: jobFormData.title,
      slug: jobFormData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
      department: jobFormData.department,
      location: jobFormData.location,
      workArrangement: jobFormData.workArrangement,
      type: jobFormData.type,
      postedDate: jobFormData.postedDate || new Date().toISOString().split("T")[0],
      deadline: jobFormData.deadline || undefined,
      status: jobFormData.status,
      summary: jobFormData.summary,
      responsibilities,
      qualifications,
    };

    await performAction(
      "save_job",
      payload,
      `Job opening "${payload.title}" saved successfully to PostgreSQL database.`
    );
    setJobModalOpen(false);
  };

  const handleDeleteJob = async (job: Job) => {
    if (confirm(`Are you sure you want to delete job vacancy "${job.title}" from PostgreSQL database?`)) {
      await performAction(
        "delete_job",
        { id: job.id },
        `Job vacancy "${job.title}" deleted from database.`
      );
    }
  };

  // --------------------------------------------------------------------------
  // PORTFOLIO / CASE STUDIES CRUD STATE & HANDLERS
  // --------------------------------------------------------------------------
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<PortfolioProject | null>(null);
  const [projectFormData, setProjectFormData] = React.useState({
    id: "",
    title: "",
    slug: "",
    client: "",
    industry: "Technology",
    categoriesText: "Branding, Websites",
    heroImage: "/images/p1.jpg",
    galleryText: "",
    challenge: "",
    scopeText: "",
    approach: "",
    outcome: "",
    metricsText: "3.4x Pipeline Growth\n48h Launch Window",
    featured: false,
    order: 1,
    status: "published" as "published" | "draft",
    metaTitle: "",
    metaDescription: "",
  });

  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectFormData({
      id: "",
      title: "",
      slug: "",
      client: "",
      industry: "Technology",
      categoriesText: "Branding, Websites",
      heroImage: "/images/p1.jpg",
      galleryText: "",
      challenge: "",
      scopeText: "",
      approach: "",
      outcome: "",
      metricsText: "3.4x Pipeline Growth\n48h Launch Window",
      featured: false,
      order: (cmsData?.portfolio?.length || 0) + 1,
      status: "published",
      metaTitle: "",
      metaDescription: "",
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: PortfolioProject) => {
    setEditingProject(proj);
    setProjectFormData({
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      client: proj.client || "",
      industry: proj.industry || "Technology",
      categoriesText: (proj.categories || []).join(", "),
      heroImage: proj.heroImage || "/images/p1.jpg",
      galleryText: (proj.gallery || []).join("\n"),
      challenge: proj.challenge || "",
      scopeText: (proj.scope || []).join("\n"),
      approach: proj.approach || "",
      outcome: proj.outcome || "",
      metricsText: (proj.metrics || []).map((m) => `${m.value} ${m.label}`).join("\n"),
      featured: Boolean(proj.featured),
      order: proj.order || 1,
      status: proj.status || "published",
      metaTitle: proj.metaTitle || "",
      metaDescription: proj.metaDescription || "",
    });
    setProjectModalOpen(true);
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title.trim() || !projectFormData.slug.trim()) {
      alert("Please provide both Title and Slug for the case study.");
      return;
    }

    const categories = projectFormData.categoriesText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const gallery = projectFormData.galleryText
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);

    const scope = projectFormData.scopeText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const metrics = projectFormData.metricsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(" ");
        const value = parts[0] || "";
        const label = parts.slice(1).join(" ") || "Outcome";
        return { value, label };
      });

    const payload: PortfolioProject = {
      id: projectFormData.id || `temp-${Date.now()}`,
      slug: projectFormData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      title: projectFormData.title.trim(),
      client: projectFormData.client.trim() || "Confidential Partner",
      industry: projectFormData.industry.trim() || "Technology",
      categories: categories.length > 0 ? categories : ["Branding"],
      heroImage: projectFormData.heroImage.trim() || "/images/p1.jpg",
      gallery,
      challenge: projectFormData.challenge.trim(),
      scope,
      approach: projectFormData.approach.trim(),
      outcome: projectFormData.outcome.trim(),
      metrics,
      featured: projectFormData.featured,
      order: Number(projectFormData.order) || 1,
      status: projectFormData.status,
      metaTitle: projectFormData.metaTitle.trim(),
      metaDescription: projectFormData.metaDescription.trim(),
    };

    await performAction(
      "save_project",
      payload,
      editingProject
        ? `Case study "${payload.title}" updated successfully.`
        : `New case study "${payload.title}" added to portfolio.`
    );

    setProjectModalOpen(false);
  };

  const handleDeleteProject = async (proj: PortfolioProject) => {
    if (confirm(`Are you sure you want to delete case study "${proj.title}" from PostgreSQL database?`)) {
      await performAction(
        "delete_project",
        { id: proj.id },
        `Case study "${proj.title}" deleted from database.`
      );
    }
  };


  const checkAuth = React.useCallback(async () => {
    try {
      const [dataRes, authRes] = await Promise.all([
        api.get<CMSData>("/admin/data"),
        api.get<{ authenticated: boolean; user?: { name?: string | null; email?: string } }>("/admin/auth"),
      ]);

      if (dataRes.data) {
        setCmsData(dataRes.data);
        setIsAuthenticated(true);
        if (authRes.data?.user) {
          setCurrentAdminUser(authRes.data.user);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      setAuthError("Please provide both admin email and password.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await api.post<{ success: boolean; user?: { name?: string | null; email?: string } }>("/admin/auth", {
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (res.data?.success) {
        if (res.data.user) {
          setCurrentAdminUser(res.data.user);
        }
        setIsAuthenticated(true);
        await checkAuth();
      } else {
        setAuthError("Authentication failed. Please verify credentials.");
      }
    } catch (err: unknown) {
      setAuthError(getApiErrorMessage(err, "Authentication failed. Please verify credentials."));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.delete("/admin/auth");
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setCmsData(null);
    setCurrentAdminUser(null);
  };

  const performAction = async (action: string, payload: unknown, successMsg: string) => {
    try {
      setLoadingData(true);
      const res = await api.post<{ data?: CMSData }>("/admin/data", { action, payload });

      if (res.data?.data) {
        setCmsData(res.data.data);
        setActionSuccess(successMsg);
        setTimeout(() => setActionSuccess(null), 3000);

        const formattedAction = action
          .split("_")
          .map((w) => w.toUpperCase())
          .join(" ");

        setActionModal({
          isOpen: true,
          type: "success",
          title: "Operation Successful",
          message: successMsg,
          actionName: formattedAction,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error("Admin action failed:", err);
      const errMsg = getApiErrorMessage(err, "Failed to perform administrative operation.");
      setActionModal({
        isOpen: true,
        type: "error",
        title: "Operation Failed",
        message: errMsg,
        actionName: action.toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Export Subscribers as CSV
  const exportSubscribersCSV = () => {
    if (!cmsData?.subscribers || cmsData.subscribers.length === 0) {
      setActionModal({
        isOpen: true,
        type: "info",
        title: "Export Subscribers",
        message: "No newsletter subscribers found in the database to export.",
        actionName: "EXPORT CSV",
        timestamp: new Date().toLocaleTimeString(),
      });
      return;
    }
    const header = "Email,Source,Status,Created At\n";
    const rows = cmsData.subscribers
      .map((s) => `"${s.email}","${s.source}","${s.status}","${s.createdAt}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `LaunchCraft_Subscribers_${Date.now()}.csv`;
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionModal({
      isOpen: true,
      type: "success",
      title: "Subscribers Exported",
      message: `Downloaded ${cmsData.subscribers.length} newsletter subscriber records to ${filename}.`,
      actionName: "EXPORT SUBSCRIBERS CSV",
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717] text-white font-mono text-xs">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-[#999999]" />
          <span>Verifying administrative authorization...</span>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] p-4 text-[#F5F1E9] selection:bg-white selection:text-black">
        <div className="w-full max-w-md rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="text-center space-y-2.5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#171717] flex items-center justify-center mx-auto shadow-lg mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
              LAUNCHCRAFT
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242424] border border-[#333333] text-[11px] font-mono text-[#AAAAAA] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PostgreSQL User Authentication
            </div>
          </div>

          {authError && (
            <div className="p-3.5 mb-6 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CCCCCC]">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@launchcraft.agency"
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#242424] border border-[#3A3A3A] text-sm text-white placeholder:text-[#666666] focus-visible:outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CCCCCC]">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-10 pr-11 rounded-lg bg-[#242424] border border-[#3A3A3A] text-sm text-white placeholder:text-[#666666] focus-visible:outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white transition-colors cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-12 mt-2 rounded-lg bg-white text-[#171717] font-mono uppercase text-xs tracking-wider font-bold hover:bg-[#E5E0D8] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate & Unlock</span>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-[#202020] border border-[#2D2D2D] text-left text-[11px] font-mono text-[#888888] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-medium text-xs">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configured via .env</span>
            </div>
            <p className="leading-relaxed">
              Credentials are loaded from <code className="text-[#CCCCCC]">ADMIN_NAME</code>, <code className="text-[#CCCCCC]">ADMIN_EMAIL</code>, and <code className="text-[#CCCCCC]">ADMIN_PASSWORD</code> in your <code className="text-white">.env</code> file and securely stored in the PostgreSQL <code className="text-white">User</code> model.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-[#777777] hover:text-white underline underline-offset-2 transition-colors"
            >
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cmsData) return null;

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "services", label: "Core Services", icon: Layers, badge: cmsData.services.length },
    { id: "portfolio", label: "Case Studies", icon: Briefcase, badge: cmsData.portfolio.length },
    { id: "jobs", label: "Job Vacancies", icon: FileText, badge: cmsData.jobs.length },
    {
      id: "applications",
      label: "Applications",
      icon: Users,
      badge: cmsData.applications.length,
      alert: cmsData.applications.filter((a) => a.status === "New").length > 0,
    },
    {
      id: "leads",
      label: "Inquiries & Leads",
      icon: Mail,
      badge: cmsData.leads.length,
      alert: cmsData.leads.filter((l) => l.status === "New").length > 0,
    },
    {
      id: "bookings",
      label: "Consultation & Slots",
      icon: Calendar,
      badge: (cmsData.bookings || []).length,
      alert: (cmsData.bookings || []).filter((b) => b.status === "Confirmed").length > 0,
    },
    { id: "subscribers", label: "Subscribers", icon: Send, badge: cmsData.subscribers.length },
    { id: "settings", label: "Site Settings", icon: Settings },
  ];

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case "overview":
        return "Dashboard Overview";
      case "services":
        return "Core Services Manager";
      case "portfolio":
        return "Portfolio Case Studies";
      case "jobs":
        return "Careers & Vacancies";
      case "applications":
        return "Direct Job Applications";
      case "leads":
        return "Leads & Project Inquiries";
      case "bookings":
        return "Consultation & Slot Settings";
      case "subscribers":
        return "Newsletter Subscribers";
      case "settings":
        return "Global Site Configuration";
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F6F5F2] text-[#171717] font-sans">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="w-64 bg-[#141414] text-[#E0E0E0] shrink-0 border-r border-[#262626] hidden md:flex flex-col justify-between sticky top-0 h-screen z-40">
        <div className="p-6 space-y-6">
          {/* Logo & Console Badge */}
          <div className="space-y-1">
            <Link href="/admin" className="block">
              <span className="font-serif font-black text-2xl text-white tracking-tight">
                LAUNCHCRAFT
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#2B2B2B] text-[10px] font-mono uppercase tracking-wider text-[#999999]">
                CMS Console
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">Live</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setSearchFilter("");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#171717] font-bold shadow-xs"
                      : "text-[#AAAAAA] hover:bg-[#222222] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-[#171717] text-white"
                          : item.alert
                          ? "bg-emerald-500 text-black font-bold"
                          : "bg-[#2A2A2A] text-[#888888]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#262626] space-y-3 bg-[#111111]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1E1E1E] text-xs font-mono text-[#CCCCCC] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-[#777777]" />
          </a>

          <div className="flex items-center justify-between px-2 text-[11px] font-mono text-[#777777]">
            <div className="truncate max-w-[150px]">
              <span className="text-white font-medium block truncate">
                {currentAdminUser?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-[#888888] block truncate">
                {currentAdminUser?.email || "admin"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#999999] hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#141414] text-white flex flex-col justify-between p-6 z-10 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <span className="font-serif font-bold text-xl text-white">LAUNCHCRAFT</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[#888888] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setMobileSidebarOpen(false);
                        setSearchFilter("");
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider ${
                        isActive
                          ? "bg-white text-[#171717] font-bold"
                          : "text-[#CCCCCC] hover:bg-[#222222]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#262626]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
              <a href="/" target="_blank" className="text-[#AAAAAA] underline flex items-center gap-1">
                Live Site <ExternalLink className="w-3 h-3" />
              </a>
              <button onClick={handleLogout} className="text-red-400">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E5E0D8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg border border-[#E5E0D8] text-[#171717] md:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#777777]">
              <span>Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#AAAAAA]" />
              <span className="text-[#171717] font-bold">{getTabTitle(activeTab)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actionSuccess && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-medium border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {actionSuccess}
              </span>
            )}

            <button
              onClick={() => checkAuth()}
              className="p-2 rounded-lg border border-[#E5E0D8] bg-white text-[#777777] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Refresh Store Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#555555]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Storage Synced</span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="p-4 sm:p-8 space-y-8 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                    Operations Overview
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
                    Welcome back, Partner.
                  </h2>
                  <p className="text-sm text-[#555555]">
                    Real-time monitoring of project inquiries, applicants, newsletter growth, and site content.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="px-4 py-2 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Review Inquiries
                  </button>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="px-4 py-2 rounded-full bg-white border border-[#171717] text-[#171717] text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Candidate CVs
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[#777777]">
                    <span className="text-xs font-mono uppercase">Inquiries</span>
                    <Mail className="w-4 h-4 text-[#171717]" />
                  </div>
                  <div className="font-serif text-4xl font-black text-[#171717]">
                    {cmsData.leads.length}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">
                      {cmsData.leads.filter((l) => l.status === "New").length} New
                    </span>
                    <span className="text-[#888888]">
                      {cmsData.leads.filter((l) => l.status === "Qualified").length} Qualified
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[#777777]">
                    <span className="text-xs font-mono uppercase">Applications</span>
                    <Users className="w-4 h-4 text-[#171717]" />
                  </div>
                  <div className="font-serif text-4xl font-black text-[#171717]">
                    {cmsData.applications.length}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">
                      {cmsData.applications.filter((a) => a.status === "New").length} Unreviewed
                    </span>
                    <span className="text-[#888888]">
                      {cmsData.applications.filter((a) => a.status === "Shortlisted").length} Shortlisted
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[#777777]">
                    <span className="text-xs font-mono uppercase">Newsletter</span>
                    <Send className="w-4 h-4 text-[#171717]" />
                  </div>
                  <div className="font-serif text-4xl font-black text-[#171717]">
                    {cmsData.subscribers.length}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">
                      {cmsData.subscribers.filter((s) => s.status === "Active").length} Active
                    </span>
                    <span className="text-[#888888]">Direct Opt-in</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[#777777]">
                    <span className="text-xs font-mono uppercase">Case Studies</span>
                    <Briefcase className="w-4 h-4 text-[#171717]" />
                  </div>
                  <div className="font-serif text-4xl font-black text-[#171717]">
                    {cmsData.portfolio.length}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#171717] font-bold">
                      {cmsData.portfolio.filter((p) => p.featured).length} Featured
                    </span>
                    <span className="text-[#888888]">
                      {cmsData.portfolio.filter((p) => p.status === "published").length} Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual Activity Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Leads */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#171717]">
                      Recent Leads &amp; Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-xs font-mono text-[#171717] font-semibold underline"
                    >
                      View All ({cmsData.leads.length})
                    </button>
                  </div>

                  {cmsData.leads.length === 0 ? (
                    <p className="text-xs font-mono text-[#777777] py-6 text-center">
                      No inquiries logged yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#E5E0D8]">
                      {cmsData.leads.slice(0, 4).map((lead) => (
                        <div key={lead.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="font-bold text-[#171717]">
                              {lead.name} {lead.businessName && `• ${lead.businessName}`}
                            </div>
                            <p className="text-[#777777] line-clamp-1">{lead.description}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] border border-[#E5E0D8] font-semibold text-[#171717] shrink-0">
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Candidate Applications */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#171717]">
                      Direct Job Applicants
                    </h3>
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="text-xs font-mono text-[#171717] font-semibold underline"
                    >
                      View All ({cmsData.applications.length})
                    </button>
                  </div>

                  {cmsData.applications.length === 0 ? (
                    <p className="text-xs font-mono text-[#777777] py-6 text-center">
                      No applications submitted yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#E5E0D8]">
                      {cmsData.applications.slice(0, 4).map((app) => (
                        <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-[#171717]">{app.candidateName}</div>
                            <div className="text-[11px] font-mono text-[#777777]">{app.jobTitle}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/api/admin/cv/${encodeURIComponent(app.cvStorageKey)}`}
                              download
                              className="p-1.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#171717] hover:bg-black hover:text-white transition-colors"
                              title="Download CV"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] border border-[#E5E0D8]">
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

                    {/* TAB 2: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Core Services Taxonomy ({cmsData.services.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Manage practice areas, value propositions, and deliverables
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddServiceModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Service</span>
                </button>
              </div>

              {cmsData.services.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-3">
                  <Layers className="w-8 h-8 text-[#888888] mx-auto" />
                  <p className="font-serif text-lg font-bold text-[#171717]">
                    No services in database yet
                  </p>
                  <p className="text-xs font-mono text-[#777777]">
                    Click "+ Add New Service" to create your first core service in PostgreSQL.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cmsData.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-6 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col justify-between space-y-4 shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#777777]">
                            0{srv.order} • Icon: {srv.icon}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              srv.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {srv.status}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#171717]">
                          {srv.title}
                        </h3>

                        <p className="text-xs text-[#555555] leading-relaxed">
                          {srv.shortBenefit}
                        </p>

                        <div className="text-[11px] font-mono text-[#777777] pt-2 border-t border-[#E5E0D8]">
                          Deliverables: {srv.deliverables.length} items
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditServiceModal(srv)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = srv.status === "published" ? "draft" : "published";
                              performAction(
                                "save_service",
                                { ...srv, status: nextStatus },
                                `Service "${srv.title}" status changed to ${nextStatus}`
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                          >
                            {srv.status === "published" ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteService(srv)}
                            className="p-1.5 rounded-lg border border-[#E5E0D8] text-[#777777] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <a
                          href={`/services/${srv.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg border border-[#E5E0D8] text-[#777777] hover:text-[#171717]"
                          title="View Public Service Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SERVICE MODAL */}
              {serviceModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#E5E0D8] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8] bg-[#FAF8F5]">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#171717]">
                          {editingService ? `Edit Core Service: ${editingService.title}` : "+ Add New Core Service"}
                        </h3>
                        <p className="text-xs font-mono text-[#777777] mt-0.5">
                          Stores directly in PostgreSQL database with live frontend routing
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setServiceModalOpen(false)}
                        className="p-1.5 rounded-lg text-[#777777] hover:text-[#171717] hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSaveServiceForm} className="p-6 overflow-y-auto space-y-6 flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Service Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={serviceFormData.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              setServiceFormData((prev) => ({
                                ...prev,
                                title,
                                slug: !editingService
                                  ? title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
                                  : prev.slug,
                              }));
                            }}
                            placeholder="e.g. Business Counseling"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            URL Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={serviceFormData.slug}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({
                                ...prev,
                                slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
                              }))
                            }
                            placeholder="e.g. business-counseling"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] font-mono focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Icon Name
                          </label>
                          <select
                            value={serviceFormData.icon}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, icon: e.target.value }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          >
                            <option value="Compass">Compass (Advisory)</option>
                            <option value="Rocket">Rocket (Startup)</option>
                            <option value="Sparkles">Sparkles (Branding)</option>
                            <option value="TrendingUp">TrendingUp (Marketing)</option>
                            <option value="Layers">Layers (Consulting)</option>
                            <option value="Monitor">Monitor (Web Development)</option>
                            <option value="Briefcase">Briefcase (General)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={serviceFormData.order}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, order: Number(e.target.value) || 1 }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Status
                          </label>
                          <select
                            value={serviceFormData.status}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({
                                ...prev,
                                status: e.target.value as "published" | "draft",
                              }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] font-mono focus-visible:outline-none focus-visible:border-[#171717]"
                          >
                            <option value="published">Published (Live)</option>
                            <option value="draft">Draft (Private)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717] font-semibold">
                          Short Benefit (Card Subtitle)
                        </label>
                        <input
                          type="text"
                          value={serviceFormData.shortBenefit}
                          onChange={(e) =>
                            setServiceFormData((prev) => ({ ...prev, shortBenefit: e.target.value }))
                          }
                          placeholder="e.g. Strategic advisory to align business models, unit economics, and operational clarity."
                          className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717] font-semibold">
                          Hero Headline (Service Page Headline)
                        </label>
                        <input
                          type="text"
                          value={serviceFormData.heroHeadline}
                          onChange={(e) =>
                            setServiceFormData((prev) => ({ ...prev, heroHeadline: e.target.value }))
                          }
                          placeholder="e.g. Clarity Before Capital: Navigating Critical Growth Transitions"
                          className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717] font-semibold">
                          Value Proposition
                        </label>
                        <textarea
                          rows={3}
                          value={serviceFormData.valueProp}
                          onChange={(e) =>
                            setServiceFormData((prev) => ({ ...prev, valueProp: e.target.value }))
                          }
                          placeholder="Explain what transformation this service delivers to clients..."
                          className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Key Deliverables (One item per line)
                          </label>
                          <textarea
                            rows={4}
                            value={serviceFormData.deliverablesText}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, deliverablesText: e.target.value }))
                            }
                            placeholder={"Diagnostic Audit Playbook\nGo-to-Market Strategy\nExecutive Coaching Sprints"}
                            className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Who It Helps / Target Audience (One item per line)
                          </label>
                          <textarea
                            rows={4}
                            value={serviceFormData.whoItHelpsText}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, whoItHelpsText: e.target.value }))
                            }
                            placeholder={"Founders raising Seed or Series A\nEstablished SMB owners\nLeadership teams scaling up"}
                            className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E0D8]">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            SEO Meta Title
                          </label>
                          <input
                            type="text"
                            value={serviceFormData.metaTitle}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                            }
                            placeholder="e.g. Business Counseling | LaunchCraft"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            SEO Meta Description
                          </label>
                          <input
                            type="text"
                            value={serviceFormData.metaDescription}
                            onChange={(e) =>
                              setServiceFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                            }
                            placeholder="e.g. Objective strategic advisory for founders and leadership teams."
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
                        <button
                          type="button"
                          onClick={() => setServiceModalOpen(false)}
                          className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                        >
                          {editingService ? "Update Service" : "Create Service"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Case Studies &amp; Portfolio ({cmsData.portfolio.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Full CRUD management: Create, edit, feature, and delete portfolio case studies
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddProjectModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Case Study</span>
                </button>
              </div>

              {cmsData.portfolio.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-3">
                  <Briefcase className="w-8 h-8 text-[#888888] mx-auto" />
                  <p className="font-serif text-lg font-bold text-[#171717]">No Case Studies Found</p>
                  <p className="text-xs font-mono text-[#777777]">
                    Click &ldquo;+ Add New Case Study&rdquo; to publish your first portfolio item directly to PostgreSQL.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cmsData.portfolio.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col justify-between space-y-4 shadow-xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#777777]">
                            Client: <strong className="text-[#171717]">{proj.client}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-white font-bold uppercase">
                                ★ Featured
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                proj.status === "published"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {proj.status}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#171717]">
                          {proj.title}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                          {proj.categories.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] border border-[#E5E0D8] text-[#555555]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">
                          {proj.outcome || proj.challenge || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(proj)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = proj.status === "published" ? "draft" : "published";
                              performAction(
                                "save_project",
                                { ...proj, status: nextStatus },
                                `Case study status set to ${nextStatus}`
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#555555] hover:text-[#171717] transition-colors cursor-pointer"
                          >
                            {proj.status === "published" ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              performAction(
                                "save_project",
                                { ...proj, featured: !proj.featured },
                                `Project ${proj.title} ${proj.featured ? "removed from" : "marked as"} featured`
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                              proj.featured
                                ? "bg-amber-50 text-amber-900 border-amber-200"
                                : "bg-[#FAF8F5] text-[#171717] border-[#E5E0D8] hover:bg-[#171717] hover:text-white"
                            }`}
                          >
                            {proj.featured ? "Unfeature" : "Feature"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete Case Study"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <a
                          href={`/work/${proj.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg border border-[#E5E0D8] text-[#777777] hover:text-[#171717]"
                          title="View Case Study"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL: ADD / EDIT CASE STUDY */}
              {projectModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#E5E0D8] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8] bg-[#FAF8F5]">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#171717]">
                          {editingProject ? `Edit Case Study: ${editingProject.title}` : "+ Add New Case Study"}
                        </h3>
                        <p className="text-xs font-mono text-[#777777] mt-0.5">
                          Stores directly in PostgreSQL with live routing at /work/[slug]
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProjectModalOpen(false)}
                        className="p-1.5 rounded-lg text-[#777777] hover:text-[#171717] hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSaveProjectForm} className="p-6 overflow-y-auto space-y-6 flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Project Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={projectFormData.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProjectFormData((prev) => ({
                                ...prev,
                                title: val,
                                slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                              }));
                            }}
                            placeholder="e.g. Apex OS Platform Launch"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            URL Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={projectFormData.slug}
                            onChange={(e) =>
                              setProjectFormData((prev) => ({
                                ...prev,
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                              }))
                            }
                            placeholder="e.g. apex-os-platform-launch"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Client / Partner Name</label>
                          <input
                            type="text"
                            value={projectFormData.client}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, client: e.target.value }))}
                            placeholder="e.g. Apex Systems"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Industry</label>
                          <input
                            type="text"
                            value={projectFormData.industry}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, industry: e.target.value }))}
                            placeholder="e.g. Technology / Enterprise Software"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Hero Image Path / URL</label>
                          <input
                            type="text"
                            value={projectFormData.heroImage}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
                            placeholder="/images/p1.jpg"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Categories (comma separated)</label>
                          <input
                            type="text"
                            value={projectFormData.categoriesText}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, categoriesText: e.target.value }))}
                            placeholder="Branding, Websites, Strategy"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Display Order</label>
                          <input
                            type="number"
                            value={projectFormData.order}
                            onChange={(e) =>
                              setProjectFormData((prev) => ({
                                ...prev,
                                order: parseInt(e.target.value) || 1,
                              }))
                            }
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">Publication Status</label>
                          <select
                            value={projectFormData.status}
                            onChange={(e) =>
                              setProjectFormData((prev) => ({
                                ...prev,
                                status: e.target.value as "published" | "draft",
                              }))
                            }
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft (Hidden)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id="proj-featured-checkbox"
                          type="checkbox"
                          checked={projectFormData.featured}
                          onChange={(e) => setProjectFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                          className="w-4 h-4 rounded border-[#E5E0D8] text-[#171717] focus:ring-[#171717]"
                        />
                        <label htmlFor="proj-featured-checkbox" className="text-xs font-mono text-[#171717] cursor-pointer">
                          Feature this Case Study on Homepage (Featured Rail)
                        </label>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717]">The Challenge / Context</label>
                        <textarea
                          rows={2}
                          value={projectFormData.challenge}
                          onChange={(e) => setProjectFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                          placeholder="What problem or opportunity was the client facing?"
                          className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717]">Our Strategic Approach</label>
                        <textarea
                          rows={2}
                          value={projectFormData.approach}
                          onChange={(e) => setProjectFormData((prev) => ({ ...prev, approach: e.target.value }))}
                          placeholder="How did we architect the solution and execution?"
                          className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717]">Commercial Outcome &amp; Impact</label>
                        <textarea
                          rows={2}
                          value={projectFormData.outcome}
                          onChange={(e) => setProjectFormData((prev) => ({ ...prev, outcome: e.target.value }))}
                          placeholder="What quantifiable results or brand authority was achieved?"
                          className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">
                            Scope &amp; Deliverables (one per line)
                          </label>
                          <textarea
                            rows={3}
                            value={projectFormData.scopeText}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, scopeText: e.target.value }))}
                            placeholder="Visual Identity Systems&#10;Next.js Platform Architecture&#10;Go-To-Market Narrative"
                            className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717]">
                            Key Metrics (one per line, e.g. 3.4x Pipeline Growth)
                          </label>
                          <textarea
                            rows={3}
                            value={projectFormData.metricsText}
                            onChange={(e) => setProjectFormData((prev) => ({ ...prev, metricsText: e.target.value }))}
                            placeholder="3.4x Pipeline Growth&#10;48h Launch Window&#10;#1 Product of the Day"
                            className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                          />
                        </div>
                      </div>

                      {/* Modal Footer Actions */}
                      <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setProjectModalOpen(false)}
                          className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                        >
                          {editingProject ? "Update Case Study" : "Create Case Study"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: JOBS */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Open Positions &amp; Careers ({cmsData.jobs.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Manage vacancies, requirements, deadlines, and publishing status in PostgreSQL
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddJobModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Vacancy</span>
                </button>
              </div>

              {cmsData.jobs.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-3">
                  <FileText className="w-8 h-8 text-[#888888] mx-auto" />
                  <p className="font-serif text-lg font-bold text-[#171717]">
                    No open positions in database yet
                  </p>
                  <p className="text-xs font-mono text-[#777777]">
                    Click "+ Add New Vacancy" to publish your first career opening.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8] rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden shadow-xs">
                  {cmsData.jobs.map((job) => (
                    <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-[#171717]">
                            {job.title}
                          </h3>
                          <span className="text-xs font-mono text-[#777777]">
                            ({job.department} • {job.workArrangement} • {job.location})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              job.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : job.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">{job.summary}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#777777] pt-1">
                          <span>Type: {job.type}</span>
                          <span>•</span>
                          <span>Posted: {job.postedDate}</span>
                          {job.deadline && (
                            <>
                              <span>•</span>
                              <span>Deadline: {job.deadline}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>Responsibilities: {job.responsibilities?.length || 0}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditJobModal(job)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = job.status === "published" ? "closed" : "published";
                            performAction(
                              "save_job",
                              { ...job, status: nextStatus },
                              `Job "${job.title}" status changed to ${nextStatus}`
                            );
                          }}
                          className="px-3.5 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                        >
                          {job.status === "published" ? "Close Role" : "Publish Live"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job)}
                          className="p-1.5 rounded-lg border border-[#E5E0D8] text-[#777777] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Vacancy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`/careers/${job.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg border border-[#E5E0D8] text-[#777777] hover:text-[#171717]"
                          title="View Public Vacancy"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* JOB MODAL */}
              {jobModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-[#E5E0D8] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8] bg-[#FAF8F5]">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#171717]">
                          {editingJob ? `Edit Job Vacancy: ${editingJob.title}` : "+ Add New Career Vacancy"}
                        </h3>
                        <p className="text-xs font-mono text-[#777777] mt-0.5">
                          Stores directly in PostgreSQL database with live career application funnel
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setJobModalOpen(false)}
                        className="p-1.5 rounded-lg text-[#777777] hover:text-[#171717] hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSaveJobForm} className="p-6 overflow-y-auto space-y-6 flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Position Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={jobFormData.title}
                            onChange={(e) => {
                              const title = e.target.value;
                              setJobFormData((prev) => ({
                                ...prev,
                                title,
                                slug: !editingJob
                                  ? title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
                                  : prev.slug,
                              }));
                            }}
                            placeholder="e.g. Senior Brand Strategist"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            URL Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={jobFormData.slug}
                            onChange={(e) =>
                              setJobFormData((prev) => ({
                                ...prev,
                                slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
                              }))
                            }
                            placeholder="e.g. senior-brand-strategist"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] font-mono focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={jobFormData.department}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, department: e.target.value }))
                            }
                            placeholder="e.g. Strategy & Creative, Engineering, Growth"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={jobFormData.location}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, location: e.target.value }))
                            }
                            placeholder="e.g. London, UK / Remote (UK/EU)"
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Work Arrangement
                          </label>
                          <select
                            value={jobFormData.workArrangement}
                            onChange={(e) =>
                              setJobFormData((prev) => ({
                                ...prev,
                                workArrangement: e.target.value as "Remote" | "Hybrid" | "On-site",
                              }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Employment Type
                          </label>
                          <select
                            value={jobFormData.type}
                            onChange={(e) =>
                              setJobFormData((prev) => ({
                                ...prev,
                                type: e.target.value as "Full-time" | "Contract" | "Part-time",
                              }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Part-time">Part-time</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Publishing Status
                          </label>
                          <select
                            value={jobFormData.status}
                            onChange={(e) =>
                              setJobFormData((prev) => ({
                                ...prev,
                                status: e.target.value as "published" | "draft" | "closed",
                              }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] font-mono focus-visible:outline-none focus-visible:border-[#171717]"
                          >
                            <option value="published">Published (Live accepting apps)</option>
                            <option value="draft">Draft (Private)</option>
                            <option value="closed">Closed (Role filled)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Date Posted
                          </label>
                          <input
                            type="date"
                            value={jobFormData.postedDate}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, postedDate: e.target.value }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Application Deadline (Optional)
                          </label>
                          <input
                            type="date"
                            value={jobFormData.deadline}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, deadline: e.target.value }))
                            }
                            className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-[#171717] font-semibold">
                          Role Summary <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={jobFormData.summary}
                          onChange={(e) =>
                            setJobFormData((prev) => ({ ...prev, summary: e.target.value }))
                          }
                          placeholder="Brief overview of the mission and impact of this role..."
                          className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Responsibilities (One item per line)
                          </label>
                          <textarea
                            rows={5}
                            value={jobFormData.responsibilitiesText}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, responsibilitiesText: e.target.value }))
                            }
                            placeholder={"Lead technical development of client flagships\nEnforce strict WCAG 2.2 accessibility budgets\nCollaborate with visual leads on micro-typography"}
                            className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono text-[#171717] font-semibold">
                            Qualifications (One item per line)
                          </label>
                          <textarea
                            rows={5}
                            value={jobFormData.qualificationsText}
                            onChange={(e) =>
                              setJobFormData((prev) => ({ ...prev, qualificationsText: e.target.value }))
                            }
                            placeholder={"4+ years with modern Next.js / TypeScript\nDeep command of browser rendering lifecycles\nExperience building resilient headless architectures"}
                            className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                          />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
                        <button
                          type="button"
                          onClick={() => setJobModalOpen(false)}
                          className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#E5E0D8] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                        >
                          {editingJob ? "Update Vacancy" : "Create Vacancy"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: APPLICATIONS (Direct Private CV Download & Status Workflow) */}
          {activeTab === "applications" && (() => {
            const statusList = ["all", "New", "Reviewing", "Shortlisted", "Rejected", "Hired"] as const;
            const filteredApps = cmsData.applications.filter((app) => {
              const matchesStatus =
                appStatusFilter === "all" ||
                app.status.toLowerCase() === appStatusFilter.toLowerCase();
              const q = searchFilter.toLowerCase().trim();
              const matchesSearch =
                !q ||
                app.candidateName.toLowerCase().includes(q) ||
                app.candidateEmail.toLowerCase().includes(q) ||
                (app.jobTitle && app.jobTitle.toLowerCase().includes(q));
              return matchesStatus && matchesSearch;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#171717]">
                      Candidate Job Applications ({cmsData.applications.length})
                    </h2>
                    <p className="text-xs font-mono text-[#777777]">
                      Private object storage • Real-time database sync • Validated PDF/DOCX downloads
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Search candidate, email, role..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-white text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717] w-64"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {statusList.map((st) => {
                    const count =
                      st === "all"
                        ? cmsData.applications.length
                        : cmsData.applications.filter((a) => a.status.toLowerCase() === st.toLowerCase()).length;
                    const isActive = appStatusFilter.toLowerCase() === st.toLowerCase();
                    return (
                      <button
                        key={st}
                        onClick={() => setAppStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#171717] text-white font-bold"
                            : "bg-white border border-[#E5E0D8] text-[#555555] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <span>{st === "all" ? "All Applicants" : st}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isActive ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#777777]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredApps.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                    <p className="font-serif text-lg font-bold text-[#171717]">
                      No matching job applications found
                    </p>
                    <p className="text-xs text-[#777777]">
                      {cmsData.applications.length === 0
                        ? "When candidates apply through /careers/[slug], their records and CV files appear here."
                        : "Try adjusting your search terms or status filters above."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs hover:border-[#CCCCCC] transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-xl font-bold text-[#171717]">
                                {app.candidateName}
                              </h3>
                              <span className="text-xs font-mono text-[#777777]">
                                • Applying for: <strong className="text-[#171717]">{app.jobTitle || "Job ID: " + app.jobId}</strong>
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-[#888888] mt-0.5">
                              Submitted: {new Date(app.createdAt).toLocaleString()} • Ref: {app.id}
                            </p>
                          </div>

                          {/* Status Select & Delete Action */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono text-[#777777]">Status:</span>
                              <select
                                value={app.status}
                                onChange={(e) => {
                                  performAction(
                                    "update_app_status",
                                    { id: app.id, status: e.target.value },
                                    `Applicant status changed to ${e.target.value}`
                                  );
                                }}
                                className="h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#171717] cursor-pointer focus:outline-none focus:border-[#171717]"
                              >
                                {["New", "Reviewing", "Shortlisted", "Rejected", "Hired"].map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete application from ${app.candidateName}?`)) {
                                  performAction(
                                    "delete_app",
                                    { id: app.id },
                                    "Application removed from records"
                                  );
                                }
                              }}
                              className="p-2 rounded-lg border border-[#E5E0D8] text-[#999999] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[#555555]">
                          <div>
                            Email:{" "}
                            <a href={`mailto:${app.candidateEmail}`} className="text-[#171717] underline font-semibold">
                              {app.candidateEmail}
                            </a>
                          </div>
                          <div>Phone: {app.candidatePhone || "None provided"}</div>
                          <div>
                            {app.portfolioUrl ? (
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#171717] underline font-semibold inline-flex items-center gap-1"
                              >
                                Portfolio Link <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              "Portfolio: None"
                            )}
                          </div>
                        </div>

                        {app.coverNote && (
                          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#444444] italic">
                            &ldquo;{app.coverNote}&rdquo;
                          </div>
                        )}

                        {/* Download CV File */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <a
                            href={`/api/admin/cv/${encodeURIComponent(app.cvStorageKey)}`}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-black transition-colors w-fit"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Private CV ({app.cvFileName})</span>
                          </a>

                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold ${
                                app.status === "New"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : app.status === "Reviewing"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : app.status === "Shortlisted"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : app.status === "Hired"
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              Status: {app.status}
                            </span>
                            <span className="text-emerald-700">✓ Database Synced</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 6: LEADS (PostgreSQL model Lead CRUD & Workflow) */}
          {activeTab === "leads" && (() => {
            const statusList = ["all", "New", "Contacted", "Qualified", "Closed"] as const;
            const filteredLeads = cmsData.leads.filter((lead) => {
              const matchesStatus =
                leadStatusFilter === "all" ||
                lead.status.toLowerCase() === leadStatusFilter.toLowerCase();
              const q = searchFilter.toLowerCase().trim();
              const matchesSearch =
                !q ||
                lead.name.toLowerCase().includes(q) ||
                lead.email.toLowerCase().includes(q) ||
                (lead.businessName && lead.businessName.toLowerCase().includes(q)) ||
                (lead.service && lead.service.toLowerCase().includes(q)) ||
                ((lead.message || lead.description || "").toLowerCase().includes(q));
              return matchesStatus && matchesSearch;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#171717]">
                      Leads &amp; Project Inquiries ({cmsData.leads.length})
                    </h2>
                    <p className="text-xs font-mono text-[#777777]">
                      PostgreSQL model Lead • Real-time database sync • Full CRUD
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Search lead, email, business..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-white text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717] w-64"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {statusList.map((st) => {
                    const count =
                      st === "all"
                        ? cmsData.leads.length
                        : cmsData.leads.filter((l) => l.status.toLowerCase() === st.toLowerCase()).length;
                    const isActive = leadStatusFilter.toLowerCase() === st.toLowerCase();
                    return (
                      <button
                        key={st}
                        onClick={() => setLeadStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-[#171717] text-white font-bold"
                            : "bg-white border border-[#E5E0D8] text-[#555555] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <span>{st === "all" ? "All Inquiries" : st}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isActive ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#777777]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredLeads.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                    <p className="font-serif text-lg font-bold text-[#171717]">
                      No leads or inquiries found
                    </p>
                    <p className="text-xs text-[#777777]">
                      {cmsData.leads.length === 0
                        ? "Submissions from /contact and /book will be captured here in real time."
                        : "Try adjusting your search criteria or status filter above."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs hover:border-[#CCCCCC] transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-xl font-bold text-[#171717]">
                                {lead.name}
                              </h3>
                              {lead.businessName && (
                                <span className="text-xs font-mono text-[#777777]">
                                  • {lead.businessName}
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] border border-[#E5E0D8] font-bold text-[#171717]">
                                {lead.type === "project_inquiry" ? "Project Inquiry" : "General Contact"}
                              </span>
                              {lead.source && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {lead.source}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#888888] mt-0.5">
                              Received: {new Date(lead.createdAt).toLocaleString()} • Ref: {lead.id}
                            </p>
                          </div>

                          {/* Status Select & Delete Button */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono text-[#777777]">Status:</span>
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  performAction(
                                    "update_lead_status",
                                    { id: lead.id, status: e.target.value },
                                    `Lead status updated to ${e.target.value}`
                                  );
                                }}
                                className="h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#171717] cursor-pointer focus:outline-none focus:border-[#171717]"
                              >
                                {["New", "Contacted", "Qualified", "Closed"].map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete inquiry from ${lead.name}?`)) {
                                  performAction(
                                    "delete_lead",
                                    { id: lead.id },
                                    "Lead inquiry deleted from database"
                                  );
                                }
                              }}
                              className="p-2 rounded-lg border border-[#E5E0D8] text-[#999999] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#555555]">
                          <div>
                            Email:{" "}
                            <a href={`mailto:${lead.email}`} className="text-[#171717] underline font-semibold">
                              {lead.email}
                            </a>
                          </div>
                          <div>Phone: {lead.phone || "None provided"}</div>
                          <div>
                            Timeline: {lead.timeline || "N/A"} • Budget: {lead.budget || lead.budgetRange || "N/A"}
                          </div>
                        </div>

                        {/* Services tagged */}
                        {((lead.selectedServices && lead.selectedServices.length > 0) || lead.service) && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {lead.selectedServices && lead.selectedServices.length > 0
                              ? lead.selectedServices.map((s) => (
                                  <span
                                    key={s}
                                    className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#171717]"
                                  >
                                    {s}
                                  </span>
                                ))
                              : lead.service
                              ? lead.service.split(", ").map((s) => (
                                  <span
                                    key={s}
                                    className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#171717]"
                                  >
                                    {s}
                                  </span>
                                ))
                              : null}
                          </div>
                        )}

                        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#222222] leading-relaxed whitespace-pre-wrap font-sans">
                          {lead.message || lead.description}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#777777]">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold ${
                              lead.status === "New"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : lead.status === "Contacted"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : lead.status === "Qualified"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                            }`}
                          >
                            Stage: {lead.status}
                          </span>
                          <span className="text-emerald-700">✓ Database Synced</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: BOOKINGS & SLOTS SETTINGS */}
          {activeTab === "bookings" && (() => {
            const bookingsList = cmsData.bookings || [];
            const filteredBookings = bookingsList.filter((b) => {
              const matchesStatus =
                bookingStatusFilter === "all" ||
                b.status.toLowerCase() === bookingStatusFilter.toLowerCase();
              const q = searchFilter.toLowerCase().trim();
              const matchesSearch =
                !q ||
                b.name.toLowerCase().includes(q) ||
                b.email.toLowerCase().includes(q) ||
                (b.businessName && b.businessName.toLowerCase().includes(q)) ||
                (b.serviceInterest && b.serviceInterest.toLowerCase().includes(q)) ||
                b.date.includes(q) ||
                b.timeSlot.toLowerCase().includes(q);
              return matchesStatus && matchesSearch;
            });

            const dayNames = [
              { idx: 1, label: "Mon" },
              { idx: 2, label: "Tue" },
              { idx: 3, label: "Wed" },
              { idx: 4, label: "Thu" },
              { idx: 5, label: "Fri" },
              { idx: 6, label: "Sat" },
              { idx: 0, label: "Sun" },
            ];

            const toggleDay = (idx: number) => {
              setScheduleState((prev) => {
                const exists = prev.workingDays.includes(idx);
                const nextDays = exists
                  ? prev.workingDays.filter((d) => d !== idx)
                  : [...prev.workingDays, idx];
                return { ...prev, workingDays: nextDays };
              });
            };

            const addSlot = () => {
              const trimmed = newSlotText.trim();
              if (!trimmed) return;
              if (scheduleState.timeSlots.includes(trimmed)) return;
              setScheduleState((prev) => ({
                ...prev,
                timeSlots: [...prev.timeSlots, trimmed],
              }));
              setNewSlotText("");
            };

            const removeSlot = (slot: string) => {
              setScheduleState((prev) => ({
                ...prev,
                timeSlots: prev.timeSlots.filter((s) => s !== slot),
              }));
            };

            const addBlockedDate = () => {
              const d = newBlockedDateText.trim();
              if (!d) return;
              if (scheduleState.blockedDates.includes(d)) return;
              setScheduleState((prev) => ({
                ...prev,
                blockedDates: [...prev.blockedDates, d].sort(),
              }));
              setNewBlockedDateText("");
            };

            const removeBlockedDate = (d: string) => {
              setScheduleState((prev) => ({
                ...prev,
                blockedDates: prev.blockedDates.filter((date) => date !== d),
              }));
            };

            const saveSchedule = async () => {
              await performAction(
                "update_booking_schedule",
                scheduleState,
                "Consultation schedule & slots updated successfully"
              );
            };

            return (
              <div className="space-y-10">
                {/* 1. SLOTS & WORKING DAYS CONFIGURATION CARD */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#171717] flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#171717]" />
                        <span>Consultation Calendar &amp; Slots Control</span>
                      </h2>
                      <p className="text-xs font-mono text-[#777777] mt-0.5">
                        Configure working days, customizable daily time slots, duration, and blackout dates
                      </p>
                    </div>

                    <button
                      onClick={saveSchedule}
                      className="px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Save Schedule Settings</span>
                    </button>
                  </div>

                  {/* Section A: Working Days */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171717]">
                      Active Consultation Days (Open for booking)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dayNames.map(({ idx, label }) => {
                        const isChecked = scheduleState.workingDays.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleDay(idx)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-2 ${
                              isChecked
                                ? "bg-[#171717] text-white border-[#171717] shadow-2xs"
                                : "bg-[#FAF8F5] text-[#888888] border-[#E5E0D8] hover:border-[#CCCCCC]"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isChecked ? "bg-emerald-400" : "bg-[#CCCCCC]"}`} />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section B: Daily Time Slots */}
                  <div className="space-y-3 pt-2 border-t border-[#E5E0D8]">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171717]">
                      Available Time Slots ({scheduleState.timeSlots.length} active)
                    </label>
                    <p className="text-xs text-[#777777]">
                      These slots appear dynamically on the /book page. Clients can only select open slots.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {scheduleState.timeSlots.map((slot) => (
                        <div
                          key={slot}
                          className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#171717] flex items-center gap-2"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#777777]" />
                          <span>{slot}</span>
                          <button
                            type="button"
                            onClick={() => removeSlot(slot)}
                            className="text-[#999999] hover:text-rose-600 transition-colors cursor-pointer ml-1"
                            title="Remove Slot"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Slot Input */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newSlotText}
                          onChange={(e) => setNewSlotText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSlot();
                            }
                          }}
                          placeholder="e.g. 10:00 AM"
                          className="h-8 px-2.5 rounded-lg border border-[#E5E0D8] bg-white text-xs font-mono text-[#171717] w-32 focus:outline-none focus:border-[#171717]"
                        />
                        <button
                          type="button"
                          onClick={addSlot}
                          className="h-8 px-3 rounded-lg bg-[#171717] text-white text-xs font-mono font-bold hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section C: Blackout / Holiday Dates */}
                  <div className="space-y-3 pt-2 border-t border-[#E5E0D8]">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#171717]">
                      Blocked Dates / Holidays (No Consultations)
                    </label>
                    <p className="text-xs text-[#777777]">
                      Clients cannot reserve appointments on these dates (Chuttiyan / Off Days).
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {scheduleState.blockedDates.map((dateStr) => (
                        <div
                          key={dateStr}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-800 flex items-center gap-2"
                        >
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>{dateStr}</span>
                          <button
                            type="button"
                            onClick={() => removeBlockedDate(dateStr)}
                            className="text-rose-400 hover:text-rose-700 transition-colors cursor-pointer ml-1"
                            title="Unblock date"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {scheduleState.blockedDates.length === 0 && (
                        <span className="text-xs font-mono text-[#888888] italic">
                          No dates currently blocked.
                        </span>
                      )}

                      {/* Add Blocked Date Picker */}
                      <div className="flex items-center gap-1.5 ml-2">
                        <input
                          type="date"
                          value={newBlockedDateText}
                          onChange={(e) => setNewBlockedDateText(e.target.value)}
                          className="h-8 px-2.5 rounded-lg border border-[#E5E0D8] bg-white text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                        />
                        <button
                          type="button"
                          onClick={addBlockedDate}
                          className="h-8 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-[#171717] text-xs font-mono font-bold hover:bg-[#F0ECE1] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Block Date</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section D: Duration & Advance Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E5E0D8]">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-[#777777]">
                        Session Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        step="15"
                        value={scheduleState.durationMinutes}
                        onChange={(e) =>
                          setScheduleState((prev) => ({
                            ...prev,
                            durationMinutes: parseInt(e.target.value) || 30,
                          }))
                        }
                        className="w-full h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-[#777777]">
                        Max Advance Booking (Days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={scheduleState.maxAdvanceDays}
                        onChange={(e) =>
                          setScheduleState((prev) => ({
                            ...prev,
                            maxAdvanceDays: parseInt(e.target.value) || 14,
                          }))
                        }
                        className="w-full h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-[#777777]">
                        Briefing / Headline Notice
                      </label>
                      <input
                        type="text"
                        value={scheduleState.notice}
                        onChange={(e) =>
                          setScheduleState((prev) => ({
                            ...prev,
                            notice: e.target.value,
                          }))
                        }
                        placeholder="Notice shown on booking form..."
                        className="w-full h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>

                  {/* Bottom Save Action Bar */}
                  <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs font-mono text-[#777777]">
                      Changes to working days, slots, and blocked dates take effect immediately on /book.
                    </p>
                    <button
                      onClick={saveSchedule}
                      className="px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-end sm:self-auto"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Save Schedule Settings</span>
                    </button>
                  </div>
                </div>

                {/* 2. BOOKED APPOINTMENTS / SESSIONS LIST */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#171717]">
                        Booked Consultations ({bookingsList.length})
                      </h2>
                      <p className="text-xs font-mono text-[#777777]">
                        Real-time appointments booked from /book • Slots auto-locked in PostgreSQL
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="Search client, email, date..."
                          className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-white text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717] w-64"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {["all", "Confirmed", "Completed", "Cancelled"].map((st) => {
                      const count =
                        st === "all"
                          ? bookingsList.length
                          : bookingsList.filter((b) => b.status.toLowerCase() === st.toLowerCase()).length;
                      const isActive = bookingStatusFilter.toLowerCase() === st.toLowerCase();
                      return (
                        <button
                          key={st}
                          onClick={() => setBookingStatusFilter(st)}
                          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? "bg-[#171717] text-white font-bold"
                              : "bg-white border border-[#E5E0D8] text-[#555555] hover:bg-[#FAF8F5]"
                          }`}
                        >
                          <span>{st === "all" ? "All Bookings" : st}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              isActive ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#777777]"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {filteredBookings.length === 0 ? (
                    <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                      <p className="font-serif text-lg font-bold text-[#171717]">
                        No consultation bookings found
                      </p>
                      <p className="text-xs text-[#777777]">
                        {bookingsList.length === 0
                          ? "Appointments confirmed by clients on /book will appear here in real time."
                          : "Try adjusting your search criteria or status filter."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs hover:border-[#CCCCCC] transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-xl font-bold text-[#171717]">
                                  {b.name}
                                </h3>
                                {b.businessName && (
                                  <span className="text-xs font-mono text-[#777777]">
                                    • {b.businessName}
                                  </span>
                                )}
                                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                                  {b.serviceInterest || "Consultation"}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-[#888888] mt-0.5">
                                Booked on: {new Date(b.createdAt).toLocaleString()} • Ref: {b.id}
                              </p>
                            </div>

                            {/* Status Select & Cancel/Delete */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono text-[#777777]">Status:</span>
                                <select
                                  value={b.status}
                                  onChange={(e) => {
                                    performAction(
                                      "update_booking_status",
                                      { id: b.id, status: e.target.value },
                                      `Booking marked as ${e.target.value}`
                                    );
                                  }}
                                  className="h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#171717] cursor-pointer focus:outline-none focus:border-[#171717]"
                                >
                                  {["Confirmed", "Completed", "Cancelled"].map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete consultation with ${b.name}? This will free up the slot ${b.timeSlot} on ${b.date}.`)) {
                                    performAction(
                                      "delete_booking",
                                      { id: b.id },
                                      "Booking deleted and time slot liberated"
                                    );
                                  }
                                }}
                                className="p-2 rounded-lg border border-[#E5E0D8] text-[#999999] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Booking & Liberate Slot"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Appointment Time Highlight Pill */}
                          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-[#171717] flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#171717]" />
                                Date: {b.date}
                              </span>
                              <span className="text-[#888888]">•</span>
                              <span className="font-bold text-[#171717] flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                Slot: {b.timeSlot}
                              </span>
                            </div>
                            <span className="text-[#777777] text-[11px]">
                              Timezone: {b.timezone}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#555555]">
                            <div>
                              Email:{" "}
                              <a href={`mailto:${b.email}`} className="text-[#171717] underline font-semibold">
                                {b.email}
                              </a>
                            </div>
                            <div>
                              Company: {b.businessName || "Individual / Not specified"}
                            </div>
                          </div>

                          {b.notes && (
                            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#333333] leading-relaxed italic">
                              &ldquo;{b.notes}&rdquo;
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#777777]">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : b.status === "Completed"
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                              }`}
                            >
                              Status: {b.status}
                            </span>
                            <span className="text-emerald-700">✓ Real-time PostgreSQL Locked</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 7: SUBSCRIBERS (PostgreSQL model Subscriber & Export) */}
          {activeTab === "subscribers" && (() => {
            const list = cmsData.subscribers || [];
            const filteredSubs = list.filter((sub) => {
              const isActive = sub.active ?? (sub.status === "Active");
              const matchesStatus =
                subscribersStatusFilter === "all" ||
                (subscribersStatusFilter === "Active" && isActive) ||
                (subscribersStatusFilter === "Unsubscribed" && !isActive);
              const q = searchFilter.toLowerCase().trim();
              const matchesSearch = !q || sub.email.toLowerCase().includes(q) || (sub.source && sub.source.toLowerCase().includes(q));
              return matchesStatus && matchesSearch;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#171717]">
                      Newsletter Subscribers ({list.length})
                    </h2>
                    <p className="text-xs font-mono text-[#777777]">
                      PostgreSQL model Subscriber • Unique email indexing • 1-Click CSV export
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Search subscriber email..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E0E8] bg-white text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717] w-64"
                      />
                    </div>

                    {list.length > 0 && (
                      <button
                        onClick={exportSubscribersCSV}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "All Subscribers", count: list.length },
                    { id: "Active", label: "Active", count: list.filter((s) => s.active ?? (s.status === "Active")).length },
                    { id: "Unsubscribed", label: "Unsubscribed", count: list.filter((s) => !(s.active ?? (s.status === "Active"))).length },
                  ].map(({ id, label, count }) => {
                    const isSelected = subscribersStatusFilter === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setSubscribersStatusFilter(id)}
                        className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-[#171717] text-white font-bold"
                            : "bg-white border border-[#E5E0D8] text-[#555555] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <span>{label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            isSelected ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#777777]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredSubs.length === 0 ? (
                  <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                    <p className="font-serif text-lg font-bold text-[#171717]">
                      No subscribers found
                    </p>
                    <p className="text-xs text-[#777777]">
                      {list.length === 0
                        ? "When visitors subscribe via the popup or footer, their emails appear here in real time."
                        : "Try adjusting your search criteria or filter above."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E0D8] rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden shadow-xs">
                    {filteredSubs.map((sub) => {
                      const isActive = sub.active ?? (sub.status === "Active");
                      return (
                        <div
                          key={sub.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono hover:bg-[#FAF8F5] transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#171717] text-sm">{sub.email}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  isActive
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                                }`}
                              >
                                {isActive ? "Active" : "Unsubscribed"}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#777777] mt-0.5">
                              Source: {sub.source || "footer"} • Joined: {new Date(sub.createdAt).toLocaleDateString()} • Ref: {sub.id}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Toggle Active / Unsubscribe */}
                            <button
                              type="button"
                              onClick={() => {
                                performAction(
                                  "update_subscriber_status",
                                  { id: sub.id, active: !isActive },
                                  isActive ? "Subscriber marked as Unsubscribed" : "Subscriber reactivated"
                                );
                              }}
                              className="px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-white text-[#444444] text-[11px] font-mono hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            >
                              {isActive ? "Mark Inactive" : "Reactivate"}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete ${sub.email}?`)) {
                                  performAction(
                                    "delete_subscriber",
                                    { id: sub.id },
                                    "Subscriber deleted from database"
                                  );
                                }
                              }}
                              className="p-1.5 rounded-lg border border-[#E5E0D8] text-[#999999] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 8: SITE SETTINGS (PostgreSQL model Setting - Global Configuration) */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Global Site &amp; Agency Configuration
                  </h2>
                  <p className="text-xs font-mono text-[#777777] mt-0.5">
                    PostgreSQL model Setting • Real-time persistence across headers, footers, meta, and booking notices
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    performAction(
                      "update_settings",
                      settingsState,
                      "Global agency settings saved to PostgreSQL"
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Configuration</span>
                </button>
              </div>

              <div className="space-y-8">
                {/* 1. Brand & Positioning */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E0D8] pb-2">
                    Brand &amp; Identity
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Agency Name
                      </label>
                      <input
                        type="text"
                        value={settingsState.agencyName}
                        onChange={(e) => setSettingsState({ ...settingsState, agencyName: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Tagline / Motto
                      </label>
                      <input
                        type="text"
                        value={settingsState.tagline}
                        onChange={(e) => setSettingsState({ ...settingsState, tagline: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Homepage Hero Headline
                    </label>
                    <input
                      type="text"
                      value={settingsState.heroHeadline}
                      onChange={(e) => setSettingsState({ ...settingsState, heroHeadline: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Homepage Hero Subheadline
                    </label>
                    <textarea
                      rows={3}
                      value={settingsState.heroSubheadline}
                      onChange={(e) => setSettingsState({ ...settingsState, heroSubheadline: e.target.value })}
                      className="w-full p-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>
                </div>

                {/* 2. Studio Contact Details */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E0D8] pb-2">
                    Studio &amp; Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Primary Inquiries Email
                      </label>
                      <input
                        type="email"
                        value={settingsState.email}
                        onChange={(e) => setSettingsState({ ...settingsState, email: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Studio Phone Number
                      </label>
                      <input
                        type="text"
                        value={settingsState.phone}
                        onChange={(e) => setSettingsState({ ...settingsState, phone: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Physical Studio Address
                    </label>
                    <input
                      type="text"
                      value={settingsState.address}
                      onChange={(e) => setSettingsState({ ...settingsState, address: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>
                </div>

                {/* 3. Trustpilot & Social Proof */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E0D8] pb-2">
                    Trustpilot &amp; Reputation Badges
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Official Trustpilot Profile URL
                    </label>
                    <input
                      type="url"
                      value={settingsState.trustpilotUrl}
                      onChange={(e) => setSettingsState({ ...settingsState, trustpilotUrl: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Trustpilot Rating Score (e.g. 4.9)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={settingsState.trustpilotScore}
                        onChange={(e) => setSettingsState({ ...settingsState, trustpilotScore: parseFloat(e.target.value) || 4.9 })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Verified Review Count (e.g. 38)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settingsState.trustpilotReviewCount}
                        onChange={(e) => setSettingsState({ ...settingsState, trustpilotReviewCount: parseInt(e.target.value, 10) || 0 })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Booking Notices */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E0D8] pb-2">
                    Consultation &amp; Booking Notices
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Booking Page Path
                      </label>
                      <input
                        type="text"
                        value={settingsState.bookingUrl}
                        onChange={(e) => setSettingsState({ ...settingsState, bookingUrl: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#171717] font-bold">
                        Booking Subtitle Notice
                      </label>
                      <input
                        type="text"
                        value={settingsState.bookingNotice}
                        onChange={(e) => setSettingsState({ ...settingsState, bookingNotice: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Social Media Channels */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 shadow-xs">
                  <h3 className="font-serif text-lg font-bold text-[#171717] border-b border-[#E5E0D8] pb-2">
                    Social Media Profiles
                  </h3>

                  <div className="space-y-4">
                    {settingsState.socials.map((social: { platform: string; url: string; handle: string }, index: number) => (
                      <div key={social.platform} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <span className="font-mono text-xs font-bold text-[#171717]">
                          {social.platform}
                        </span>
                        <input
                          type="text"
                          value={social.handle}
                          onChange={(e) => {
                            const newSocials = [...settingsState.socials];
                            newSocials[index] = { ...newSocials[index], handle: e.target.value };
                            setSettingsState({ ...settingsState, socials: newSocials });
                          }}
                          placeholder="Handle (e.g. @launch.craft)"
                          className="h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => {
                            const newSocials = [...settingsState.socials];
                            newSocials[index] = { ...newSocials[index], url: e.target.value };
                            setSettingsState({ ...settingsState, socials: newSocials });
                          }}
                          placeholder="URL (https://...)"
                          className="h-10 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Save Bar */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E5E0D8]">
                  <span className="text-xs font-mono text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>PostgreSQL Key-Value Store: &apos;site_settings&apos;</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      performAction(
                        "update_settings",
                        settingsState,
                        "Global agency settings saved to PostgreSQL"
                      );
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          </main>
      </div>

      {/* ================================================================= */}
      {/* ACTION FEEDBACK POPUP MODAL (Displays after every CRUD/action)   */}
      {/* ================================================================= */}
      {actionModal?.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActionModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md bg-[#181818] border border-[#2E2E2E] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#F5F1E9] space-y-5 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient highlight based on type */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                actionModal.type === "success"
                  ? "from-emerald-500 via-teal-400 to-emerald-500"
                  : actionModal.type === "error"
                  ? "from-rose-500 via-red-400 to-rose-500"
                  : "from-blue-500 via-sky-400 to-blue-500"
              }`}
            />

            {/* Header with Icon, Title, and Close Button */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    actionModal.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-400"
                      : actionModal.type === "error"
                      ? "bg-red-950/80 border border-red-500/40 text-red-400"
                      : "bg-blue-950/80 border border-blue-500/40 text-blue-400"
                  }`}
                >
                  {actionModal.type === "success" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : actionModal.type === "error" ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                    {actionModal.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {actionModal.actionName && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#242424] border border-[#333333] text-[#AAAAAA] uppercase font-semibold">
                        {actionModal.actionName}
                      </span>
                    )}
                    {actionModal.timestamp && (
                      <span className="text-[10px] font-mono text-[#666666]">
                        {actionModal.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="p-1.5 rounded-lg text-[#777777] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body Box */}
            <div className="p-4 rounded-xl bg-[#222222] border border-[#2F2F2F] space-y-2">
              <p className="text-xs sm:text-sm text-[#DDDDDD] leading-relaxed">
                {actionModal.message}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#2C2C2C] text-[11px] font-mono text-[#888888]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PostgreSQL DB Synced
                </span>
                <span className="text-[#666666]">Real-time persistence</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-[#171717] font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#E5E0D8] transition-colors cursor-pointer shadow-sm text-center"
              >
                Acknowledged &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
