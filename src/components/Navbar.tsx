"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-gray-800 hover:text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                Polly&apos;s Books
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              Home
            </Link>
            <Link
              href="/add-book"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Add Book
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
