import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
import { fetchYouTubeSolution } from "@/lib/fetchSolution";

// API route for automated YouTube solution fetching for contests that ended 2+ hours ago
export async function GET(request: Request) {
  try {
    console.log("[CRON] Starting post-contest YouTube solution fetch...");

    // Optional: Verify authorization if CRON_SECRET is set
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    await connectDB();

    const now = new Date();
    const currentTimeUnix = Math.floor(now.getTime() / 1000);
    const twoHoursInSeconds = 2 * 60 * 60; // 2 hours in seconds

    // Find contests that ended at least 2 hours ago and haven't had solutions fetched
    const contestsNeedingSolutions = await Contest.find({
      $and: [
        // Contest has ended at least 2 hours ago
        {
          $expr: {
            $lt: [
              { $add: ["$startTimeUnix", "$durationSeconds"] }, // Contest end time
              currentTimeUnix - twoHoursInSeconds, // 2 hours ago
            ],
          },
        },
        // Solution hasn't been fetched yet
        {
          $or: [
            { solutionFetched: { $exists: false } },
            { solutionFetched: false },
          ],
        },
        // No solution link exists
        {
          $or: [
            { solutionLink: { $exists: false } },
            { solutionLink: "" },
            { solutionLink: { $eq: null } },
          ],
        },
      ],
    }).limit(2); // Only process 2 contests per run to avoid timeout

    console.log(
      `[CRON] Found ${contestsNeedingSolutions.length} contests that ended 2+ hours ago without solutions to process`
    );

    let processed = 0;
    let found = 0;

    for (const contest of contestsNeedingSolutions) {
      try {
        console.log(`[CRON] Fetching solution for: ${contest.name}`);

        const solutionUrl = await fetchYouTubeSolution(contest.name);

        console.log(`[CRON] Fetched solution URL: ${solutionUrl}`);

        if (solutionUrl != "" && solutionUrl != null) {
          // Update contest with solution link and mark as fetched
          await Contest.findByIdAndUpdate(contest._id, {
            solutionLink: solutionUrl,
            solutionFetched: true,
          });

          found++;
          console.log(
            `[CRON] Found solution for ${contest.name}: ${solutionUrl}`
          );
        } else {
          // Don't mark as fetched if no solution found - we'll try again later
          console.log(
            `[CRON] No solution found for: ${contest.name} - will retry later`
          );
        }

        processed++;

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500)); // Reduced delay
      } catch (error) {
        console.error(`[CRON] Error processing ${contest.name}:`, error);
      }
    }

    console.log(
      `[CRON] YouTube solution fetch completed. Processed: ${processed}, Found: ${found}`
    );

    return NextResponse.json({
      success: true,
      message: "YouTube solution fetch completed",
      processed,
      solutionsFound: found,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error fetching YouTube solutions:", error);

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
  return GET(request);
}
