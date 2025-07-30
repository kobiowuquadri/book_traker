'use client';

import Image from 'next/image';
import { Book } from '@/lib/api';

interface BookCardProps {
  book: Book;
  onAddToShelf?: (book: Book) => void;
  isInShelf?: boolean;
  loading?: boolean;
}

export default function BookCard({ book, onAddToShelf, isInShelf = false, loading = false }: BookCardProps) {
  const handleAddToShelf = () => {
    if (onAddToShelf && !isInShelf) {
      onAddToShelf(book);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative aspect-[3/4] bg-gray-100">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Status badge */}
        {isInShelf && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Shelf
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          by {book.author}
        </p>

        {book.averageRating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(book.averageRating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({book.ratingsCount})
            </span>
          </div>
        )}

        {book.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {book.publishedDate && (
              <span suppressHydrationWarning={true}>
                {new Date(book.publishedDate).getFullYear()}
              </span>
            )}
            {book.pageCount > 0 && (
              <span className="ml-2">{book.pageCount} pages</span>
            )}
          </div>

          {onAddToShelf && !isInShelf && (
            <button
              onClick={handleAddToShelf}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
            >
              {loading ? 'Adding...' : 'Add to Shelf'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 