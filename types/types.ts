export type contest = {
  _id?: string;
  platform: string;
  name: string;
  startTimeUnix: number;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  duration: string;
  url: string;
  bookmarkedBy?: string[];
  solutionLink?: string;
};
