import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-xl w-full text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-700">BookShelf</h1>
        <p className="mb-6 text-lg text-gray-700">Track your books, search the world's library, and manage your personal shelf. Built with Next.js, TailwindCSS, and Prisma.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="/search" className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded shadow font-semibold">Search Books</a>
          <a href="/shelf" className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded shadow font-semibold">My Shelf</a>
          <a href="/auth" className="bg-gray-600 hover:bg-gray-700 transition text-white px-6 py-3 rounded shadow font-semibold">Sign In</a>
        </div>
      </div>
    </main>
  );
}
