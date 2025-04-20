import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the book"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please provide an author for the book"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the book"],
    trim: true,
  },
  publishedYear: {
    type: Number,
    required: [true, "Please provide a published year for the book"],
  },
  isbn: {
    type: String,
    required: [true, "Please provide an ISBN for the book"],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bookSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
