import { NextResponse } from "next/server";
import { getUpcomingSlots } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = await getUpcomingSlots();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("[slots] error:", err);
    return NextResponse.json({ slots: [] }, { status: 500 });
  }
}
