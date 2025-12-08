import mongoose from "mongoose";

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI! as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    throw err;
  }
}
