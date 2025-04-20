import { Suspense } from "react";
import Navbar from "../components/Navbar";
import BookListWithSearch from "../components/BookListWithSearch";
import { Toaster } from "react-hot-toast";

function HomeContent() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#333",
          },
        }}
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Books</h1>
          <Suspense fallback={<div>Loading books...</div>}>
            <BookListWithSearch />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
