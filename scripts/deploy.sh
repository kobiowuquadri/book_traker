#!/bin/bash

# BookShelf Vercel Deployment Script
# This script helps automate the deployment process

echo "🚀 BookShelf Vercel Deployment Script"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables in Settings → Environment Variables:"
echo "   - DATABASE_URL (your PostgreSQL connection string)"
echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "   - NEXTAUTH_URL (https://your-project-name.vercel.app)"
echo "   - GOOGLE_BOOKS_API_KEY (optional)"
echo "3. Redeploy from Vercel dashboard"
echo "4. Run database migration:"
echo "   vercel env pull .env.production.local"
echo "   npx prisma db push"
echo ""
echo "📚 For detailed instructions, see DEPLOY.md" 