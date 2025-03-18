import { getAllContests } from "@/lib/contestController";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contests = await getAllContests();

    return contests;
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
