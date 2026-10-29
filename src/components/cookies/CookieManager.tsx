"use client";

import * as React from "react";
import { Check, Shield, BarChart3, CheckCircle2 } from "lucide-react";
import { getConsentStatus, setConsentStatus } from "@/lib/analytics";

export function CookieManager() {
  const [analyticsAllowed, setAnalyticsAllowed] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const current = getConsentStatus();
    setAnalyticsAllowed(current.analytics);
  }, []);

  const handleSave = () => {
    setConsentStatus(analyticsAllowed);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E0D8] space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-bold text-[#171717]">
          Cookie Preference Center
        </h2>
        <p className="text-sm text-[#555555]">
          Customize how cookies and client-side storage are utilized during your visits. Strictly necessary cookies cannot be disabled.
        </p>
      </div>

      <div className="space-y-4">
        {/* Strictly Necessary */}
        <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#171717]" />
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Strictly Necessary Cookies
              </h3>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed">
              Essential for security, session verification, admin authentication, and preserving your privacy choices.
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#E5E0D8] text-[#171717] font-semibold">
            Always Active
          </span>
        </div>

        {/* Analytics Cookies */}
        <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#171717]" />
              <h3 className="font-serif text-base font-bold text-[#171717]">
                Performance &amp; Analytics
              </h3>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed">
              Enables aggregated measurement of page visits and portfolio filter interactions without collecting personal names, emails, or IP addresses.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={analyticsAllowed}
              onChange={(e) => setAnalyticsAllowed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#D8D2C6] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#171717]" />
          </label>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-black transition-colors cursor-pointer"
        >
          Save Preferences
        </button>

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00875A] font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Preferences Saved
          </span>
        )}
      </div>
    </div>
  );
}

