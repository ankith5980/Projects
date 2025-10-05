@echo off
echo 🚀 Setting up MERN Portfolio...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

REM Create .env file for server
echo ⚙️  Setting up environment variables...
if not exist server\.env (
    copy server\.env.example server\.env
    echo ✅ Created server/.env file from example
    echo ⚠️  Please update the environment variables in server/.env
) else (
    echo ℹ️  server/.env already exists
)

REM Create production build
echo 🏗️  Building client for production...
cd client
call npm run build
cd ..

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update server/.env with your MongoDB URI and other credentials
echo 2. Make sure MongoDB is running
echo 3. Run 'npm run dev' to start both client and server
echo 4. Create an admin user by registering and manually updating the role in MongoDB
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo Happy coding! 🎉
pause