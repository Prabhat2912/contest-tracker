// Deprecated debug endpoint. Originally used for manual YouTube solution tests.
// Returns 410 Gone. Use cron scripts or core APIs instead.
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Deprecated: /api/debug/youtube removed.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return GET();
}
