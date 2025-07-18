"use client";

import { useRecoilValue } from "recoil";
import { bookmarksAtom } from "@/state/bookmarks";
import BookmarkCard from "@/components/BookmarkCard";
import { BookmarkForm } from "@/components/BookmarkForm";

export default function Page() {
  const bookmarks = useRecoilValue(bookmarksAtom);

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">AI Bookmark App</h1>

      <BookmarkForm />

      <div className="space-y-4">
        {bookmarks.map((bkmk, index) => (
          <BookmarkCard key={index} {...bkmk} />
        ))}
      </div>
    </div>
  );
}
