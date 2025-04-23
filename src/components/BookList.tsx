"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import { Book } from "../types/book";
import { deleteBook } from "../utils/bookStorage";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

interface BookListProps {
  selectedGenre: string;
  books: Book[];
  setBooksAction: (books: Book[]) => void;
}

export default function BookList({
  selectedGenre,
  books,
  setBooksAction,
}: BookListProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedBookId, setDraggedBookId] = useState<string | null>(null);
  const booksPerPage = 8;

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

  const handleDeleteSelected = async () => {
    const selectedBookList = books.filter((book) => selectedBooks.has(book.id));
    const deletePromises = selectedBookList.map((book) => deleteBook(book.id));
    await Promise.all(deletePromises);
    setSelectedBooks(new Set());
    // Refresh the books list by removing deleted books
    const updatedBooks = books.filter((book) => !selectedBooks.has(book.id));
    setBooksAction(updatedBooks);
    toast.success("Selected books deleted successfully");
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

  // Sort books: unread first, then read
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (a.isRead === b.isRead) return 0;
    return a.isRead ? 1 : -1;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDragStart = (e: React.DragEvent, bookId: string) => {
    setDraggedBookId(bookId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetBookId: string) => {
    e.preventDefault();
    if (!draggedBookId || draggedBookId === targetBookId) return;

    const draggedBookIndex = books.findIndex(
      (book) => book.id === draggedBookId
    );
    const targetBookIndex = books.findIndex((book) => book.id === targetBookId);

    if (draggedBookIndex === -1 || targetBookIndex === -1) return;

    const newBooks = [...books];
    const [draggedBook] = newBooks.splice(draggedBookIndex, 1);
    newBooks.splice(targetBookIndex, 0, draggedBook);

    setDraggedBookId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Deselect All
          </button>
          {selectedBooks.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete Selected
            </button>
          )}
        </div>
        {selectedBooks.size > 0 && (
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Export to PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isSelected={selectedBooks.has(book.id)}
            onSelect={handleSelectBook}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
