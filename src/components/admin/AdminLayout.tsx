'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  onLogout: () => void;
}

export default function AdminLayout({ children, title, onLogout }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Logo and Brand */}
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <div className="h-8 w-auto relative">
                  <Image
                    src="/logo.png"
                    alt="PawPedia"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">PawPedia</span>
              </div>
              
              {/* Desktop Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Posts
                </Link>
                <Link
                  href="/admin/categories"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/comments"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Comments
                </Link>
              </div>
            </div>
            
            {/* Right side buttons */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href="/"
                target="_blank"
                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
              >
                View Site
              </Link>
              <button
                onClick={onLogout}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              <Link
                href="/admin/dashboard"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/posts"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                onClick={toggleMobileMenu}
              >
                Posts
              </Link>
              <Link
                href="/admin/categories"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                onClick={toggleMobileMenu}
              >
                Categories
              </Link>
              <Link
                href="/admin/comments"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                onClick={toggleMobileMenu}
              >
                Comments
              </Link>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <Link
                    href="/"
                    target="_blank"
                    className="block text-base font-medium text-gray-500 hover:text-gray-800 mb-2"
                    onClick={toggleMobileMenu}
                  >
                    View Site
                  </Link>
                </div>
                <div className="flex items-center px-4">
                  <button
                    onClick={() => {
                      toggleMobileMenu();
                      onLogout();
                    }}
                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 