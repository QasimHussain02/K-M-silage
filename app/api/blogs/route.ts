import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import Blog from "@/models/blogs";

export async function GET() {
  try {
    await connectToDatabase();

    const blogs = await Blog.find({})
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({ blogs });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch blogs", error },
      { status: 500 }
    );
  }
}
