// Scheduler service for automated tasks
export class SchedulerService {
  private static instance: SchedulerService;
  private intervals: { [key: string]: NodeJS.Timeout } = {};

  private constructor() {}

  public static getInstance(): SchedulerService {
    if (!SchedulerService.instance) {
      SchedulerService.instance = new SchedulerService();
    }
    return SchedulerService.instance;
  }

  /**
   * Schedule daily contest updates at specified time (24-hour format)
   * Default: 00:00 UTC (midnight)
   */
  public scheduleDailyContestUpdates(
    hour: number = 0,
    minute: number = 0
  ): void {
    // Clear existing interval if any
    if (this.intervals.contestUpdates) {
      clearInterval(this.intervals.contestUpdates);
    }

    const scheduleNextUpdate = () => {
      const now = new Date();
      const scheduled = new Date();
      scheduled.setUTCHours(hour, minute, 0, 0);

      // If the scheduled time has passed today, schedule for tomorrow
      if (scheduled <= now) {
        scheduled.setUTCDate(scheduled.getUTCDate() + 1);
      }

      const timeUntilNext = scheduled.getTime() - now.getTime();

      console.log(
        `[SCHEDULER] Next contest update scheduled for: ${scheduled.toISOString()}`
      );

      setTimeout(async () => {
        try {
          console.log("[SCHEDULER] Executing daily contest update...");

          // Call the internal API endpoint
          const response = await fetch("/api/cron/update-contests", {
            method: "POST",
            headers: {
              authorization: `Bearer ${process.env.CRON_SECRET}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            console.log(
              "[SCHEDULER] Daily contest update completed successfully"
            );
          } else {
            console.error(
              "[SCHEDULER] Daily contest update failed:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("[SCHEDULER] Error in daily contest update:", error);
        }

        // Schedule the next update (24 hours later)
        scheduleNextUpdate();
      }, timeUntilNext);
    };

    scheduleNextUpdate();
  }

  /**
   * Schedule solution fetching to run every 6 hours
   * This ensures we catch solutions posted after contests end
   */
  public scheduleSolutionFetching(): void {
    // Clear existing interval if any
    if (this.intervals.solutionFetching) {
      clearInterval(this.intervals.solutionFetching);
    }

    const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

    console.log(
      "[SCHEDULER] Starting solution fetching scheduler (every 6 hours)"
    );

    // Run immediately on start
    this.runSolutionFetching();

    // Then schedule to run every 6 hours
    this.intervals.solutionFetching = setInterval(() => {
      this.runSolutionFetching();
    }, SIX_HOURS);
  }

  private async runSolutionFetching(): Promise<void> {
    try {
      console.log("[SCHEDULER] Executing solution fetching...");

      const response = await fetch("/api/cron/fetch-solutions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.CRON_SECRET}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          `[SCHEDULER] Solution fetching completed. Processed: ${result.processed}, Found: ${result.solutionsFound}`
        );
      } else {
        console.error(
          "[SCHEDULER] Solution fetching failed:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("[SCHEDULER] Error in solution fetching:", error);
    }
  }

  /**
   * Stop all scheduled tasks
   */
  public stopAllSchedules(): void {
    Object.values(this.intervals).forEach((interval) => {
      if (interval) {
        clearInterval(interval);
      }
    });
    this.intervals = {};
    console.log("[SCHEDULER] All scheduled tasks stopped");
  }

  /**
   * Get status of all scheduled tasks
   */
  public getScheduleStatus(): { [key: string]: boolean } {
    return {
      contestUpdates: !!this.intervals.contestUpdates,
      solutionFetching: !!this.intervals.solutionFetching,
    };
  }
}
