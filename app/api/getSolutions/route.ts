import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { contestNames } = await request.json();

    if (!Array.isArray(contestNames) || contestNames.length === 0) {
      return NextResponse.json(
        { error: "Contest Names array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not found" },
        { status: 500 }
      );
    }

    const updatedContests = [];

    for (const contestName of contestNames) {
      if (!contestName) continue;

      const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        contestName
      )}&key=${apiKey}`;

      const response = await fetch(youtubeApiUrl);
      const data = await response.json();
      console.log("YouTube API response:", data);
      if (!data.items || data.items.length === 0) {
        console.log(`No solution found for ${contestName}`);
        continue;
      }

      const solutionLink = `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
      console.log(`Solution for ${contestName}: ${solutionLink}`);

      const contests = await Contest.find({ name: contestName });

      if (contests.length === 0) {
        console.log(`Contest ${contestName} not found in database`);
        continue;
      }

      for (const contest of contests) {
        if (!contest.solutionLink) {
          contest.solutionLink = solutionLink;
          await contest.save();
          updatedContests.push(contest);
        }
      }
    }

    return NextResponse.json({
      message: "Solution links updated successfully",
      updatedContests,
    });
  } catch (error) {
    console.error("Error saving solution links:", error);
    return NextResponse.json(
      { error: "Failed to save solution links" },
      { status: 500 }
    );
  }
}
