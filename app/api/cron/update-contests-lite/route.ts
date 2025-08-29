import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import axios from "axios";
import { Contest } from "@/db/model/contest.model";

// Lightweight API route for automated daily contest updates
export async function GET() {
  try {
    console.log("[CRON] Starting lightweight contest update...");

    // Connect to database
    await connectDB();

    // Just fetch a few recent contests to avoid timeout
    const response = await axios.get("https://codeforces.com/api/contest.list");

    if (response.data.status === "OK") {
      const contests = response.data.result
        .slice(0, 10) // Only take first 10 to avoid timeout
        .map(
          (contest: {
            id: number;
            name: string;
            startTimeSeconds: number;
            durationSeconds: number;
          }) => ({
            platform: "Codeforces",
            name: contest.name,
            startTimeUnix: contest.startTimeSeconds,
            startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
            durationSeconds: contest.durationSeconds,
            duration: `${Math.floor(contest.durationSeconds / 3600)} hours`,
            url: `https://codeforces.com/contests/${contest.id}`,
            solutionLink: "",
            bookmarkedBy: [],
          })
        );

      // Save to database (only new ones)
      for (const contest of contests) {
        try {
          const existing = await Contest.findOne({ name: contest.name });
          if (!existing) {
            await Contest.create(contest);
            console.log(`[CRON] Added new contest: ${contest.name}`);
          }
        } catch (error) {
          console.error(`[CRON] Error saving contest: ${contest.name}`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lightweight contest update completed",
      timestamp: new Date().toISOString(),
      processed: 10,
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
export async function POST() {
  return GET();
}
