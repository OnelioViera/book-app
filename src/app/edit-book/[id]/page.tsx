"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import { getBookById, updateBook } from "../../../utils/bookStorage";
import { Book } from "../../../types/book";

export default function EditBook() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    genre: "",
    rating: undefined,
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "History",
    "Self-Help",
    "Poetry",
    "Drama",
    "Comedy",
    "Adventure",
    "Crime",
    "Young Adult",
    "Children's",
    "Other",
  ];

  useEffect(() => {
    const bookId = params.id as string;
    const book = getBookById(bookId);
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || "",
        coverImage: book.coverImage || "",
        genre: book.genre || "",
        rating: book.rating,
      });
      if (book.coverImage) {
        setPreviewImage(book.coverImage);
      }
    } else {
      router.push("/");
    }
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" ? (value ? parseFloat(value) : undefined) : value,
    }));

    // Update preview image if it's a URL
    if (name === "coverImage" && value.startsWith("http")) {
      setPreviewImage(value);
    } else if (name === "coverImage" && !value) {
      // Clear preview if URL is cleared
      setPreviewImage("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const reader = new FileReader();
      reader.onloadend = () => {
        clearInterval(interval);
        setUploadProgress(100);
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, coverImage: result }));
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      };
      reader.readAsDataURL(file);
    } else {
      // Clear preview if no file is selected
      setPreviewImage("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookId = params.id as string;
      const bookData = {
        ...formData,
        rating: formData.rating
          ? parseFloat(formData.rating.toString())
          : undefined,
        description: formData.description || undefined,
        genre: formData.genre || undefined,
      };
      await updateBook(bookId, bookData);
      router.push(`/books/${bookId}`);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Book</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre (Optional)
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <input
                type="text"
                id="coverImageUrl"
                name="coverImage"
                placeholder="Or enter image URL"
                value={formData.coverImage}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
              />
            </div>
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Uploading image... {uploadProgress}%
                </p>
              </div>
            )}
            {previewImage && !isUploading && (
              <div className="mt-2">
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="h-32 w-auto object-contain rounded-md"
                  loader={({ src }) => src}
                  unoptimized={previewImage.startsWith("data:image")}
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 px-3 py-2 border"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
