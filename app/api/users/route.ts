import { NextResponse } from "next/server";
import User from "@/models/users"; // adjust path to your User mongoose model
import { connectToDatabase } from "@/lib/mongo"; // your db connection utility

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, { password: 0 }); // exclude passwords
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" + " " + error },
      { status: 500 }
    );
  }
}
