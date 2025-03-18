import mongoose, { Schema } from "mongoose";

const ContestSchema = new Schema({
  platform: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  startTimeUnix: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  durationSeconds: { type: Number },
  duration: { type: String, required: true },
  url: { type: String, required: true },
  solutionLink: { type: String },
  bookmarkedBy: { type: [String] },
});

export const Contest =
  mongoose.models.Contest || mongoose.model("Contest", ContestSchema);
