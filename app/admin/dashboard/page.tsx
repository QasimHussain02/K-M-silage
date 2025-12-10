"use client";

import React, { useState, useRef } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ImageUpload from "@/components/UploadImage";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size: number }>;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Users", icon: Users },
  { name: "Blogs", icon: BookOpen },
  { name: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const imageUploadRef = useRef<{ uploadImage: () => Promise<string | null> }>(
    null
  );

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setSidebarOpen(false);
    setMessage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Upload image if one is selected
      let imageUrl = "";
      if (imageUploadRef.current) {
        imageUrl = (await imageUploadRef.current.uploadImage()) || "";
        console.log("Uploaded image URL:", imageUrl);
      }

      console.log("Sending to API:", {
        title: formData.title,
        content: formData.content,
        imageUrl,
      });

      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          imageUrl,
        }),
      });

      const data = await response.json();
      console.log("Response from API:", data);

      if (response.ok) {
        setMessage({ type: "success", text: "Blog published successfully!" });
        setFormData({ title: "", content: "", email: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create blog.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 transform bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">KM Silage</h1>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden rounded-lg p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-8">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Navigation
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700 px-6 py-4">
          <p className="text-xs text-gray-500">© 2025 KM Silage Admin</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4 bg-white px-4 py-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{activeMenu}</h2>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          {activeMenu === "Blogs" ? (
            <div className="mx-auto max-w-2xl">
              {/* Header */}
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  Create New Blog
                </h1>
                <p className="text-gray-600">
                  Share your insights and knowledge with the community
                </p>
              </div>

              {/* Blog Form Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Enter an engaging title..."
                      required
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
                      required
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-900"
                    >
                      Author Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <ImageUpload ref={imageUploadRef} />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Publishing...
                      </span>
                    ) : (
                      "Publish Blog"
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
                        message.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                  {menuItems.find((m) => m.name === activeMenu)?.icon &&
                    React.createElement(
                      menuItems.find((m) => m.name === activeMenu)!.icon,
                      { size: 32 }
                    )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeMenu}
                </h2>
                <p className="mt-2 text-gray-600">
                  Welcome to the {activeMenu} section
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
