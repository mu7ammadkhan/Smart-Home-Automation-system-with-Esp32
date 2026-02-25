import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;
if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in .env.local File");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
