"use client";
import { IBlog } from "@/models/blogs";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Blogs() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  function truncateText(text: string, maxWords: number) {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading blogs...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              K-M Silage
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore insights, tips, and research on modern agricultural
              practices, soil management, and sustainable farming
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id?.toString() || Math.random().toString()}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                  <Image
                    src={
                      blog.imageUrl ||
                      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop"
                    }
                    alt={blog.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-7">
                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {blog.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                    {truncateText(blog.content, 20)} {/* show first 20 words */}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all duration-300">
                    <span>Read Article</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Updated with Latest Insights
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Subscribe to our newsletter to receive the latest articles and
            research directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-white flex-1 sm:flex-none sm:w-64"
            />
            <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
