import { Contest } from "@/db/model/contest.model";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { contestName, userId } = await req.json();
    const contest = await Contest.findOne({ name: contestName });
    if (!contest) {
      return NextResponse.json(
        {
          status: "error",
          message: "Contest not found",
        },
        { status: 404 }
      );
    }
    if (contest.bookmarkedBy.includes(userId)) {
      contest.bookmarkedBy = contest.bookmarkedBy.filter(
        (id: string) => id !== userId
      );
    } else {
      await contest.bookmarkedBy.push(userId);
    }
    await contest.save();

    return NextResponse.json({ status: "success", data: contest });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
