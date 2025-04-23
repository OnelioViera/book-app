"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import {
  getBookById,
  deleteBook,
  updateBook,
} from "../../../utils/bookStorage";
import { Book } from "../../../types/book";
import toast from "react-hot-toast";

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const bookId = params.id as string;
      const foundBook = await getBookById(bookId);
      if (!foundBook) {
        router.push("/");
        return;
      }
      setBook(foundBook);
    };

    fetchBook();
  }, [params.id, router]);

  const handleDelete = () => {
    if (book) {
      deleteBook(book.id);
      router.push("/");
    }
  };

  const handleMarkAsRead = async () => {
    if (book) {
      try {
        await updateBook(book.id, { ...book, isRead: !book.isRead });
        setBook({ ...book, isRead: !book.isRead });
        toast.success(`Book marked as ${!book.isRead ? "read" : "unread"}!`);
      } catch (error: unknown) {
        console.error("Failed to update book status:", error);
        toast.error("Failed to update book status");
      }
    }
  };

  if (!book) {
    return null;
  }

  return (
    <main
      className="min-h-screen bg-gray-50 cursor-pointer"
      onClick={(e) => {
        // Only navigate if clicking the main container, not its children
        if (e.target === e.currentTarget) {
          router.push("/");
        }
      }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full aspect-[2/3]">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={true}
                    quality={90}
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              {book.rating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-gray-600 text-lg ml-1">
                    {book.rating.toFixed(1)}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {book.genre && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Genre</h3>
                    <p className="text-gray-900">{book.genre}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {book.description}
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={handleMarkAsRead}
                    className={`${
                      book.isRead
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-4 py-2 rounded-md transition-colors`}
                  >
                    {book.isRead ? "Mark as Unread" : "Mark as Read"}
                  </button>
                  <button
                    onClick={() => router.push(`/edit-book/${book.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
