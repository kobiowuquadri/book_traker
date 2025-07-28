"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type UserWithId = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
};

type SessionWithUserId = Session & { user: UserWithId };

export default function SearchPage() {
  const { data: sessionRaw } = useSession();
  const session = sessionRaw as SessionWithUserId | null;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addStatus, setAddStatus] = useState<string>("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.items) {
        setResults(data.items);
      } else {
        setError("No books found.");
      }
    } catch {
      setError("Failed to fetch books.");
    }
    setLoading(false);
  }

  async function handleAddToShelf(item: any) {
    setAddStatus("");
    if (!session?.user?.id) {
      setAddStatus("Please sign in to add books to your shelf.");
      return;
    }
    const book = item.volumeInfo;
    try {
      const res = await fetch("/api/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          googleId: item.id,
          title: book.title,
          author: book.authors?.join(", ") || "Unknown",
          imageUrl: book.imageLinks?.thumbnail || "",
          status: "WANT_TO_READ"
        })
      });
      if (res.ok) {
        setAddStatus("Book added to shelf!");
      } else {
        const data = await res.json();
        setAddStatus(data.error || "Failed to add book.");
      }
    } catch {
      setAddStatus("Failed to add book.");
    }
  }

  return (
    <main className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700">Search Books</h1>
      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="border rounded px-4 py-2 w-full focus:outline-blue-400 shadow-sm"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded shadow">Search</button>
      </form>
      {loading && <div className="text-center text-lg">Loading...</div>}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      {addStatus && <div className="mb-4 text-green-700 text-center">{addStatus}</div>}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {results.map((item: any) => {
          const book = item.volumeInfo;
          return (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex gap-4 bg-white shadow hover:shadow-lg transition group"
            >
              {book.imageLinks?.thumbnail && (
                <img
                  src={book.imageLinks.thumbnail}
                  alt={book.title}
                  className="w-24 h-32 object-cover rounded group-hover:scale-105 transition"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-lg text-blue-800 group-hover:underline">{book.title}</div>
                  <div className="text-gray-600 mb-2">{book.authors?.join(", ")}</div>
                </div>
                <button
                  className="mt-2 bg-green-600 hover:bg-green-700 transition text-white px-4 py-1 rounded shadow"
                  onClick={() => handleAddToShelf(item)}
                >
                  Add to Shelf
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
