#!/bin/bash

echo "🚀 Preparing for Vercel Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for Vercel deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy to Vercel:"
    echo "   - Go to https://vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Configure:"
    echo "     - Framework: Vite"
    echo "     - Root Directory: expenso-together-now"
    echo "     - Build Command: npm run build"
    echo "     - Output Directory: dist"
    echo "   - Deploy!"
    echo ""
    echo "3. Your app will be live at: https://your-app.vercel.app"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi 