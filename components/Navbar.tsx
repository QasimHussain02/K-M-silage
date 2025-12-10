"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };
  if (status !== "authenticated") return null;

  return (
    <nav className="bg-gradient-to-b from-gray-900 to-gray-800 text-white  shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <span className="text-white font-bold text-lg">KM</span>
              </div>
              <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                KM-Silage
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/blogs"
              className="px-4 py-2  font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
            >
              Blogs
            </Link>
          </div>
          {session?.user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="px-4 py-2  font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
            >
              Dashboard
            </Link>
          )}
          {/* Right Side - Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" && session ? (
              <>
                <div className="text-sm ">
                  <span className="font-medium ">{session.user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : status === "loading" ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-6 py-2 text-gray-700 font-semibold hover:text-green-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link
              href="/blogs"
              className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            {session?.user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              {status === "authenticated" && session ? (
                <>
                  <div className="px-4 text-sm">
                    <span className="font-medium ">{session.user?.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : status === "loading" ? (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-gray-700 font-semibold hover:text-green-600 transition-colors duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
