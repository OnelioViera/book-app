"use client";

import { useSearchParams, useRouter } from "next/navigation";
import BookList from "../components/BookList";
import { Suspense } from "react";

function BookListWithSearchContent() {
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get("genre") || "";
  const router = useRouter();

  const handleGenreChange = (genre: string) => {
    if (genre) {
      router.push(`/?genre=${encodeURIComponent(genre)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <BookList
      selectedGenre={selectedGenre}
      onGenreChangeAction={handleGenreChange}
    />
  );
}

export default function BookListWithSearch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookListWithSearchContent />
    </Suspense>
  );
}
