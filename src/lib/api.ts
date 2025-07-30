// API utility functions for BookShelf

export interface Book {
  id: string;
  googleId: string;
  title: string;
  authors: string[];
  author: string;
  description: string;
  imageUrl: string | null;
  publishedDate: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  previewLink: string;
  infoLink: string;
}

export interface ShelfBook {
  id: string;
  userId: string;
  googleId: string;
  title: string;
  author: string;
  imageUrl: string | null;
  status: 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ';
}

export interface SearchResponse {
  totalItems: number;
  items: Book[];
}

// Search books from Google Books API
export async function searchBooks(query: string, startIndex = 0, maxResults = 20): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    startIndex: startIndex.toString(),
    maxResults: maxResults.toString(),
  });

  const response = await fetch(`/api/books?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to search books');
  }
  
  return response.json();
}

// Get user's shelf
export async function getShelf(userId: string, status?: string): Promise<ShelfBook[]> {
  const params = new URLSearchParams({ userId });
  if (status) {
    params.append('status', status);
  }

  const response = await fetch(`/api/shelf?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch shelf');
  }
  
  return response.json();
}

// Add book to shelf
export async function addToShelf(bookData: {
  userId: string;
  googleId: string;
  title: string;
  author: string;
  imageUrl?: string;
  status?: 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ';
}): Promise<ShelfBook> {
  const response = await fetch('/api/shelf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add book to shelf');
  }

  return response.json();
}

// Update book status
export async function updateBookStatus(id: string, status: 'READ' | 'CURRENTLY_READING' | 'WANT_TO_READ'): Promise<ShelfBook> {
  const response = await fetch('/api/shelf', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update book status');
  }

  return response.json();
}

// Remove book from shelf
export async function removeFromShelf(id: string): Promise<void> {
  const response = await fetch(`/api/shelf?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove book from shelf');
  }
} 