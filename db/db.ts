import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error("MongoDB URI is missing");
    return;
  }
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "contest-tracker",
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
  }
};
