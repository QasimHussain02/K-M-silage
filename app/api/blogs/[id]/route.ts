import { connectToDatabase } from "@/lib/mongo";
import Blog from "@/models/blogs";
import { NextRequest, NextResponse } from "next/server";
interface BlogDetailsProps {
  params: { id: string };
}

export const DELETE = async (
  req: NextRequest,
  { params }: BlogDetailsProps
) => {
  try {
    const { id } = await params;
    console.log("Deleting blog with ID:", id);

    await connectToDatabase();
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete blog", error },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest, { params }: BlogDetailsProps) => {
  const { id } = await params;
  try {
    await connectToDatabase();
    if (!id) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch blog", error },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, { params }: BlogDetailsProps) => {
  const { id } = await params;
  try {
    await connectToDatabase();
    if (!id) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const { title, content, imageUrl, authorEmail } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        imageUrl,
        authorEmail,
      },
      { new: true }
    ).lean();

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Failed to update blog", error },
      { status: 500 }
    );
  }
};
