"use client";

import * as React from "react";
import { SiteSettings } from "@/lib/cms/types";

interface SettingsContextValue {
  settings: SiteSettings | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = React.createContext<SettingsContextValue>({
  settings: null,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);

  const refreshSettings = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn("Could not fetch site settings:", err);
    }
  }, []);

  React.useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return React.useContext(SettingsContext);
}

