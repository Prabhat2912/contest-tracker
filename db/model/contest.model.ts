import mongoose, { Schema } from "mongoose";

const ContestSchema = new Schema(
  {
    platform: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    startTimeUnix: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String },
    durationSeconds: { type: Number },
    duration: { type: String, required: true },
    url: { type: String, required: true },
    solutionLinks: { type: [String], default: [] }, // Support multiple solution links
    bookmarkedBy: { type: [String], default: [] },
    solutionFetched: { type: Boolean, default: false }, // Track if solution fetch was attempted
    lastSolutionCheck: { type: Date }, // Track when solution was last checked
  },
  {
    timestamps: true, // Add createdAt and updatedAt automatically
  }
);

export const Contest =
  mongoose.models.Contest || mongoose.model("Contest", ContestSchema);
