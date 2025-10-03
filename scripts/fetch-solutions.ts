import "dotenv/config";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
import { fetchYouTubeSolution } from "@/lib/fetchSolution";

(async () => {
  console.log("[CRON] Start fetch-solutions (standalone)");
  try {
    await connectDB();
    const nowUnix = Math.floor(Date.now() / 1000);
    const twoHours = 2 * 60 * 60;

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
            { solutionLink: { $exists: false } },
            { solutionLink: "" },
            { solutionLink: { $eq: null } },
          ],
        },
      ],
    }).limit(5);

    let processed = 0;
    let found = 0;
    for (const c of contests) {
      try {
        const url = await fetchYouTubeSolution(c.name, c.platform);
        if (url) {
          await Contest.findByIdAndUpdate(c._id, { solutionLink: url });
          found++;
          console.log(`[CRON] Found solution for ${c.name}`);
        }
        processed++;
        await new Promise((r) => setTimeout(r, 800));
      } catch (e) {
        console.error(`[CRON] Error contest ${c.name}`, e);
      }
    }
    console.log(`[CRON] Completed processed=${processed} found=${found}`);
    process.exit(0);
  } catch (e) {
    console.error("[CRON] Fatal fetch-solutions", e);
    process.exit(1);
  }
})();
