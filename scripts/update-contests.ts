import "dotenv/config";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
// Re-import internal (non-exported) helpers by duplicating minimal logic
import axios from "axios";
import { contest } from "@/types/types";

async function fetchCodeforces(): Promise<contest[]> {
  try {
    const res = await axios.get("https://codeforces.com/api/contest.list", {
      timeout: 10000,
    });
    if (res.data.status !== "OK") return [];
    type CodeforcesContest = {
      id: number;
      name: string;
      startTimeSeconds: number;
      durationSeconds: number;
    };
    return res.data.result.slice(0, 100).map((c: CodeforcesContest) => ({
      platform: "Codeforces",
      name: c.name,
      startTimeUnix: c.startTimeSeconds,
      startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
      durationSeconds: c.durationSeconds,
      duration: `${Math.floor(c.durationSeconds / 3600)} hours ${
        (c.durationSeconds % 3600) / 60
      } minutes`,
      url: `https://codeforces.com/contests/${c.id}`,
    }));
  } catch {
    return [];
  }
}

async function fetchLeetCode(): Promise<contest[]> {
  try {
    const graphqlQuery = {
      query: `query getContestList { allContests { title startTime duration titleSlug } }`,
    };
    const res = await axios.post("https://leetcode.com/graphql", graphqlQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    type LeetCodeContest = {
      title: string;
      startTime: number;
      duration: number;
      titleSlug: string;
    };
    return res.data.data.allContests
      .slice(0, 100)
      .map((c: LeetCodeContest) => ({
        platform: "LeetCode",
        name: c.title,
        startTimeUnix: c.startTime,
        startTime: new Date(c.startTime * 1000).toISOString(),
        durationSeconds: c.duration,
        duration: `${Math.floor(c.duration / 3600)} hours ${
          (c.duration % 3600) / 60
        } minutes`,
        url: `https://leetcode.com/contest/${c.titleSlug}`,
      }));
  } catch {
    return [];
  }
}

function calcDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
  return `${Math.floor(diff / 3600)} hours ${(diff % 3600) / 60} minutes`;
}

async function fetchCodeChef(): Promise<contest[]> {
  try {
    const res = await axios.get(
      "https://www.codechef.com/api/list/contests/all",
      { timeout: 10000 }
    );
    interface CodeChefContest {
      contest_name: string;
      contest_start_date: string;
      contest_end_date: string;
      contest_code: string;
    }

    const future = (res.data.future_contests || []).map(
      (c: CodeChefContest) => ({
        platform: "CodeChef",
        name: c.contest_name,
        startTimeUnix: Math.floor(
          new Date(c.contest_start_date).getTime() / 1000
        ),
        startTime: new Date(c.contest_start_date).toISOString(),
        endTime: new Date(c.contest_end_date).toISOString(),
        duration: calcDuration(c.contest_start_date, c.contest_end_date),
        url: `https://www.codechef.com/${c.contest_code}`,
      })
    );
    const past = (res.data.past_contests || [])
      .slice(0, 50)
      .map((c: CodeChefContest) => ({
        platform: "CodeChef",
        name: c.contest_name,
        startTimeUnix: Math.floor(
          new Date(c.contest_start_date).getTime() / 1000
        ),
        startTime: new Date(c.contest_start_date).toISOString(),
        endTime: new Date(c.contest_end_date).toISOString(),
        duration: calcDuration(c.contest_start_date, c.contest_end_date),
        url: `https://www.codechef.com/${c.contest_code}`,
      }));
    return [...future, ...past];
  } catch {
    return [];
  }
}

async function main() {
  console.log("[CRON] Start update-contests (standalone)");
  try {
    await connectDB();
    const [cf, lc, cc] = await Promise.all([
      fetchCodeforces(),
      fetchLeetCode(),
      fetchCodeChef(),
    ]);
    const all = [...cf, ...lc, ...cc]
      .sort((a, b) => b.startTimeUnix - a.startTimeUnix)
      .slice(0, 200);
    let saved = 0;
    for (const c of all) {
      const existing = await Contest.findOne({ name: c.name });
      if (!existing) {
        await Contest.create(c);
        saved++;
      }
    }
    console.log(`[CRON] Completed. fetched=${all.length} saved=${saved}`);
    process.exit(0);
  } catch (err) {
    console.error("[CRON] Error update-contests", err);
    process.exit(1);
  }
}

main();
