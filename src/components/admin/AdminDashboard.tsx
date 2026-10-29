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
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { CMSData } from "@/lib/cms/types";

type AdminTab =
  | "overview"
  | "services"
  | "portfolio"
  | "jobs"
  | "applications"
  | "leads"
  | "subscribers"
  | "settings";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [passkey, setPasskey] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  const [cmsData, setCmsData] = React.useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = React.useState<AdminTab>("overview");
  const [loadingData, setLoadingData] = React.useState(false);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Search filter inside active tab
  const [searchFilter, setSearchFilter] = React.useState("");

  const checkAuth = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        setCmsData(data);
        setIsAuthenticated(true);
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
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        await checkAuth();
      } else {
        const data = await res.json();
        setAuthError(data.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setAuthError("Network connection error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setCmsData(null);
  };

  const performAction = async (action: string, payload: unknown, successMsg: string) => {
    try {
      setLoadingData(true);
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) setCmsData(data.data);
        setActionSuccess(successMsg);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Admin action failed:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Export Subscribers as CSV
  const exportSubscribersCSV = () => {
    if (!cmsData?.subscribers) return;
    const header = "Email,Source,Status,Created At\n";
    const rows = cmsData.subscribers
      .map((s) => `"${s.email}","${s.source}","${s.status}","${s.createdAt}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LaunchCraft_Subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="min-h-screen flex items-center justify-center bg-[#141414] p-4">
        <div className="w-full max-w-md rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] p-8 sm:p-10 text-[#F5F1E9] space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-white text-[#171717] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
              LAUNCHCRAFT
            </h1>
            <p className="text-xs font-mono text-[#888888] uppercase tracking-widest">
              CMS Operations Console
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-[#CCCCCC]">
                Master Administrator Passkey
              </label>
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey (e.g. launchcraft2026)"
                className="w-full h-12 px-4 rounded-lg bg-[#2A2A2A] border border-[#3E3E3E] text-sm text-white placeholder:text-[#666666] focus-visible:outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-12 rounded-lg bg-white text-[#171717] font-mono uppercase text-xs tracking-wider font-bold hover:bg-[#E5E0D8] transition-colors cursor-pointer disabled:opacity-50"
            >
              {authLoading ? "Authorizing..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="p-3 rounded-lg bg-[#262626] border border-[#333333] text-center text-xs font-mono text-[#888888]">
            Default passkey: <span className="text-white font-bold">launchcraft2026</span>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs font-mono text-[#777777] hover:text-white underline underline-offset-2"
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
            <span>Master Admin</span>
            <button
              onClick={handleLogout}
              className="text-[#999999] hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
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
              </div>

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

                    <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                      <button
                        onClick={() => {
                          const nextStatus = srv.status === "published" ? "draft" : "published";
                          performAction(
                            "save_service",
                            { ...srv, status: nextStatus },
                            `Service ${srv.title} status changed to ${nextStatus}`
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                      >
                        {srv.status === "published" ? "Unpublish (Draft)" : "Publish Live"}
                      </button>

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
                    Toggle featured flags, manage categories, and audit case metrics
                  </p>
                </div>
              </div>

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
                        {proj.outcome}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
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
                          {proj.featured ? "Unfeature" : "Feature on Home"}
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
                    Manage vacancies, requirements, deadlines, and publishing status
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#E5E0D8] rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden shadow-xs">
                {cmsData.jobs.map((job) => (
                  <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#171717]">
                          {job.title}
                        </h3>
                        <span className="text-xs font-mono text-[#777777]">
                          ({job.department} • {job.workArrangement})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            job.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#555555]">{job.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const nextStatus = job.status === "published" ? "closed" : "published";
                          performAction(
                            "save_job",
                            { ...job, status: nextStatus },
                            `Job ${job.title} set to ${nextStatus}`
                          );
                        }}
                        className="px-3.5 py-1.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
                      >
                        {job.status === "published" ? "Close Role" : "Publish Live"}
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
            </div>
          )}

          {/* TAB 5: APPLICATIONS (Direct Private CV Download) */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Candidate Job Applications ({cmsData.applications.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Private object storage • Validated PDF/DOCX downloads
                  </p>
                </div>
              </div>

              {cmsData.applications.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <p className="font-serif text-lg font-bold text-[#171717]">
                    No job applications logged yet
                  </p>
                  <p className="text-xs text-[#777777]">
                    When candidates apply through `/careers/[slug]`, their records and private CV files appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cmsData.applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl font-bold text-[#171717]">
                              {app.candidateName}
                            </h3>
                            <span className="text-xs font-mono text-[#777777]">
                              • Applying for: <strong className="text-[#171717]">{app.jobTitle}</strong>
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-[#888888]">
                            Submitted: {new Date(app.createdAt).toLocaleString()} • Ref: {app.id}
                          </p>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
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
                            className="h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#171717] cursor-pointer"
                          >
                            {["New", "Reviewing", "Shortlisted", "Rejected", "Hired"].map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
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
                      <div className="pt-2 flex items-center justify-between">
                        <a
                          href={`/api/admin/cv/${encodeURIComponent(app.cvStorageKey)}`}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase font-bold tracking-wider hover:bg-black transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Private CV ({app.cvFileName})</span>
                        </a>

                        <span className="text-[11px] font-mono text-emerald-700">
                          ✓ Private Storage Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: LEADS */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Leads &amp; Project Inquiries ({cmsData.leads.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Captured from Consultation scheduler and Project Inquiry forms
                  </p>
                </div>
              </div>

              {cmsData.leads.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <p className="font-serif text-lg font-bold text-[#171717]">
                    No leads or inquiries received yet
                  </p>
                  <p className="text-xs text-[#777777]">
                    Submissions from `/contact` and `/book` will be captured here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cmsData.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl font-bold text-[#171717]">
                              {lead.name}
                            </h3>
                            {lead.businessName && (
                              <span className="text-xs font-mono text-[#777777]">
                                • {lead.businessName}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] border border-[#E5E0D8] font-bold text-[#171717]">
                              {lead.type}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-[#888888]">
                            Received: {new Date(lead.createdAt).toLocaleString()} • Ref: {lead.id}
                          </p>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
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
                            className="h-9 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono font-bold text-[#171717] cursor-pointer"
                          >
                            {["New", "Contacted", "Qualified", "Closed"].map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
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
                          Timeline: {lead.timeline || "N/A"} • Budget: {lead.budgetRange || "N/A"}
                        </div>
                      </div>

                      {lead.selectedServices && lead.selectedServices.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lead.selectedServices.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#171717]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#222222] leading-relaxed whitespace-pre-wrap">
                        {lead.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#171717]">
                    Newsletter Subscribers ({cmsData.subscribers.length})
                  </h2>
                  <p className="text-xs font-mono text-[#777777]">
                    Collected through the timed &amp; scroll email popup
                  </p>
                </div>

                {cmsData.subscribers.length > 0 && (
                  <button
                    onClick={exportSubscribersCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              {cmsData.subscribers.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E0D8] space-y-2">
                  <p className="font-serif text-lg font-bold text-[#171717]">
                    No subscribers yet
                  </p>
                  <p className="text-xs text-[#777777]">
                    When visitors subscribe via the homepage modal popup, their emails are saved here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8] rounded-2xl bg-white border border-[#E5E0D8] overflow-hidden shadow-xs">
                  {cmsData.subscribers.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 sm:p-5 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-[#171717] text-sm">{sub.email}</span>
                        <div className="text-[11px] text-[#777777]">
                          Source: {sub.source} • Joined: {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SITE SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="border-b border-[#E5E0D8] pb-4">
                <h2 className="font-serif text-2xl font-bold text-[#171717]">
                  Global Agency Configuration
                </h2>
                <p className="text-xs font-mono text-[#777777]">
                  Update brand identity, email addresses, Trustpilot review scores, and booking notices
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 max-w-3xl shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      defaultValue={cmsData.settings.agencyName}
                      id="cfg-name"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Tagline / Motto
                    </label>
                    <input
                      type="text"
                      defaultValue={cmsData.settings.tagline}
                      id="cfg-tagline"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Primary Inquiries Email
                    </label>
                    <input
                      type="email"
                      defaultValue={cmsData.settings.email}
                      id="cfg-email"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Studio Phone
                    </label>
                    <input
                      type="text"
                      defaultValue={cmsData.settings.phone}
                      id="cfg-phone"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#171717] font-bold">
                    Official Trustpilot Profile URL
                  </label>
                  <input
                    type="url"
                    defaultValue={cmsData.settings.trustpilotUrl}
                    id="cfg-trustpilot"
                    className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Trustpilot Rating Score
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={cmsData.settings.trustpilotScore}
                      id="cfg-score"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#171717] font-bold">
                      Verified Review Count
                    </label>
                    <input
                      type="number"
                      defaultValue={cmsData.settings.trustpilotReviewCount}
                      id="cfg-reviews"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      const name = (document.getElementById("cfg-name") as HTMLInputElement).value;
                      const tagline = (document.getElementById("cfg-tagline") as HTMLInputElement).value;
                      const email = (document.getElementById("cfg-email") as HTMLInputElement).value;
                      const phone = (document.getElementById("cfg-phone") as HTMLInputElement).value;
                      const trustpilotUrl = (document.getElementById("cfg-trustpilot") as HTMLInputElement).value;
                      const score = parseFloat((document.getElementById("cfg-score") as HTMLInputElement).value);
                      const count = parseInt((document.getElementById("cfg-reviews") as HTMLInputElement).value, 10);

                      performAction(
                        "update_settings",
                        {
                          ...cmsData.settings,
                          agencyName: name,
                          tagline,
                          email,
                          phone,
                          trustpilotUrl,
                          trustpilotScore: score,
                          trustpilotReviewCount: count,
                        },
                        "Site settings successfully updated."
                      );
                    }}
                    className="px-6 py-3 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
