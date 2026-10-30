"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { api, getApiErrorMessage } from "@/lib/api";

const POPUP_DISMISS_KEY = "launchcraft_email_popup_dismissed";
const POPUP_SUBSCRIBED_KEY = "launchcraft_email_subscribed";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function EmailPopup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const modalRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger evaluation: 15s timer OR scroll > 35%
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user already subscribed
    if (localStorage.getItem(POPUP_SUBSCRIBED_KEY) === "true") {
      return;
    }

    // Check if dismissed within last 7 days
    const dismissedTime = localStorage.getItem(POPUP_DISMISS_KEY);
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < SEVEN_DAYS_MS) {
      return;
    }

    let hasTriggered = false;

    const triggerPopup = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setIsOpen(true);
    };

    // 1. Timer Trigger: 16 seconds
    const timer = setTimeout(() => {
      triggerPopup();
    }, 16000);

    // 2. Scroll Trigger: > 35%
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollY / docHeight > 0.35) {
        triggerPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Accessibility: Focus trap & Escape key handler
  React.useEffect(() => {
    if (!isOpen) return;

    firstInputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(POPUP_DISMISS_KEY, Date.now().toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) {
      setErrorMessage("Please enter your email and accept consent.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      await api.post("/newsletter", {
        email,
        consentAccepted: true,
        source: "timed_editorial_popup",
      });

      setStatus("success");
      trackEvent("email_subscribe_success", { pagePath: window.location.pathname });

      if (typeof window !== "undefined") {
        localStorage.setItem(POPUP_SUBSCRIBED_KEY, "true");
      }

      // Auto dismiss after 2.5s
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(getApiErrorMessage(err, "Subscription error."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          {/* Overlay click to dismiss */}
          <div className="absolute inset-0" onClick={handleDismiss} />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-2xl bg-[#171717] text-[#F5F1E9] p-7 sm:p-9 border border-[#2F2F2F] shadow-2xl z-10"
          >
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#262626] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Close newsletter popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#999999]">
                LaunchCraft Dispatch
              </span>

              <h2
                id="popup-title"
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF] leading-snug"
              >
                Get practical ideas for growing your brand.
              </h2>

              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                Bi-weekly strategic memos on brand architecture, high-intent customer acquisition, and modern web engineering. Concise, actionable, zero filler.
              </p>

              {status === "success" ? (
                <div className="p-4 rounded-xl bg-[#222222] border border-[#333333] flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-sm">
                    Thank you. You are confirmed. Practical ideas will arrive in your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label htmlFor="popup-email" className="block text-xs font-mono text-[#CCCCCC]">
                      Direct Business Email
                    </label>
                    <input
                      ref={firstInputRef}
                      id="popup-email"
                      type="email"
                      required
                      placeholder="founder@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-[#222222] border border-[#383838] text-white placeholder:text-[#666666] text-sm focus-visible:outline-none focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white transition-colors"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="popup-consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-[#444444] bg-[#222222] text-[#171717] focus:ring-white cursor-pointer"
                    />
                    <label htmlFor="popup-consent" className="text-xs text-[#888888] leading-tight cursor-pointer">
                      I agree to receive occasional editorial insights from LaunchCraft. Unsubscribe anytime in one click.
                    </label>
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-[#FF6B6B]">{errorMessage}</p>
                  )}

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-11 px-6 rounded-lg bg-[#FFFFFF] text-[#171717] font-semibold text-sm hover:bg-[#E5E0D8] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{loading ? "Subscribing..." : "Subscribe to Insights"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="px-4 py-2 text-xs font-mono text-[#888888] hover:text-white transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

