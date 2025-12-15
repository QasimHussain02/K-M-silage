import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Blog from "@/models/blogs";
import { connectToDatabase } from "@/lib/mongo"; // adjust if your helper name/path differs
import Comment from "@/models/comment";

const SECRET = process.env.NEXTAUTH_SECRET;
const MAX_COMMENT_LENGTH = 1000;
const MIN_COMMENT_LENGTH = 1;

// Simple sanitizer: strip tags (basic). For production use a library (sanitize-html / DOMPurify).
function sanitize(input: string) {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
export interface paramsProps {
  params: { id: string };
}
export async function GET(req: NextRequest, { params }: paramsProps) {
  const { id } = await params;
  const blogId = id;
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(50, Number(url.searchParams.get("limit") || 10));
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();

    // Ensure blog exists (optional, could skip for slight perf)
    const blog = await Blog.findById(blogId).lean();
    if (!blog)
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const [comments, total] = await Promise.all([
      Comment.find({ blogId, isDeleted: false, status: "published" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ blogId, isDeleted: false, status: "published" }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      comments,
    });
  } catch (err) {
    console.error("GET comments error:", err);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest, { params }: paramsProps) {
  const { id } = await params;
  const blogId = id;
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const content = (body?.content || "").toString();
    const parentId = body?.parentId || null;
    const sanitizedContent = sanitize(content);
    if (
      sanitizedContent.length < MIN_COMMENT_LENGTH ||
      sanitizedContent.length > MAX_COMMENT_LENGTH
    ) {
      return NextResponse.json(
        {
          message: `Comment must be between ${MIN_COMMENT_LENGTH} and ${MAX_COMMENT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const blog = await Blog.findById(blogId).lean();
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    const userName = token.name || token.email || "Anonymous";
    const newComment = await Comment.create({
      blogId,
      userId: token.sub,
      userName,
      userEmail: token.email || "",
      content: sanitizedContent,
      parentId,
      status: "published",
    });
    return NextResponse.json({ message: "Comment added", comment: newComment });
  } catch (err) {
    return NextResponse.json(
      { message: "Comment error", error: err },
      { status: 500 }
    );
  }
}
