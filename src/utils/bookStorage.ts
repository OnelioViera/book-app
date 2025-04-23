import { Book } from "../types/book";

export const getBooks = async (): Promise<Book[]> => {
  try {
    console.log("Fetching books...");
    const response = await fetch("/api/books");
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch books:", errorData.error);
      throw new Error(errorData.error || "Failed to fetch books");
    }
    const books = await response.json();
    console.log("Fetched books successfully:", books);
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const saveBook = async (
  book: Omit<Book, "id" | "createdAt" | "updatedAt">
): Promise<Book> => {
  try {
    const response = await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save book");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving book:", error);
    throw error;
  }
};

export const updateBook = async (
  id: string,
  book: Partial<Book>
): Promise<Book | null> => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      throw new Error("Failed to update book");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
};

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete book");
    }

    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    if (!id) {
      console.error("No book ID provided");
      return null;
    }

    const response = await fetch(`/api/books/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        console.error("Book not found:", id);
        return null;
      }
      const errorData = await response.json();
      console.error("Failed to fetch book:", errorData.error);
      return null;
    }
    const book = await response.json();
    console.log("Fetched book data:", {
      ...book,
      coverImage: book.coverImage ? "Image data present" : "No image data",
    });
    return book;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
};
