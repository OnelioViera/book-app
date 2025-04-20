import Link from "next/link";
import Image from "next/image";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const BookCard = ({ book, isSelected, onSelect }: BookCardProps) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect?.(book.id)}
          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/books/${book.id}`}>
          <div className="relative h-48 w-full">
            {book.coverImage ? (
              <Image
                src={
                  book.coverImage.startsWith("http")
                    ? book.coverImage
                    : book.coverImage.startsWith("img_")
                      ? localStorage.getItem(book.coverImage) || ""
                      : `/api/images/${book.coverImage}`
                }
                alt={book.title}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
                quality={75}
                loader={({ src }) => src}
                unoptimized={
                  book.coverImage.startsWith("data:image") ||
                  book.coverImage.startsWith("img_")
                }
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
            {book.genre && (
              <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
            )}
            {book.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm text-gray-600">
                  {book.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
