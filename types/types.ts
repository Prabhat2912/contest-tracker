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
  solutionLink?: string; // Updated to support multiple solution links
  solutionFetched?: boolean; // Track if solution fetch was attempted
  lastSolutionCheck?: Date; // Track when solution was last checked
  createdAt?: Date;
  updatedAt?: Date;
};
