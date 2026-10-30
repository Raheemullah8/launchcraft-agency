import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { getBookingSchedule, getBookedSlotsForDate } from "@/lib/cms/store";

export async function GET(req: NextRequest) {
  await connection();
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const schedule = await getBookingSchedule();
    let bookedSlots: string[] = [];

    if (date) {
      bookedSlots = await getBookedSlotsForDate(date);
    }

    return NextResponse.json(
      {
        success: true,
        schedule,
        bookedSlots,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[BOOKING_SCHEDULE_GET_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to load booking schedule and available slots" },
      { status: 500 }
    );
  }
}

