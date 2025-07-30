import { NextResponse } from 'next/server';

// GET /api/books?q=searchTerm&startIndex=0&maxResults=20
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const startIndex = searchParams.get('startIndex') || '0';
  const maxResults = searchParams.get('maxResults') || '20';
  
  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    // Google Books API URL with optional API key
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const params = new URLSearchParams({
      q: query,
      startIndex,
      maxResults,
      key: apiKey || '',
    });

    const url = `${baseUrl}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Google Books API error: ${res.status}`);
    }

    const data = await res.json();
    
    // Transform the data to match our needs
    const transformedData = {
      totalItems: data.totalItems || 0,
      items: data.items?.map((item: any) => {
        // Convert HTTP image URLs to HTTPS
        let imageUrl = item.volumeInfo?.imageLinks?.thumbnail || null;
        if (imageUrl && imageUrl.startsWith('http://')) {
          imageUrl = imageUrl.replace('http://', 'https://');
        }

        return {
          id: item.id,
          googleId: item.id,
          title: item.volumeInfo?.title || 'Unknown Title',
          authors: item.volumeInfo?.authors || ['Unknown Author'],
          author: item.volumeInfo?.authors?.[0] || 'Unknown Author',
          description: item.volumeInfo?.description || '',
          imageUrl: imageUrl,
          publishedDate: item.volumeInfo?.publishedDate || '',
          pageCount: item.volumeInfo?.pageCount || 0,
          categories: item.volumeInfo?.categories || [],
          averageRating: item.volumeInfo?.averageRating || 0,
          ratingsCount: item.volumeInfo?.ratingsCount || 0,
          previewLink: item.volumeInfo?.previewLink || '',
          infoLink: item.volumeInfo?.infoLink || '',
        };
      }) || [],
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Books API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books from Google Books API' }, 
      { status: 500 }
    );
  }
}
