"use client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  bookmarksAtom,
  filteredBookmarksSelector,
  Bookmark,
} from "@/state/bookmark";
import { v4 as uuid } from "uuid";
import { useState } from "react";

export default function BookmarksPage() {
  const bookmarks = useRecoilValue(filteredBookmarksSelector);
  const setBookmarks = useSetRecoilState(bookmarksAtom);
  const [url, setUrl] = useState("");

  const addBookmark = () => {
    if (!url) return;
    const newBookmark: Bookmark = {
      id: uuid(),
      url,
      title: url,
      tags: [],
    };
    setBookmarks((prev) => [...prev, newBookmark]);
    setUrl("");
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Bookmarks</h1>

      <div className="flex gap-2">
        <input
          className="flex-grow border p-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://wtf-is-going-on.com"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addBookmark}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {bookmarks.map((b) => (
          <li key={b.id} className="border p-2 rounded">
            {b.url}
          </li>
        ))}
      </ul>
    </main>
  );
}
