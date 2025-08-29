import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import axios from "axios";
import { Contest } from "@/db/model/contest.model";
import { contest } from "@/types/types";

// Lightweight API route for automated daily contest updates from all platforms
export async function GET() {
  try {
    console.log("[CRON] Starting lightweight contest update from all platforms...");

    await connectDB();

    // Fetch from all platforms with reduced limits and timeouts
    const [codeforces, leetcode, codechef] = await Promise.allSettled([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(), 
      fetchCodechefContests(),
    ]);

    let allContests: contest[] = [];

    // Process successful results
    if (codeforces.status === 'fulfilled') {
      allContests.push(...codeforces.value);
    }
    if (leetcode.status === 'fulfilled') {
      allContests.push(...leetcode.value);
    }
    if (codechef.status === 'fulfilled') {
      allContests.push(...codechef.value);
    }

    // Sort and limit to most recent contests
    allContests = allContests
      .sort((a, b) => b.startTimeUnix - a.startTimeUnix)
      .slice(0, 20); // Only keep 20 most recent

    let savedCount = 0;

    // Save to database (only new ones)
    for (const contest of allContests) {
      try {
        const existing = await Contest.findOne({ name: contest.name });
        if (!existing) {
          await Contest.create({
            ...contest,
            solutionLink: "",
            bookmarkedBy: [],
          });
          savedCount++;
          console.log(`[CRON] Added new contest: ${contest.name}`);
        }
      } catch (error) {
        console.error(`[CRON] Error saving contest: ${contest.name}`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lightweight contest update completed",
      timestamp: new Date().toISOString(),
      processed: allContests.length,
      saved: savedCount,
      sources: {
        codeforces: codeforces.status === 'fulfilled' ? codeforces.value.length : 0,
        leetcode: leetcode.status === 'fulfilled' ? leetcode.value.length : 0,
        codechef: codechef.status === 'fulfilled' ? codechef.value.length : 0,
      }
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

// Optimized Codeforces fetcher with timeout
async function fetchCodeforcesContests(): Promise<contest[]> {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list", {
      timeout: 8000, // 8 second timeout
    });

    if (response.data.status !== "OK") {
      throw new Error("Failed to fetch Codeforces contests");
    }

    return response.data.result
      .slice(0, 8) // Only take first 8 contests
      .map((contest: {
        id: number;
        name: string;
        phase: string;
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
      }));
  } catch (error) {
    console.error("Error fetching Codeforces contests:", (error as Error).message);
    return [];
  }
}

// Optimized LeetCode fetcher with timeout
async function fetchLeetcodeContests(): Promise<contest[]> {
  try {
    const graphqlQuery = {
      query: `
        query getContestList {
          allContests {
            title
            startTime
            duration
            titleSlug
          }
        }
      `,
    };

    const response = await axios.post("https://leetcode.com/graphql", graphqlQuery, {
      headers: { "Content-Type": "application/json" },
      timeout: 8000, // 8 second timeout
    });

    return response.data.data.allContests
      .slice(0, 8) // Only take first 8 contests
      .map((contest: {
        title: string;
        startTime: number;
        duration: number;
        titleSlug: string;
      }) => ({
        platform: "LeetCode",
        name: contest.title,
        startTimeUnix: contest.startTime,
        startTime: new Date(contest.startTime * 1000).toISOString(),
        durationSeconds: contest.duration,
        duration: `${Math.floor(contest.duration / 3600)} hours`,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));
  } catch (error) {
    console.error("Error fetching LeetCode contests:", (error as Error).message);
    return [];
  }
}

// Optimized CodeChef fetcher with timeout
async function fetchCodechefContests(): Promise<contest[]> {
  try {
    const response = await axios.get("https://www.codechef.com/api/list/contests/all", {
      timeout: 8000, // 8 second timeout
    });

    if (!response.data.future_contests) {
      throw new Error("Failed to fetch CodeChef contests");
    }

    return response.data.future_contests
      .slice(0, 4) // Only take first 4 contests
      .map((contest: {
        contest_name: string;
        contest_code: string;
        contest_start_date: string;
        contest_end_date: string;
      }) => ({
        platform: "CodeChef",
        name: contest.contest_name,
        startTimeUnix: Math.floor(new Date(contest.contest_start_date).getTime() / 1000),
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: calculateDuration(contest.contest_start_date, contest.contest_end_date),
        url: `https://www.codechef.com/${contest.contest_code}`,
      }));
  } catch (error) {
    console.error("Error fetching CodeChef contests:", (error as Error).message);
    return [];
  }
}

// Helper function
function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  return `${Math.floor(durationSeconds / 3600)} hours`;
}

// Also support POST for webhook-based cron services
export async function POST() {
  return GET();
}
