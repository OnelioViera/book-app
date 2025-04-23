import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Book from "@/models/Book";
import mongoose from "mongoose";

interface MongoError extends Error {
  code?: number;
}

type ValidationError = mongoose.Error.ValidationError;

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find({}).sort({ createdAt: -1 });
    const transformedBooks = books.map((book) => {
      const bookObj = book.toObject();
      return {
        ...bookObj,
        id: bookObj._id.toString(),
      };
    });
    return NextResponse.json(transformedBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received book data:", {
      ...body,
      coverImage: body.coverImage ? "Image data present" : "No image data",
    }); // Debug log

    await connectDB();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    // Remove ISBN if it's empty
    if (!body.isbn) {
      delete body.isbn;
    }

    // Ensure coverImage is properly handled
    if (body.coverImage) {
      // If it's a URL, keep it as is
      if (body.coverImage.startsWith("http")) {
        body.coverImage = body.coverImage;
      }
      // If it's a base64 string, keep it as is
      else if (body.coverImage.startsWith("data:image")) {
        body.coverImage = body.coverImage;
      }
    }

    // Log the final book data being saved
    console.log("Attempting to save book with data:", {
      ...body,
      coverImage: body.coverImage ? "Image data present" : "No image data",
    });

    const book = await Book.create(body);
    console.log("Successfully created book:", {
      ...book.toObject(),
      coverImage: book.coverImage ? "Image data present" : "No image data",
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);

    const mongoError = error as MongoError;

    // Handle duplicate ISBN error
    if (mongoError.code === 11000) {
      console.log("Duplicate ISBN error detected, attempting to drop index");

      // Drop the unique index if it exists
      try {
        await Book.collection.dropIndex("isbn_1");
        console.log("Successfully dropped ISBN index");
      } catch (err) {
        console.log("Index already dropped or doesn't exist:", err);
      }

      // Try creating the book again
      try {
        const body = await request.json();
        if (!body.isbn) {
          delete body.isbn;
        }
        console.log("Retrying book creation with data:", {
          ...body,
          coverImage: body.coverImage ? "Image data present" : "No image data",
        });
        const book = await Book.create(body);
        console.log("Successfully created book on retry:", {
          ...book.toObject(),
          coverImage: book.coverImage ? "Image data present" : "No image data",
        });
        return NextResponse.json(book, { status: 201 });
      } catch (err: unknown) {
        console.error("Failed to create book on retry:", err);
        return NextResponse.json(
          {
            error: `Failed to create book: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
          { status: 500 }
        );
      }
    }

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = error as ValidationError;
      const errors = Object.values(validationError.errors).map(
        (err) => err.message
      );
      console.error("Validation errors:", errors);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: `Failed to create book: ${mongoError.message}` },
      { status: 500 }
    );
  }
}
