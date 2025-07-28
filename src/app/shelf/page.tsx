"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

type UserWithId = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id: string;
};

type SessionWithUserId = Session & { user: UserWithId };

export default function ShelfPage() {
  const { data: sessionRaw, status } = useSession();
  const session = sessionRaw as SessionWithUserId | null;
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<string>("");

  useEffect(() => {
    async function fetchShelf() {
      if (!session?.user?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/shelf?userId=${session.user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setError(data.error || "Failed to load shelf.");
        }
      } catch {
        setError("Failed to load shelf.");
      }
      setLoading(false);
    }
    if (session?.user?.id) fetchShelf();
  }, [session]);

  async function handleStatusChange(bookId: string, status: string) {
    setUpdateStatus("");
    try {
      const res = await fetch(`/api/shelf`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookId, status })
      });
      if (res.ok) {
        setUpdateStatus("Book status updated!");
        // Refresh shelf
        const updated = books.map(b => b.id === bookId ? { ...b, status } : b);
        setBooks(updated);
      } else {
        const data = await res.json();
        setUpdateStatus(data.error || "Failed to update status.");
      }
    } catch {
      setUpdateStatus("Failed to update status.");
    }
  }

  async function handleRemove(bookId: string) {
    setUpdateStatus("");
    try {
      const res = await fetch(`/api/shelf?id=${bookId}`, { method: "DELETE" });
      if (res.ok) {
        setUpdateStatus("Book removed from shelf!");
        setBooks(books.filter(b => b.id !== bookId));
      } else {
        const data = await res.json();
        setUpdateStatus(data.error || "Failed to remove book.");
      }
    } catch {
      setUpdateStatus("Failed to remove book.");
    }
  }

  if (status === "loading") {
    return <main className="p-8">Loading session...</main>;
  }
  if (!session) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Book Shelf</h1>
        <div className="border rounded p-4 bg-white shadow">Please <a href="/auth" className="text-blue-600 underline">sign in</a> to view your shelf.</div>
      </main>
    );
  }

  const filteredBooks = filter ? books.filter(b => b.status === filter) : books;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Book Shelf</h1>
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="filter" className="font-medium">Filter:</label>
        <select id="filter" value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          <option value="READ">Read</option>
          <option value="CURRENTLY_READING">Currently Reading</option>
          <option value="WANT_TO_READ">Want to Read</option>
        </select>
      </div>
      {loading && <div>Loading shelf...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {updateStatus && <div className="mb-4 text-green-700">{updateStatus}</div>}
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="border rounded p-4 bg-white shadow">Your shelf is empty.</div>
      )}
      <div className="grid gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="border rounded p-4 flex gap-4 bg-white shadow">
            {book.imageUrl && (
              <img src={book.imageUrl} alt={book.title} className="w-24 h-32 object-cover" />
            )}
            <div>
              <div className="font-bold text-lg">{book.title}</div>
              <div className="text-gray-600">{book.author}</div>
              <div className="mt-2 text-sm flex items-center gap-2">Status: <b>{book.status.replace("_", " ")}</b>
                <select value={book.status} onChange={e => handleStatusChange(book.id, e.target.value)} className="border rounded px-2 py-1 ml-2">
                  <option value="READ">Read</option>
                  <option value="CURRENTLY_READING">Currently Reading</option>
                  <option value="WANT_TO_READ">Want to Read</option>
                </select>
              </div>
              <button className="mt-2 bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleRemove(book.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
