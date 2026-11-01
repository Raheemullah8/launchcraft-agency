import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "LaunchCraft CMS Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#171717] flex items-center justify-center text-white font-mono text-xs">
          Loading Console...
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
