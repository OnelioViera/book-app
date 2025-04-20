"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import { getBookById, deleteBook } from "../../../utils/bookStorage";
import { Book } from "../../../types/book";

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const bookId = params.id as string;
    const foundBook = getBookById(bookId);
    if (!foundBook) {
      router.push("/");
      return;
    }
    setBook(foundBook);
  }, [params.id, router]);

  const handleDelete = () => {
    if (book) {
      deleteBook(book.id);
      router.push("/");
    }
  };

  if (!book) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No Cover</span>
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
