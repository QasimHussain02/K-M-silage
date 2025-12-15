// app/api/comments/[commentId]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Comment from "@/models/comment";
import { connectToDatabase } from "@/lib/mongo";

const SECRET = process.env.NEXTAUTH_SECRET;
const MAX_COMMENT_LENGTH = 1000;
const MIN_COMMENT_LENGTH = 1;

function sanitize(input: string) {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
interface BlogDetailsProps {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: BlogDetailsProps) {
  const { id } = await params;
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const rawContent = (body?.content || "").toString();
    const content = sanitize(rawContent);
    if (
      content.length < MIN_COMMENT_LENGTH ||
      content.length > MAX_COMMENT_LENGTH
    ) {
      return NextResponse.json(
        { message: "Comment length invalid" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const comment = await Comment.findById(id);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );

    // Check ownership or admin
    const isOwner = String(comment.userId) === String(token.sub);
    const isAdmin = token.role === "admin";
    if (!isOwner && !isAdmin)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    return NextResponse.json({ message: "Comment updated", comment });
  } catch (err) {
    console.error("PUT comment error:", err);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: BlogDetailsProps) {
  const { id } = await params;
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const comment = await Comment.findById(id);
    if (!comment)
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );

    const isOwner = String(comment.userId) === String(token.sub);
    const isAdmin = token.role === "admin";
    if (!isOwner && !isAdmin)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Soft delete
    comment.isDeleted = true;
    comment.content = "[deleted]";
    await comment.save();

    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("DELETE comment error:", err);
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
