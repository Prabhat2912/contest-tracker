import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
import { fetchYouTubeSolution } from "@/lib/fetchSolution";

const SAFE_TIME_BUDGET_MS = 25_000; // safety (adjust if needed)
const PER_ITEM_DELAY_MS = 400;

async function run(request: Request) {
  const started = Date.now();
  try {
    console.log("[CRON] Starting post-contest YouTube solution fetch...");

    // Optional: Verify authorization if CRON_SECRET is set
    if (process.env.CRON_SECRET) {
      const auth = request.headers.get("authorization");
      if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await connectDB();

    const nowUnix = Math.floor(Date.now() / 1000);
    const twoHours = 2 * 60 * 60;

    const batchSize =
      parseInt(process.env.SOLUTION_FETCH_BATCH || "", 10) > 0
        ? parseInt(process.env.SOLUTION_FETCH_BATCH!, 10)
        : 10;

    // Fetch up to batchSize contests needing solutions
    const contests = await Contest.find({
      $and: [
        {
          $expr: {
            $lt: [
              { $add: ["$startTimeUnix", "$durationSeconds"] },
              nowUnix - twoHours,
            ],
          },
        },
        {
          $or: [
            { solutionFetched: { $exists: false } },
            { solutionFetched: false },
          ],
        },
        {
          $or: [
            { solutionLink: { $exists: false } },
            { solutionLink: "" },
            { solutionLink: { $eq: null } },
          ],
        },
      ],
    })
      .sort({ startTimeUnix: 1 })
      .limit(batchSize);

    console.log(
      `[CRON] Selected ${contests.length} / batch=${batchSize} contests for processing`
    );

    let processed = 0;
    let found = 0;

    for (const contest of contests) {
      if (Date.now() - started > SAFE_TIME_BUDGET_MS) {
        console.log("[CRON] Exiting early due to time budget");
        break;
      }

      try {
        console.log(`[CRON] Fetching solution for: ${contest.name}`);
        const solutionUrl = await fetchYouTubeSolution(contest.name);

        if (solutionUrl) {
          await Contest.findByIdAndUpdate(contest._id, {
            solutionLink: solutionUrl,
            solutionFetched: true,
          });
          found++;
          console.log(`[CRON] Found solution: ${solutionUrl}`);
        } else {
          console.log("[CRON] No solution yet, will retry later");
        }

        processed++;
        await new Promise((r) => setTimeout(r, PER_ITEM_DELAY_MS));
      } catch (err) {
        console.error(`[CRON] Error on ${contest.name}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "YouTube solution fetch completed",
      processed,
      solutionsFound: found,
      remainingPossible: contests.length - processed,
      batchRequested: batchSize,
      elapsedMs: Date.now() - started,
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

export async function GET(request: Request) {
  return run(request);
}
export async function POST(request: Request) {
  return run(request);
}
