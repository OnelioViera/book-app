"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { saveBook } from "../../utils/bookStorage";

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

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "",
    genre: "",
    rating: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const bookData = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        description: formData.description || undefined,
        genre: formData.genre || undefined,
        isRead: false,
      };

      // Ensure coverImage is properly handled
      if (bookData.coverImage) {
        // If it's a URL, keep it as is
        if (bookData.coverImage.startsWith("http")) {
          bookData.coverImage = bookData.coverImage;
        }
        // If it's a base64 string, keep it as is
        else if (bookData.coverImage.startsWith("data:image")) {
          bookData.coverImage = bookData.coverImage;
        }
      }

      console.log("Submitting book data:", bookData); // Debug log

      const newBook = await saveBook(bookData);
      console.log("Book saved successfully:", newBook); // Debug log

      router.push(`/books/${newBook.id}`);
    } catch (error) {
      console.error("Error saving book:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save book. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update preview image if it's a URL
    if (name === "coverImage" && value.startsWith("http")) {
      setPreviewImage(value);
      // Ensure the URL is properly saved in the form data
      setFormData((prev) => ({ ...prev, coverImage: value }));
    } else if (name === "coverImage" && !value) {
      // Clear preview if URL is cleared
      setPreviewImage("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
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
          // Ensure we're setting the complete base64 string
          setFormData((prev) => ({ ...prev, coverImage: result }));
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        };
        reader.onerror = () => {
          clearInterval(interval);
          setError("Failed to read image file");
          setIsUploading(false);
          setUploadProgress(0);
        };
        // Read the file as a data URL to get the base64 string
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else {
      setPreviewImage("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Book</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
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
                  unoptimized
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating (Optional)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="0"
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
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
