import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
import { fetchYouTubeSolution } from "@/lib/fetchSolution";

// API route for automated YouTube solution fetching after contests end
export async function GET(request: Request) {
  try {
    console.log("[CRON] Starting post-contest YouTube solution fetch...");
    
    // Optional: Verify authorization if CRON_SECRET is set
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }    await connectDB();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Find contests that ended in the last 24 hours and don't have solutions yet
    const recentlyEndedContests = await Contest.find({
      $and: [
        {
          $expr: {
            $lt: [
              { $add: ["$startTimeUnix", "$durationSeconds"] },
              Math.floor(now.getTime() / 1000),
            ],
          },
        },
        {
          $expr: {
            $gt: [
              { $add: ["$startTimeUnix", "$durationSeconds"] },
              Math.floor(oneDayAgo.getTime() / 1000),
            ],
          },
        },
        {
          $or: [
            { solutionLinks: { $exists: false } },
            { solutionLinks: { $size: 0 } },
          ],
        },
      ],
    });

    console.log(
      `[CRON] Found ${recentlyEndedContests.length} contests to process`
    );

    let processed = 0;
    let found = 0;

    for (const contest of recentlyEndedContests) {
      try {
        console.log(`[CRON] Fetching solution for: ${contest.name}`);

        const solutionUrl = await fetchYouTubeSolution(contest.name);

        if (solutionUrl) {
          // Update contest with solution link
          await Contest.findByIdAndUpdate(contest._id, {
            $push: { solutionLinks: solutionUrl },
          });

          found++;
          console.log(
            `[CRON] Found solution for ${contest.name}: ${solutionUrl}`
          );
        } else {
          console.log(`[CRON] No solution found for: ${contest.name}`);
        }

        processed++;

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
