"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  isSelected?: boolean;
  onSelect?: (bookId: string) => void;
  onDragStart?: (e: React.DragEvent, bookId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, bookId: string) => void;
}

const BookCard = ({
  book,
  isSelected,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: BookCardProps) => {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Function to determine the image source
  const getImageSource = () => {
    if (!book.coverImage) return null;

    // If it's a base64 string
    if (book.coverImage.startsWith("data:image")) {
      return book.coverImage;
    }

    // If it's a URL
    if (book.coverImage.startsWith("http")) {
      return book.coverImage;
    }

    // If it's a local image path
    return `/api/images/${book.coverImage}`;
  };

  const imageSource = getImageSource();

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out ${
        isDragging ? "scale-95 opacity-75" : ""
      } ${isDragOver ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart?.(e, book.id);
        e.dataTransfer.setData("text/plain", book.id);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        setIsDragOver(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver?.(e);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop?.(e, book.id);
      }}
    >
      <div
        className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
          isDragging ? "opacity-0" : "opacity-100"
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect?.(book.id)}
          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>
      <div
        className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
          isDragging ? "shadow-2xl" : ""
        }`}
      >
        <div className="relative aspect-square w-full">
          {imageSource ? (
            <Image
              src={imageSource}
              alt={book.title}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              quality={75}
              unoptimized={true}
              onError={(e) => {
                console.error("Image failed to load:", imageSource);
                e.currentTarget.src = "/placeholder-book.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
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
        <div className="border-t border-gray-200" />
        <div className="p-4 space-y-2">
          <div className="block">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm font-medium text-gray-600 line-clamp-1">
              by {book.author}
            </p>
          </div>
          {book.genre && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {book.genre}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            {book.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-sm font-medium text-gray-700">
                  {book.rating.toFixed(1)}
                </span>
              </div>
            )}
            {book.isRead && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Read
              </span>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!book.id) {
                  console.error("No book ID available");
                  return;
                }
                console.log("Edit button clicked for book:", book.id);
                router.push(`/edit-book/${book.id}`);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
