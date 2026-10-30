"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { EmailPopup } from "@/components/EmailPopup";
import { SettingsProvider } from "@/context/SettingsContext";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <SettingsProvider>
        <div className="min-h-screen bg-[#F5F4F0] text-[#171717]">
          {children}
        </div>
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <Navbar />
      <main id="main-content" className="flex-1 pt-24 sm:pt-28">
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <EmailPopup />
    </SettingsProvider>
  );
}

