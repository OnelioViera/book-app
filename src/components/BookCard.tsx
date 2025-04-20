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
                className="object-cover"
                loader={({ src }) => src}
                unoptimized={
                  book.coverImage.startsWith("data:image") ||
                  book.coverImage.startsWith("img_")
                }
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
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
