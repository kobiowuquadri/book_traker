import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shelf - Get all books for a user (userId from query for now)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status'); // Optional filter by status
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  
  try {
    const whereClause: any = { userId };
    if (status && ['READ', 'CURRENTLY_READING', 'WANT_TO_READ'].includes(status)) {
      whereClause.status = status;
    }
    
    const books = await prisma.book.findMany({ 
      where: whereClause,
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error('Shelf GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch shelf' }, { status: 500 });
  }
}

// POST /api/shelf - Add a book to shelf
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, googleId, title, author, imageUrl, status = 'WANT_TO_READ' } = body;
    
    if (!userId || !googleId || !title || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign in first.' }, { status: 401 });
    }

    // Check if book already exists for this user
    const existingBook = await prisma.book.findFirst({
      where: { userId, googleId }
    });

    if (existingBook) {
      return NextResponse.json({ 
        error: 'Book already exists in your shelf',
        book: existingBook 
      }, { status: 409 });
    }

    const book = await prisma.book.create({
      data: { 
        userId, 
        googleId, 
        title, 
        author, 
        imageUrl, 
        status 
      }
    });
    
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Shelf POST error:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

// PATCH /api/shelf - Update book status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (!['READ', 'CURRENTLY_READING', 'WANT_TO_READ'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({ 
      where: { id }, 
      data: { status } 
    });
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Shelf PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// DELETE /api/shelf?id=bookId - Remove a book from shelf
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing book id' }, { status: 400 });
  }
  
  try {
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shelf DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove book' }, { status: 500 });
  }
}
