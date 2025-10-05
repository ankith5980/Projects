# MERN Stack Portfolio

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 🎨 Modern and responsive design
- 🚀 React.js frontend with hooks and context
- 🔧 Node.js/Express.js backend API
- 🗄️ MongoDB database integration
- 📱 Mobile-first responsive design
- 🎯 Interactive animations and transitions
- 📧 Contact form with email functionality
- 🔒 Admin panel for content management
- 🌙 Dark/Light theme toggle

## Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Axios for API calls
- Framer Motion for animations
- Tailwind CSS for styling
- React Icons

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email
- Multer for file uploads
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd mern-portfolio
```

2. Install dependencies for both client and server
```bash
npm run install-all
```

3. Create environment variables
```bash
# In server directory, create .env file
cp server/.env.example server/.env
```

4. Update the .env file with your configurations

5. Start the development servers
```bash
npm run dev
```

The client will run on http://localhost:3000 and the server on http://localhost:5000.

## Project Structure

```
mern-portfolio/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── package.json
└── package.json          # Root package.json
```

## Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `cd client && npm run build`
2. Deploy the `build` folder

### Backend (Heroku/Railway)
1. Deploy the `server` directory
2. Set environment variables
3. Ensure MongoDB connection

### Full Stack (Heroku)
```bash
git push heroku main
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.