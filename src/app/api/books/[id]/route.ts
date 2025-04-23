import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";
import Book from "@/models/Book";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    console.log("Fetching book with ID:", id);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid book ID format:", id);
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    await connectDB();
    const book = await Book.findById(id);

    if (!book) {
      console.error("Book not found with ID:", id);
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const bookObj = book.toObject();
    const transformedBook = {
      ...bookObj,
      id: bookObj._id.toString(),
    };

    console.log("Book found:", {
      ...transformedBook,
      coverImage: transformedBook.coverImage
        ? "Image data present"
        : "No image data",
    });
    return NextResponse.json(transformedBook);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    await connectDB();

    const book = await Book.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const bookObj = book.toObject();
    const transformedBook = {
      ...bookObj,
      id: bookObj._id.toString(),
    };

    return NextResponse.json(transformedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    await connectDB();
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
