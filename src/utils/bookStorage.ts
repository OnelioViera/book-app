import { Book } from "../types/book";

const BOOKS_STORAGE_KEY = "books";

const compressImage = async (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to a reasonable maximum
      const maxSize = 800;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to compressed base64
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      resolve(compressedBase64);
    };
  });
};

export const getBooks = (): Book[] => {
  if (typeof window === "undefined") return [];
  const booksJson = localStorage.getItem(BOOKS_STORAGE_KEY);
  return booksJson ? JSON.parse(booksJson) : [];
};

export const saveBook = async (
  book: Omit<Book, "id" | "createdAt" | "updatedAt">
): Promise<Book> => {
  const books = getBooks();
  const newBook: Book = {
    ...book,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If the coverImage is a base64 string, compress and store it separately
  if (newBook.coverImage?.startsWith("data:image")) {
    const imageId = `img_${newBook.id}`;
    const compressedImage = await compressImage(newBook.coverImage);
    localStorage.setItem(imageId, compressedImage);
    newBook.coverImage = imageId;
  }

  books.push(newBook);
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  return newBook;
};

export const updateBook = async (
  id: string,
  book: Partial<Book>
): Promise<Book | null> => {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const updatedBook = {
    ...books[index],
    ...book,
    updatedAt: new Date().toISOString(),
  };

  // Handle base64 image if present
  if (book.coverImage?.startsWith("data:image")) {
    const imageId = `img_${id}`;
    const compressedImage = await compressImage(book.coverImage);
    localStorage.setItem(imageId, compressedImage);
    updatedBook.coverImage = imageId;
  }

  books[index] = updatedBook;
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  return updatedBook;
};

export const deleteBook = (id: string): boolean => {
  const books = getBooks();
  const filteredBooks = books.filter((book) => book.id !== id);
  if (filteredBooks.length === books.length) return false;

  // Delete associated image if it exists
  const imageId = `img_${id}`;
  localStorage.removeItem(imageId);

  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(filteredBooks));
  return true;
};

export const getBookById = (id: string): Book | null => {
  const books = getBooks();
  const book = books.find((book) => book.id === id);
  if (!book) return null;

  // If the coverImage is an image ID, retrieve the actual image
  if (book.coverImage?.startsWith("img_")) {
    const imageData = localStorage.getItem(book.coverImage);
    if (imageData) {
      book.coverImage = imageData;
    }
  }

  return book;
};
