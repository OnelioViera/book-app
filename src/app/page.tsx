"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import { Book } from "../types/book";
import { getBooks } from "../utils/bookStorage";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

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
      book.publishedDate
        ? new Date(book.publishedDate).toLocaleDateString()
        : "N/A",
      book.rating ? book.rating.toFixed(1) : "N/A",
    ]);

    autoTable(doc, {
      head: [["Title", "Author", "Published Date", "Rating"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Save the PDF
    doc.save("my-books.pdf");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
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
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Deselect All
                  </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isSelected={selectedBooks.has(book.id)}
                onSelect={handleSelectBook}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
