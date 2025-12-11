"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, CheckCircle } from "lucide-react";

const EditBlog = () => {
  const params = useParams();
  const blogId = params?.id;

  const [formData, setFormData] = useState({
    title: "Modern Silage Production Techniques",
    content:
      "Discover the latest advancements in silage production and preservation methods for optimal livestock nutrition. This comprehensive guide covers modern approaches...",
    imageUrl:
      "https://res.cloudinary.com/dlomhgrfl/image/upload/v1765383332/zywv33zb7hkdfuegxcjl.png",
    authorEmail: "qhofficial12345@gmail.com",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState(formData.imageUrl);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Functionality will be added later
    console.log("Updating blog:", formData);

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: "Blog updated successfully!",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Edit Blog Post
          </h1>
          <p className="text-gray-600">
            Update your blog content, images, and other details
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Blog ID Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Blog ID:</span> {blogId}
              </p>
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here..."
                rows={10}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                Write detailed content for your blog post
              </p>
            </div>

            {/* Author Email Input */}
            <div>
              <label
                htmlFor="authorEmail"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Author Email
              </label>
              <input
                type="email"
                id="authorEmail"
                name="authorEmail"
                value={formData.authorEmail}
                onChange={handleInputChange}
                placeholder="author@example.com"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Image Section */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Featured Image
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
                  <div className="relative h-64 md:h-80 w-full">
                    <Image
                      src={imagePreview}
                      alt="Blog preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-300">
                    <p className="text-xs text-gray-600 truncate">
                      Current image: {formData.imageUrl}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Upload Area */}
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-colors duration-300">
                <label
                  htmlFor="imageUrl"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 50MB
                    </p>
                  </div>
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Image URL Input */}
            <div>
              <label
                htmlFor="imageUrlInput"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Or paste image URL
              </label>
              <input
                type="url"
                id="imageUrlInput"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </span>
              ) : (
                "Update Blog Post"
              )}
            </button>
          </form>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mt-6 flex items-center gap-3 rounded-lg border p-4 ${
                message.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tips for Better Blog Posts
          </h2>
          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep your title clear and descriptive for better SEO</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                Use high-quality images that are relevant to your content
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                Break your content into paragraphs for better readability
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep your author email updated for proper attribution</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
