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
    trim: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  publishedYear: {
    type: Number,
  },
  isbn: {
    type: String,
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
