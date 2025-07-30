'use client';

import { useState, useEffect } from 'react';
import { getShelf, updateBookStatus, removeFromShelf, ShelfBook, DEMO_USER_ID } from '@/lib/api';
import ShelfBookCard from '@/components/ShelfBookCard';

type FilterStatus = 'ALL' | 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ';

export default function ShelfPage() {
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ShelfBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null);
  const [removingBookId, setRemovingBookId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadShelf();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.status === filter));
    }
  }, [books, filter]);

  const checkAuthAndLoadShelf = async () => {
    try {
      setLoading(true);
      const shelf = await getShelf(DEMO_USER_ID);
      setBooks(shelf);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load shelf - user may not be authenticated:', error);
      setIsAuthenticated(false);
      setError('Please sign in to view your shelf.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ') => {
    setUpdatingBookId(id);
    
    try {
      const updatedBook = await updateBookStatus(id, status);
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === id ? updatedBook : book
        )
      );
    } catch (error) {
      setError('Failed to update book status. Please try again.');
      console.error('Update status error:', error);
    } finally {
      setUpdatingBookId(null);
    }
  };

  const handleRemoveBook = async (id: string) => {
    setRemovingBookId(id);
    
    try {
      await removeFromShelf(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (error) {
      setError('Failed to remove book from shelf. Please try again.');
      console.error('Remove book error:', error);
    } finally {
      setRemovingBookId(null);
    }
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'ALL') return books.length;
    return books.filter(book => book.status === status).length;
  };

  const statusLabels = {
    ALL: 'All Books',
    READ: 'Read',
    CURRENTLY_READING: 'Currently Reading',
    WANT_TO_READ: 'Want to Read',
  };

  // Show authentication required message
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view and manage your book shelf.</p>
            <a
              href="/auth"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shelf...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Shelf</h1>
          <p className="text-gray-600">Manage your personal book collection</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {(['ALL', 'WANT_TO_READ', 'CURRENTLY_READING', 'READ'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {statusLabels[status]} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredBooks.map((book) => (
              <ShelfBookCard
                key={book.id}
                book={book}
                onUpdateStatus={handleUpdateStatus}
                onRemove={handleRemoveBook}
                loading={updatingBookId === book.id || removingBookId === book.id}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'ALL' ? 'Your shelf is empty' : `No ${statusLabels[filter].toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'ALL' 
                ? "Start building your collection by searching for books and adding them to your shelf."
                : `You haven't marked any books as ${statusLabels[filter].toLowerCase()} yet.`
              }
            </p>
            {filter !== 'ALL' && (
              <button
                onClick={() => setFilter('ALL')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                View All Books
              </button>
            )}
            {filter === 'ALL' && (
              <a
                href="/search"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Search for Books
              </a>
            )}
          </div>
        )}

        {/* Stats */}
        {books.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Reading Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getStatusCount('READ')}</div>
                  <div className="text-sm text-green-700">Books Read</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getStatusCount('CURRENTLY_READING')}</div>
                  <div className="text-sm text-blue-700">Currently Reading</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{getStatusCount('WANT_TO_READ')}</div>
                  <div className="text-sm text-yellow-700">Want to Read</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
