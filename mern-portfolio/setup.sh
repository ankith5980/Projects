#!/bin/bash

# MERN Portfolio Setup Script
echo "🚀 Setting up MERN Portfolio..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create .env file for server
echo "⚙️  Setting up environment variables..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file from example"
    echo "⚠️  Please update the environment variables in server/.env"
else
    echo "ℹ️  server/.env already exists"
fi

# Create production build
echo "🏗️  Building client for production..."
cd client
npm run build
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your MongoDB URI and other credentials"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start both client and server"
echo "4. Create an admin user by registering and manually updating the role in MongoDB"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Happy coding! 🎉"