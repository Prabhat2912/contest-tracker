import { NextResponse } from "next/server";
import { SchedulerService } from "@/lib/scheduler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    // Verify authorization for admin actions
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scheduler = SchedulerService.getInstance();

    switch (action) {
      case "start":
        // Start all scheduled tasks
        scheduler.scheduleDailyContestUpdates(
          params.contestUpdateHour || 0,
          params.contestUpdateMinute || 0
        );
        scheduler.scheduleSolutionFetching();

        return NextResponse.json({
          success: true,
          message: "All schedulers started successfully",
          status: scheduler.getScheduleStatus(),
          timestamp: new Date().toISOString(),
        });

      case "stop":
        // Stop all scheduled tasks
        scheduler.stopAllSchedules();

        return NextResponse.json({
          success: true,
          message: "All schedulers stopped",
          timestamp: new Date().toISOString(),
        });

      case "status":
        // Get current status
        return NextResponse.json({
          success: true,
          status: scheduler.getScheduleStatus(),
          timestamp: new Date().toISOString(),
        });

      case "restart":
        // Restart all schedulers
        scheduler.stopAllSchedules();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

        scheduler.scheduleDailyContestUpdates(
          params.contestUpdateHour || 0,
          params.contestUpdateMinute || 0
        );
        scheduler.scheduleSolutionFetching();

        return NextResponse.json({
          success: true,
          message: "All schedulers restarted successfully",
          status: scheduler.getScheduleStatus(),
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use 'start', 'stop', 'status', or 'restart'",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[SCHEDULER API] Error:", error);

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
  try {
    // Simple health check and status endpoint
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scheduler = SchedulerService.getInstance();

    return NextResponse.json({
      success: true,
      status: scheduler.getScheduleStatus(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
