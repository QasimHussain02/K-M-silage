import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongo";
import Blog from "@/models/blogs";
import { paramsProps } from "../comments/route";

export async function POST(req: Request, { params }: paramsProps) {
  await connectToDatabase();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }

  const alreadyLiked = blog.likes.includes(userId);

  if (alreadyLiked) {
    // Unlike
    blog.likes.pull(userId);
  } else {
    // Like
    blog.likes.push(userId);
  }

  await blog.save();

  return NextResponse.json({ likes: blog.likes });
}
