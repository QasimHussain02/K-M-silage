"use client";

import React, { useEffect, useState } from "react";
import { Trash2, ChevronDown, Search, UserCircle } from "lucide-react";
import { IUser } from "@/models/users";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function UsersTable() {
  const { data: session } = useSession();

  const loggedInUserId = session?.user?.id;
  console.log("Logged-in user ID:", loggedInUserId);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error("Failed to update role");
      }

      const data = await res.json();
      console.log(data);

      // ✅ Update state after DB success
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setOpenDropdown(null);
    } catch (error) {
      console.error("Role update failed:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // TODO: Implement API call to delete user
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      // Remove user from state after successful deletion
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      console.log(`User ${userId} deleted successfully`);
    } catch {
      console.error("Delete failed:");
      // Optional: show a toast notification
    }
    setUsers(users.filter((user) => user._id !== userId));
    console.log(`Delete user ${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage user roles and permissions across your platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {users.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <UserCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <UserCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {users.filter((u) => u.role === "user").length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <UserCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === user._id ? null : user._id
                          )
                        }
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        <span className="capitalize">{user.role}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {openDropdown === user._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdown(null)}
                          />
                          <div className="absolute left-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                            <button
                              onClick={() =>
                                handleRoleChange(user._id, "admin")
                              }
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
                            >
                              Admin
                            </button>
                            <button
                              onClick={() => handleRoleChange(user._id, "user")}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            >
                              User
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user._id !== loggedInUserId && ( // hide if this is the logged-in admin
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Users Cards - Mobile */}
      <div className="space-y-4 md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="relative inline-block">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === user._id ? null : user._id)
                  }
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <span className="capitalize">{user.role}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {openDropdown === user._id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={() => handleRoleChange(user._id, "admin")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => handleRoleChange(user._id, "user")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        User
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => handleDeleteUser(user._id)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-gray-500">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
