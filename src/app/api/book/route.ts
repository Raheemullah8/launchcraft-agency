import { NextRequest, NextResponse } from "next/server";
import { createBooking, createLead, getBookedSlotsForDate, getBookingSchedule } from "@/lib/cms/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      businessName,
      serviceInterest,
      date,
      timeSlot,
      timezone,
      notes,
      consentAccepted,
    } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (!date || !timeSlot) {
      return NextResponse.json({ error: "Please select an available date and time slot." }, { status: 400 });
    }
    if (!consentAccepted) {
      return NextResponse.json({ error: "Consent to policy is required." }, { status: 400 });
    }

    // Check if date is blocked
    const schedule = await getBookingSchedule();
    if (schedule.blockedDates.includes(date)) {
      return NextResponse.json(
        { error: "The selected date is currently blocked and unavailable for booking." },
        { status: 400 }
      );
    }

    // Check if slot is already reserved
    const bookedSlots = await getBookedSlotsForDate(date);
    if (bookedSlots.includes(timeSlot)) {
      return NextResponse.json(
        { error: "This time slot has already been reserved. Please select an alternate slot or date." },
        { status: 409 }
      );
    }

    // 1. Create persistent Booking record in PostgreSQL
    const booking = await createBooking({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      businessName: businessName?.trim() || null,
      serviceInterest: serviceInterest || "Branding & Positioning",
      date,
      timeSlot,
      timezone: timezone || "Europe/London (GMT/BST)",
      notes: notes?.trim() || null,
    });

    // 2. Also log as a CRM Lead for seamless inquiry tracking
    await createLead({
      type: "project_inquiry",
      name: name.trim(),
      businessName: businessName?.trim() || null,
      email: email.trim().toLowerCase(),
      service: serviceInterest || "Consultation",
      message: `[BOOKING CONFIRMED] Scheduled Date: ${date} at ${timeSlot} (${timezone || "UTC"}). Focus: ${serviceInterest || "General"}. Notes: ${notes || "None"}`,
      status: "Qualified",
      source: "consultation_scheduler",
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        bookingId: booking.id,
        appointment: {
          date: booking.date,
          timeSlot: booking.timeSlot,
          timezone: booking.timezone,
        },
        message: "Your consultation request has been confirmed. A calendar invitation has been reserved.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Booking could not be scheduled. Please try again." },
      { status: 500 }
    );
  }
}


