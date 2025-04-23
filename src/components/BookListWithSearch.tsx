"use client";

import { useState, useEffect } from "react";
import BookList from "./BookList";
import { getBooks } from "../utils/bookStorage";
import { Book } from "../types/book";

export default function BookListWithSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const savedBooks = await getBooks();
        console.log("Fetched books:", savedBooks);
        setBooks(savedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;

    console.log("Search query:", searchQuery);
    console.log("Book:", book.title);
    console.log("Matches search:", matchesSearch);
    console.log("Matches genre:", matchesGenre);

    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(
    new Set(books.map((book) => book.genre).filter(Boolean))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BookList
        selectedGenre={selectedGenre}
        books={filteredBooks}
        setBooksAction={setBooks}
      />
    </div>
  );
}
