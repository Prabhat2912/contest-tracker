import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
import { contest } from "@/types/types";

export const getAllContests = async () => {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests(),
      fetchCodechefContests(),
    ]);

    const allContests: contest[] = [...codeforces, ...leetcode, ...codechef]
      .sort((a, b) => b.startTimeUnix - a.startTimeUnix)
      .slice(0, 300);
    await saveContestsToDB(allContests);

    return NextResponse.json({
      status: "success",
      count: allContests.length,
      data: allContests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

async function fetchCodeforcesContests(): Promise<contest[]> {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");

    if (response.data.status !== "OK") {
      throw new Error("Failed to fetch Codeforces contests");
    }

    return response.data.result.map(
      (contest: {
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
        duration: `${Math.floor(contest.durationSeconds / 3600)} hours ${
          (contest.durationSeconds % 3600) / 60
        } minutes`,
        url: `https://codeforces.com/contests/${contest.id}`,
      })
    );
  } catch (error) {
    console.error(
      "Error fetching Codeforces contests:",
      (error as Error).message
    );
    return [];
  }
}

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

    const response = await axios.post(
      "https://leetcode.com/graphql",
      graphqlQuery,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const allContests = response.data.data.allContests;

    return allContests.map(
      (contest: {
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
        duration: `${Math.floor(contest.duration / 3600)} hours ${
          (contest.duration % 3600) / 60
        } minutes`,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      })
    );
  } catch (error) {
    console.error(
      "Error fetching LeetCode contests:",
      (error as Error).message
    );
    return [];
  }
}

async function fetchCodechefContests(): Promise<contest[]> {
  try {
    const response = await axios.get(
      "https://www.codechef.com/api/list/contests/all"
    );

    if (!response.data.future_contests || !response.data.past_contests) {
      throw new Error("Failed to fetch CodeChef contests");
    }

    const futureContests = response.data.future_contests.map(
      (contest: {
        contest_name: string;
        contest_code: string;
        contest_start_date: string;
        contest_end_date: string;
      }) => ({
        platform: "CodeChef",
        name: contest.contest_name,
        startTimeUnix: Math.floor(
          new Date(contest.contest_start_date).getTime() / 1000
        ),
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: calculateDuration(
          contest.contest_start_date,
          contest.contest_end_date
        ),
        url: `https://www.codechef.com/${contest.contest_code}`,
      })
    );

    const pastContests = response.data.past_contests.map(
      (contest: {
        contest_name: string;
        contest_code: string;
        contest_start_date: string;
        contest_end_date: string;
      }) => ({
        platform: "CodeChef",
        name: contest.contest_name,
        startTimeUnix: Math.floor(
          new Date(contest.contest_start_date).getTime() / 1000
        ),
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: calculateDuration(
          contest.contest_start_date,
          contest.contest_end_date
        ),
        url: `https://www.codechef.com/${contest.contest_code}`,
      })
    );

    return [...futureContests, ...pastContests];
  } catch (error) {
    console.error(
      "Error fetching CodeChef contests:",
      (error as Error).message
    );
    return [];
  }
}

function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  return `${Math.floor(durationSeconds / 3600)} hours ${
    (durationSeconds % 3600) / 60
  } minutes`;
}

export const saveContestsToDB = async (contests: contest[]) => {
  await connectDB();

  for (const contest of contests) {
    try {
      const existingContest = await Contest.findOne({ name: contest.name });

      if (!existingContest) {
        await Contest.create(contest);
      }
    } catch (error) {
      console.error(`Error saving contest ${contest.name}:`, error);
    }
  }
};
