// Deprecated scheduler endpoint retained only to satisfy leftover references during cleanup.
// Returns 410 Gone; cron logic has moved to standalone scripts (see scripts/ directory).
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Deprecated: /api/cron/scheduler removed. Use server cron scripts instead.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return GET();
}
