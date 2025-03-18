import { NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import { Contest } from "@/db/model/contest.model";
export async function GET() {
  try {
    await connectDB();

    const contests = await Contest.find({}).lean();
    console.log(`Fetched ${contests.length} contests`);
    return NextResponse.json(
      { status: "success", data: contests },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch contests" },
      { status: 500 }
    );
  }
}
