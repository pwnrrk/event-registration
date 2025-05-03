import mongoose from "mongoose";

const cached = new Map();

export async function connectToDatabase() {
  if (cached.has("connection")) return cached.get("connection");

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is not found in .env");

  const connection = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  console.log(`Connected to ${MONGODB_URI}`);

  cached.set("connection", connection);
  return connection;
}
