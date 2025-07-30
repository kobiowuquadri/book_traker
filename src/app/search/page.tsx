'use client';

import { useState, useEffect } from 'react';
import { searchBooks, addToShelf, getShelf, Book, ShelfBook } from '@/lib/api';
import BookCard from '@/components/BookCard';
import { useSession } from 'next-auth/react';

export default function SearchPage() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [addingBookId, setAddingBookId] = useState<string | null>(null);

  // Check authentication and load shelf on component mount
  useEffect(() => {
    if (session?.user?.id) {
      checkAuthAndLoadShelf();
    }
  }, [session]);

  const checkAuthAndLoadShelf = async () => {
    if (!session?.user?.id) return;
    
    try {
      const shelf = await getShelf(session.user.id);
      setShelfBooks(shelf);
    } catch (error) {
      console.error('Failed to load shelf - user may not be authenticated:', error);
    }
  };

  const handleSearch = async (searchQuery: string, page = 0) => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setError('');
    
    try {
      const result = await searchBooks(searchQuery, page * 20, 20);
      setBooks(result.items);
      setTotalResults(result.totalItems);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToShelf = async (book: Book) => {
    if (!session?.user?.id) {
      setError('Please sign in to add books to your shelf.');
      return;
    }

    setAddingBookId(book.id);
    
    try {
      await addToShelf({
        userId: session.user.id,
        googleId: book.googleId,
        title: book.title,
        author: book.author,
        imageUrl: book.imageUrl || undefined,
      });
      
      // Reload shelf to get updated list
      await checkAuthAndLoadShelf();
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        setError('This book is already in your shelf!');
      } else if (error.message.includes('User not found') || error.message.includes('401')) {
        setError('Please sign in to add books to your shelf.');
      } else {
        setError('Failed to add book to shelf. Please try again.');
      }
      console.error('Add to shelf error:', error);
    } finally {
      setAddingBookId(null);
    }
  };

  const isBookInShelf = (bookId: string) => {
    return shelfBooks.some(shelfBook => shelfBook.googleId === bookId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query, 0);
  };

  const handleLoadMore = () => {
    handleSearch(query, currentPage + 1);
  };

  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Books</h1>
          <p className="text-gray-600">Discover millions of books from Google Books</p>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-yellow-700">Sign in to add books to your shelf and manage your collection.</p>
              <a
                href="/auth"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books, authors, or topics..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              disabled={searchLoading}
            />
            <button
              type="submit"
              disabled={searchLoading || !query.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {books.length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Found {totalResults.toLocaleString()} results
                {query && ` for "${query}"`}
              </p>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={`${book.id}-${book.googleId}`}
                  book={book}
                  onAddToShelf={handleAddToShelf}
                  isInShelf={isBookInShelf(book.id)}
                  loading={addingBookId === book.id}
                />
              ))}
            </div>

            {/* Load More Button */}
            {books.length < totalResults && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={searchLoading}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  {searchLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchLoading && !loading && books.length === 0 && query && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
          </div>
        )}

        {/* Initial State */}
        {!searchLoading && !loading && books.length === 0 && !query && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start your book search</h3>
            <p className="text-gray-600">Search for your favorite books, authors, or topics to discover new reads.</p>
          </div>
        )}
      </div>
    </div>
  );
}
