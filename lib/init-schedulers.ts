import { SchedulerService } from "@/lib/scheduler";

// Initialize schedulers when the application starts
export function initializeSchedulers() {
  // Only run schedulers in production or when explicitly enabled
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_SCHEDULERS === "true"
  ) {
    const scheduler = SchedulerService.getInstance();

    console.log("[INIT] Starting automated schedulers...");

    // Start daily contest updates (default: midnight UTC)
    const contestHour = parseInt(process.env.CONTEST_UPDATE_HOUR || "0");
    const contestMinute = parseInt(process.env.CONTEST_UPDATE_MINUTE || "0");

    scheduler.scheduleDailyContestUpdates(contestHour, contestMinute);

    // Start solution fetching (every 6 hours)
    scheduler.scheduleSolutionFetching();

    console.log("[INIT] All schedulers initialized successfully");
    console.log("[INIT] Schedule status:", scheduler.getScheduleStatus());
  } else {
    console.log("[INIT] Schedulers disabled in development mode");
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[SHUTDOWN] Stopping all schedulers...");
  const scheduler = SchedulerService.getInstance();
  scheduler.stopAllSchedules();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[SHUTDOWN] Stopping all schedulers...");
  const scheduler = SchedulerService.getInstance();
  scheduler.stopAllSchedules();
  process.exit(0);
});
