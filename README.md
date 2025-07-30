# BookShelf - Your Personal Library Companion

A full-stack web application for discovering, tracking, and organizing your reading journey. Built with Next.js 14+, TailwindCSS, Prisma ORM, and Google Books API.

## ✨ Features

- 🔍 **Smart Book Search** - Search through millions of books using Google Books API
- 📚 **Personal Shelf** - Add books to your personal collection
- 📖 **Reading Status** - Mark books as 'Read', 'Currently Reading', or 'Want to Read'
- 👤 **User Authentication** - Secure login and registration system
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔒 **Protected Routes** - Secure access to personal shelf

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database (or SQLite for development)
- Google Books API key (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd book_traker
npm install
```

### 2. Environment Setup

Copy the environment template and create your `.env.local` file:

```bash
cp env.template .env.local
```

Then edit `.env.local` with your actual values:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Google Books API (optional - works without it)
GOOGLE_BOOKS_API_KEY="your-google-books-api-key"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Push the schema to your database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development

### Project Structure

```
book_traker/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication page
│   │   ├── search/         # Book search page
│   │   └── shelf/          # Personal shelf page
│   ├── components/         # React components
│   └── lib/               # Utility functions
├── prisma/                # Database schema
└── public/               # Static assets
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run deploy       # Deploy to Vercel (requires Vercel CLI)
npm run vercel-build # Build for Vercel with database setup
```

### Database Management

```bash
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma db push   # Push schema changes
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Create and apply migrations
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables on Vercel**
   
   Go to your Vercel dashboard → Project Settings → Environment Variables and add:
   
   ```env
   DATABASE_URL=your-production-postgresql-url
   GOOGLE_BOOKS_API_KEY=your-google-books-api-key
   NEXTAUTH_SECRET=your-production-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Database Setup for Production**
   
   After deployment, run database migrations:
   ```bash
   vercel env pull .env.production.local
   npx prisma db push --schema=./prisma/schema.prisma
   ```

### Alternative Deployment Options

- **Railway**: Great for full-stack apps with built-in PostgreSQL
- **Netlify**: Good for static sites (requires serverless functions for API routes)
- **DigitalOcean App Platform**: Managed platform with database support

## 🔧 Configuration

### Google Books API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Books API"
4. Create credentials (API Key)
5. Add the API key to your environment variables

**Note**: The app works without a Google Books API key, but with rate limiting.

### Database Options

**PostgreSQL (Recommended for Production)**
- Use services like Supabase, Railway, or Clever Cloud
- Update `DATABASE_URL` in your environment variables

**SQLite (Development)**
- Change provider in `prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  ```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check your DATABASE_URL format
# For PostgreSQL: postgresql://user:password@host:port/database
# For SQLite: file:./dev.db
```

**NextAuth Session Issues**
```bash
# Ensure NEXTAUTH_SECRET is set and unique
# Check NEXTAUTH_URL matches your deployment URL
```

**Google Books API Errors**
```bash
# API key is optional - remove GOOGLE_BOOKS_API_KEY if causing issues
# Check API key format and permissions
```

### Development Tips

- Use `console.log` in API routes for debugging
- Check browser console for client-side errors
- Use Prisma Studio for database inspection
- Monitor Vercel function logs for production issues

## 📚 API Endpoints

- `GET /api/books?q=query` - Search books
- `GET /api/shelf?userId=id` - Get user's shelf
- `POST /api/shelf` - Add book to shelf
- `PATCH /api/shelf` - Update book status
- `DELETE /api/shelf` - Remove book from shelf
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

## 🎨 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: TailwindCSS, CSS Modules
- **Database**: Prisma ORM, PostgreSQL/SQLite
- **Authentication**: NextAuth.js
- **External APIs**: Google Books API
- **Deployment**: Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js and modern web technologies.
