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
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Books</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="border rounded px-3 py-2 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {addStatus && <div className="mb-4 text-green-700">{addStatus}</div>}
      <div className="grid gap-4">
        {results.map((item: any) => {
          const book = item.volumeInfo;
          return (
            <div key={item.id} className="border rounded p-4 flex gap-4 bg-white shadow">
              {book.imageLinks?.thumbnail && (
                <img src={book.imageLinks.thumbnail} alt={book.title} className="w-24 h-32 object-cover" />
              )}
              <div>
                <div className="font-bold text-lg">{book.title}</div>
                <div className="text-gray-600">{book.authors?.join(", ")}</div>
                <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleAddToShelf(item)}>
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
