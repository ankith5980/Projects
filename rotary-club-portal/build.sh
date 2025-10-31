#!/bin/bash

# Build script for Render deployment (Linux/Mac)

echo "🚀 Building Rotary Club Portal for Render..."

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📦 Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Server dependency installation failed"
    exit 1
fi
cd ..

echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Client dependency installation failed"
    exit 1
fi

echo ""
echo "🏗️  Building client..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi
cd ..

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review RENDER_DEPLOYMENT_GUIDE.md"
echo "2. Update MongoDB credentials"
echo "3. Push to GitHub"
echo "4. Deploy on Render"
