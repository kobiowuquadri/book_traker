'use client';

import Image from 'next/image';
import { ShelfBook } from '@/lib/api';

interface ShelfBookCardProps {
  book: ShelfBook;
  onUpdateStatus: (id: string, status: 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ') => void;
  onRemove: (id: string) => void;
  loading?: boolean;
}

const statusColors = {
  READ: 'bg-green-100 text-green-800 border-green-200',
  CURRENTLY_READING: 'bg-blue-100 text-blue-800 border-blue-200',
  WANT_TO_READ: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const statusLabels = {
  READ: 'Read',
  CURRENTLY_READING: 'Currently Reading',
  WANT_TO_READ: 'Want to Read',
};

export default function ShelfBookCard({ book, onUpdateStatus, onRemove, loading = false }: ShelfBookCardProps) {
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
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[book.status]}`}>
          {statusLabels[book.status]}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          by {book.author}
        </p>

        <div className="space-y-3">
          {/* Status selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={book.status}
              onChange={(e) => onUpdateStatus(book.id, e.target.value as any)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="WANT_TO_READ">Want to Read</option>
              <option value="CURRENTLY_READING">Currently Reading</option>
              <option value="READ">Read</option>
            </select>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(book.id)}
            disabled={loading}
            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors duration-200"
          >
            {loading ? 'Removing...' : 'Remove from Shelf'}
          </button>
        </div>
      </div>
    </div>
  );
} 