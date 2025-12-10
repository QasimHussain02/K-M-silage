import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/lib/mongo";
import Blog from "@/models/blogs";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  // 1. Authenticate admin
  try {
    console.log("=== API ROUTE HIT ===");
    console.log("Request URL:", req.url);
    console.log("Request method:", req.method);

    const token = await getToken({ req, secret: SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request
    const body = await req.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));

    const { title, content, imageUrl } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Missing title or content" },
        { status: 400 }
      );
    }

    // 3. Connect to DB and create blog
    await connectToDatabase();

    const blog = await Blog.create({
      title,
      content,
      authorEmail: token.email,
      imageUrl: imageUrl || "",
    });

    console.log("Blog created successfully!");
    console.log("Full blog object:", JSON.stringify(blog, null, 2));
    console.log("imageUrl value:", blog.imageUrl);

    const blogObject = blog.toObject();

    return NextResponse.json(
      {
        message: "Blog created successfully",
        blog: blogObject,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
