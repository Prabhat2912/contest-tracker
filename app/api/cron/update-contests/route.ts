import { getAllContests } from "@/lib/contestController";
import { NextResponse } from "next/server";

// API route for automated daily contest updates
export async function GET(request: Request) {
  try {
    console.log("[CRON] Starting daily contest update...");

    // Optional: Verify authorization if CRON_SECRET is set
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await getAllContests();

    console.log("[CRON] Daily contest update completed successfully");

    return NextResponse.json({
      success: true,
      message: "Contests updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error updating contests:", error);

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for webhook-based cron services
export async function POST(request: Request) {
  try {
    console.log("[CRON] Starting daily contest update via POST...");

    // Optional: Verify authorization if CRON_SECRET is set
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await getAllContests();

    console.log("[CRON] Daily contest update completed successfully");

    return NextResponse.json({
      success: true,
      message: "Contests updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error updating contests:", error);

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
