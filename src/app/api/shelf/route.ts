import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shelf - Get all books for a user (userId from query for now)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  try {
    const books = await prisma.book.findMany({ where: { userId } });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shelf' }, { status: 500 });
  }
}

// POST /api/shelf - Add a book to shelf
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, googleId, title, author, imageUrl, status } = body;
  if (!userId || !googleId || !title || !author) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    const book = await prisma.book.create({
      data: { userId, googleId, title, author, imageUrl, status }
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

// PATCH /api/shelf - Update book status
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }
  try {
    await prisma.book.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true });
  } catch (error) {
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
    return NextResponse.json({ error: 'Failed to remove book' }, { status: 500 });
  }
}
