"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, Globe, CheckCircle2, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { api, getApiErrorMessage } from "@/lib/api";
import { BookingSchedule } from "@/lib/cms/types";

const COMMON_TIMEZONES = [
  "Europe/London (GMT/BST)",
  "America/New_York (EST/EDT)",
  "America/Los_Angeles (PST/PDT)",
  "Europe/Berlin (CET/CEST)",
  "Asia/Dubai (GST)",
  "Asia/Singapore (SGT)",
];

const TIME_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
];

export function ConsultationScheduler() {
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedSlot, setSelectedSlot] = React.useState<string>("");
  const [timezone, setTimezone] = React.useState<string>(COMMON_TIMEZONES[0]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [focusArea, setFocusArea] = React.useState("Branding & Position");
  const [notes, setNotes] = React.useState("");
  const [consentAccepted, setConsentAccepted] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = React.useState<{
    bookingId: string;
    appointment: { date: string; timeSlot: string; timezone: string };
  } | null>(null);

  // Available dates calculated on client mount to avoid prerender clock skew
  const [availableDates, setAvailableDates] = React.useState<{ dateStr: string; label: string; dayName: string }[]>([]);
  const [schedule, setSchedule] = React.useState<BookingSchedule | null>(null);
  const [bookedSlots, setBookedSlots] = React.useState<string[]>([]);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);

  // 1. Load active booking schedule & working days
  React.useEffect(() => {
    async function loadSchedule() {
      try {
        setLoadingSchedule(true);
        const res = await fetch("/api/book/schedule", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.schedule) {
            setSchedule(data.schedule);
            
            // Generate available dates from workingDays & blockedDates
            const workingDays = Array.isArray(data.schedule.workingDays) && data.schedule.workingDays.length > 0
              ? data.schedule.workingDays
              : [1, 2, 3, 4, 5];
            const blocked = Array.isArray(data.schedule.blockedDates) ? data.schedule.blockedDates : [];
            const maxDays = data.schedule.maxAdvanceDays || 14;

            const dates: { dateStr: string; label: string; dayName: string }[] = [];
            const current = new Date();
            current.setDate(current.getDate() + 1); // Start from tomorrow

            const limit = Math.min(Math.max(maxDays, 5), 14);
            let attempts = 0;
            while (dates.length < limit && attempts < maxDays + 30) {
              attempts++;
              const dayOfWeek = current.getDay();
              const yyyy = current.getFullYear();
              const mm = String(current.getMonth() + 1).padStart(2, "0");
              const dd = String(current.getDate()).padStart(2, "0");
              const dateStr = `${yyyy}-${mm}-${dd}`;

              if (workingDays.includes(dayOfWeek) && !blocked.includes(dateStr)) {
                const dayName = current.toLocaleDateString("en-US", { weekday: "short" });
                const label = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                dates.push({ dateStr, label, dayName });
              }
              current.setDate(current.getDate() + 1);
            }

            setAvailableDates(dates);
            if (dates.length > 0) {
              setSelectedDate(dates[0].dateStr);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load booking schedule:", err);
      } finally {
        setLoadingSchedule(false);
      }
    }
    loadSchedule();
  }, []);

  // 2. Fetch booked slots when selectedDate changes
  React.useEffect(() => {
    if (!selectedDate) return;
    async function fetchBookedSlots() {
      try {
        const res = await fetch(`/api/book/schedule?date=${selectedDate}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(Array.isArray(data.bookedSlots) ? data.bookedSlots : []);
        }
      } catch (err) {
        console.warn("Failed to check booked slots for date:", err);
      }
    }
    fetchBookedSlots();
  }, [selectedDate]);

  // Attempt to detect visitor timezone
  React.useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = COMMON_TIMEZONES.find((tz) => tz.includes(detected));
      if (match) {
        setTimezone(match);
      }
    } catch {
      // Fallback to default
    }
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSlot) {
      setErrorMsg("Please select an available appointment time slot.");
      return;
    }

    if (!consentAccepted) {
      setErrorMsg("Please accept the privacy consent.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post<{
        bookingId: string;
        appointment: { date: string; timeSlot: string; timezone: string };
      }>("/book", {
        name,
        email,
        businessName: company,
        serviceInterest: focusArea,
        date: selectedDate,
        timeSlot: selectedSlot,
        timezone,
        notes,
        consentAccepted: true,
      });

      setBookingConfirmed({
        bookingId: res.data.bookingId,
        appointment: res.data.appointment,
      });

      trackEvent("booking_complete", {
        pagePath: "/book",
        bookingType: "private_consultation_30min",
      });
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Failed to confirm booking."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadICS = () => {
    if (!bookingConfirmed) return;
    const { appointment } = bookingConfirmed;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LaunchCraft Agency//Consultation Booking//EN
BEGIN:VEVENT
SUMMARY:LaunchCraft Strategic Consultation (30 min)
DESCRIPTION:Private strategic consultation with LaunchCraft partner regarding ${focusArea}.
LOCATION:Google Meet (Link will be provided prior to call)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LaunchCraft_Consultation_${appointment.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (bookingConfirmed) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E0D8] space-y-6 text-center max-w-2xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mx-auto text-[#171717]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Consultation Reserved
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            Session Confirmed
          </h2>
          <p className="text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
            A {schedule?.durationMinutes || 30}-minute private consultation with a senior LaunchCraft partner has been registered for <span className="font-semibold text-[#171717]">{name}</span>.
          </p>
        </div>

        {/* Appointment Badge */}
        <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-left space-y-3 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-mono text-[#777777] border-b border-[#E5E0D8] pb-2">
            <span>REFERENCE: {bookingConfirmed.bookingId}</span>
            <span>{schedule?.durationMinutes || 30} MIN CALL</span>
          </div>
          <div className="space-y-1 text-sm text-[#171717]">
            <div className="font-bold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#777777]" />
              <span>{bookingConfirmed.appointment.date}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#555555]">
              <Clock className="w-4 h-4 text-[#777777]" />
              <span>{bookingConfirmed.appointment.timeSlot} ({bookingConfirmed.appointment.timezone})</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={downloadICS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Add to Calendar (.ICS)</span>
          </button>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-wider text-[#777777] hover:text-[#171717] underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Briefing details */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            Private Consultation
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#171717] mt-1">
            Senior partner briefing on your milestone objectives.
          </h2>
          <p className="text-sm text-[#555555] mt-3 leading-relaxed">
            During this {schedule?.durationMinutes || 30}-minute private session, we review your current positioning, digital platform bottlenecks, and growth opportunities. No pitch decks, just honest commercial counsel.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
              Format &amp; Venue
            </div>
            <p className="text-sm font-semibold text-[#171717]">
              1-on-1 Video Conference ({schedule?.durationMinutes || 30} Min)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D8] space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#777777]">
              Prepared by Senior Partner
            </div>
            <p className="text-sm text-[#555555]">
              We perform preliminary research on your public footprint prior to joining the call.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#171717] font-bold">
            <ShieldCheck className="w-4 h-4" />
            Confidentiality Guaranteed
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            All discussions are covered by default confidentiality. Mutual NDAs executed upon request prior to the call.
          </p>
        </div>
      </div>

      {/* Right Column: Timezone, Date & Time Slot Picker + Form */}
      <div className="lg:col-span-7">
        <form onSubmit={handleBook} className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E0D8] space-y-6">
          <div className="border-b border-[#E5E0D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#171717]">
                Select Appointment Slot
              </h3>
              <p className="text-xs text-[#777777] font-mono mt-0.5">
                {schedule?.notice || `${schedule?.durationMinutes || 30}-Minute Video Consultation`}
              </p>
            </div>

            {/* Timezone Switcher */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#777777]">
              <Globe className="w-3.5 h-3.5" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-transparent text-xs font-mono text-[#171717] focus:outline-none cursor-pointer"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] text-xs text-[#C53030]">
              {errorMsg}
            </div>
          )}

          {/* Date Selector Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-[#171717]">
                1. Choose Available Date
              </label>
              <span className="text-[11px] font-mono text-[#777777]">
                {availableDates.length} days open
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-thin">
              {availableDates.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      setSelectedSlot("");
                    }}
                    className={`min-w-[74px] p-2.5 rounded-xl text-center transition-all border cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#171717] text-[#F5F1E9] border-[#171717] font-bold shadow-xs scale-102"
                        : "bg-[#FAF8F5] text-[#555555] border-[#E5E0D8] hover:border-[#171717]"
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider">{d.dayName}</div>
                    <div className="text-xs font-serif font-bold mt-0.5 whitespace-nowrap">{d.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#171717]">
              2. Select Slot ({timezone.split(" ")[0]})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(schedule?.timeSlots || TIME_SLOTS).map((slot) => {
                const isSelected = selectedSlot === slot;
                const isBooked = bookedSlots.includes(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      if (!isBooked) setSelectedSlot(slot);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-mono transition-colors border text-center flex items-center justify-center gap-1.5 ${
                      isBooked
                        ? "bg-[#EFEAE1] text-[#999999] border-[#DDD8CE] cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-[#171717] text-[#F5F1E9] border-[#171717] font-bold cursor-pointer"
                        : "bg-[#FAF8F5] text-[#555555] border-[#E5E0D8] hover:border-[#171717] cursor-pointer"
                    }`}
                  >
                    <span className={isBooked ? "line-through" : ""}>{slot}</span>
                    {isBooked && (
                      <span className="text-[9px] uppercase px-1 rounded bg-[#E5E0D8] text-[#777777]">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="space-y-4 pt-2 border-t border-[#E5E0D8]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="book-name" className="block text-xs font-mono text-[#171717]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="book-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Claire Sterling"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="book-email" className="block text-xs font-mono text-[#171717]">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="book-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="claire@sterling.com"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="book-company" className="block text-xs font-mono text-[#171717]">
                  Organization / Website
                </label>
                <input
                  id="book-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Sterling Ventures"
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="book-focus" className="block text-xs font-mono text-[#171717]">
                  Primary Consultation Focus
                </label>
                <select
                  id="book-focus"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-mono text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
                >
                  <option value="Branding & Positioning">Branding &amp; Positioning</option>
                  <option value="Next.js Platform Engineering">Next.js Platform Engineering</option>
                  <option value="Customer Acquisition & Paid Media">Customer Acquisition &amp; Paid Media</option>
                  <option value="Product Launch Orchestration">Product Launch Orchestration</option>
                  <option value="Startup Advisory / Business Model">Startup Advisory / Business Model</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="book-notes" className="block text-xs font-mono text-[#171717]">
                Topics or Questions to Cover (Optional)
              </label>
              <textarea
                id="book-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific bottlenecks or deadlines you would like to address..."
                className="w-full p-3 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] text-sm text-[#171717] focus-visible:outline-none focus-visible:border-[#171717]"
              />
            </div>
          </div>

          {/* Privacy Consent */}
          <div className="flex items-start gap-3">
            <input
              id="book-consent"
              type="checkbox"
              required
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#D8D2C6] text-[#171717] focus:ring-[#171717] cursor-pointer"
            />
            <label htmlFor="book-consent" className="text-xs text-[#555555] leading-relaxed cursor-pointer">
              I consent to LaunchCraft reserving this appointment and sending confirmation notices. Information is treated confidentially per our{" "}
              <Link href="/privacy" className="text-[#171717] underline" target="_blank">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#171717] text-white font-mono uppercase text-xs tracking-wider font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? "Confirming Reservation..."
                : `Confirm ${schedule?.durationMinutes || 30}-Minute Consultation`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
