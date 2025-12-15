"use client";
import { IBlog } from "@/models/blogs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For Next 13+ App Router
import LikeButton from "@/components/LikeButton";

interface OpenMenuId {
  [key: string]: boolean;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<OpenMenuId>({});
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();
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

  const toggleMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    blogId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
  };
  const handleDelete = async (blogId: string) => {
    try {
      console.log("delete it");
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert(data.message || "Failed to delete blog");
        return;
      }
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id?.toString() !== blogId)
      );
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  const handleEdit = (blogId: string) => {
    router.push(`/blogs/editBlogs/${blogId}`);
  };
  const closeMenu = (blogId: string) => {
    setOpenMenuId((prev) => ({
      ...prev,
      [blogId]: false,
    }));
  };

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // Functionality will be added later
    console.log(`Action: ${action}`);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {blogs.map((blog) => (
              <div
                key={blog._id?.toString() || Math.random().toString()}
                className="relative"
                onMouseLeave={() => closeMenu(blog._id?.toString() || "")}
              >
                <Link href={`/blogs/${blog._id}`}>
                  <article className="h-full flex flex-col group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
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

                      {/* 3-Dots Menu Button (Admin Only) */}
                      {isAdmin && (
                        <button
                          onClick={(e) =>
                            toggleMenu(e, blog._id?.toString() || "")
                          }
                          className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm z-10"
                          aria-label="Blog options"
                        >
                          <MoreVertical size={18} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-6 md:p-7 flex flex-col grow">
                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {blog.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                        {truncateText(blog.content, 20)}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center mt-auto gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all duration-300">
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
                </Link>

                {/* Dropdown Menu */}
                {isAdmin && (
                  <div
                    className={`absolute top-12 right-3 w-48 bg-white rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95 overflow-hidden z-50 transition-all duration-200 origin-top-right ${
                      openMenuId[blog._id?.toString() || ""]
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    {/* Edit Option */}
                    <button
                      onClick={(e) => {
                        handleMenuItemClick(e, "edit");
                        handleEdit(blog._id?.toString() || "");
                        closeMenu(blog._id?.toString() || "");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border-b border-gray-100 text-sm font-medium"
                    >
                      <Edit2 size={16} />
                      <span>Edit Blog</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      onClick={(e) => {
                        handleMenuItemClick(e, "delete");
                        closeMenu(blog._id?.toString() || "");
                        handleDelete(blog._id?.toString() || "");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      <span>Delete Blog</span>
                    </button>
                  </div>
                )}
              </div>
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
