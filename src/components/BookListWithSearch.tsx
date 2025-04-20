"use client";

import { useSearchParams, useRouter } from "next/navigation";
import BookList from "../components/BookList";

export default function BookListWithSearch() {
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
    <div className="w-full">
      <BookList
        selectedGenre={selectedGenre}
        onGenreChangeAction={handleGenreChange}
      />
    </div>
  );
}
