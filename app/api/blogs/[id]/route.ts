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
