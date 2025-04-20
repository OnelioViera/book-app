"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { Book } from "../types/book";
import { getBooks, deleteBook } from "../utils/bookStorage";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const handleSelectBook = (bookId: string) => {
    const newSelectedBooks = new Set(selectedBooks);
    if (newSelectedBooks.has(bookId)) {
      newSelectedBooks.delete(bookId);
    } else {
      newSelectedBooks.add(bookId);
    }
    setSelectedBooks(newSelectedBooks);
  };

  const handleSelectAll = () => {
    setSelectedBooks(new Set(books.map((book) => book.id)));
  };

  const handleDeselectAll = () => {
    setSelectedBooks(new Set());
  };

  const handleDeleteSelected = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete {selectedBooks.size} book
                  {selectedBooks.size !== 1 ? "s" : ""}?
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone. Are you sure you want to delete
                  the selected book{selectedBooks.size !== 1 ? "s" : ""}?
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Remove selected books from the list
                const updatedBooks = books.filter(
                  (book) => !selectedBooks.has(book.id)
                );
                setBooks(updatedBooks);

                // Delete selected books from localStorage
                selectedBooks.forEach((bookId) => deleteBook(bookId));

                // Clear selection
                setSelectedBooks(new Set());

                toast.dismiss(t.id);
                toast.success("Books deleted successfully!");
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 0, // No auto-dismiss
        position: "top-center",
      }
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const selectedBookList = books.filter((book) => selectedBooks.has(book.id));

    // Add title
    doc.setFontSize(20);
    doc.text("My Book Collection", 14, 20);

    // Add table
    const tableData = selectedBookList.map((book) => [
      book.title,
      book.author,
      book.genre || "N/A",
      book.rating ? book.rating.toFixed(1) : "N/A",
    ]);

    autoTable(doc, {
      head: [["Title", "Author", "Genre", "Rating"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Save the PDF
    doc.save("my-books.pdf");
  };

  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genre === selectedGenre)
    : books;

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#333",
          },
        }}
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1); // Reset to first page when genre changes
              }}
              className="rounded-md bg-white text-gray-700 px-3 py-2 border-0 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Genres</option>
              {Array.from(
                new Set(books.map((book) => book.genre).filter(Boolean))
              ).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          {books.length > 0 && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-700">
                  {selectedBooks.size} book{selectedBooks.size !== 1 ? "s" : ""}{" "}
                  selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Select All
                </button>
                {selectedBooks.size > 0 && (
                  <>
                    <button
                      onClick={handleDeselectAll}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete Selected
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={exportToPDF}
                disabled={selectedBooks.size === 0}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedBooks.size === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Export Selected to PDF
              </button>
            </div>
          )}
        </div>
        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books added yet</p>
            <a
              href="/add-book"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Book
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isSelected={selectedBooks.has(book.id)}
                  onSelect={handleSelectBook}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
