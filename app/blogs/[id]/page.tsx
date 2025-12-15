import { connectToDatabase } from "@/lib/mongo";
import Blog from "@/models/blogs";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import Comments from "@/components/Comments";
import LikeButton from "@/components/LikeButton";

interface BlogDetailsProps {
  params: { id: string };
}

export default async function BlogDetails({ params }: BlogDetailsProps) {
  const { id } = await params;
  await connectToDatabase();
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/blogs"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = blog.createdAt
    ? format(new Date(blog.createdAt), "MMMM dd, yyyy 'at' hh:mm a")
    : "Date not available";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.814 6.946z" />
              </svg>
              <span className="font-medium">{blog.authorEmail}</span>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <time dateTime={blog.createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-12">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {/* <LikeButton blogId={blog._id.toString()} likes={blog.likes} /> */}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
              {blog.content}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Published
              </h3>
              <p className="text-gray-900 font-medium">
                {format(new Date(blog.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Author
              </h3>
              <p className="text-gray-900 font-medium truncate">
                {blog.authorEmail}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Last Updated
              </h3>
              <p className="text-gray-900 font-medium">
                {format(new Date(blog.updatedAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Interested in more insights?
            </h3>
            <p className="text-blue-100 mb-6">
              Explore other articles and stay updated with the latest in
              agricultural practices.
            </p>
            <Link
              href="/blogs"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore More Articles
            </Link>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white">
        <Comments blogId={blog._id.toString()} />
      </div>

      {/* Related Articles Section (Optional) */}
      <section className="bg-gray-100 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            More Articles
          </h2>
          <Link
            href="/blogs"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
