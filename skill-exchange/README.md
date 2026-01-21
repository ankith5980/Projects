# SkillSwap - Peer Skill Exchange Network

A production-ready full-stack web application for peer-to-peer skill exchange. Users can teach skills to earn points and spend points to learn from others.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Skill Listings**: Create, browse, and search skills with filtering
- **Session Booking**: Book learning sessions with points-based economy
- **Points Economy**: Earn points by teaching, spend to learn
- **Rating System**: Rate and review sessions
- **Real-time Chat**: Socket.io powered messaging system
- **Responsive Design**: Modern dark theme with glassmorphism

## 📁 Project Structure

```
skill-exchange/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & error handling
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.io handlers
│   │   └── server.js     # Entry point
│   └── package.json
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # CSS styles
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main app
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Real-time**: Socket.io Client

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd skill-exchange/backend

# Install dependencies
npm install

# Create .env file (copy from .env.example or use provided .env)
# Update MONGODB_URI if needed

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd skill-exchange/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List all skills |
| GET | `/api/skills/:id` | Get skill details |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get user sessions |
| POST | `/api/sessions` | Book session |
| PUT | `/api/sessions/:id` | Update session |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings` | Create rating |
| GET | `/api/ratings/user/:id` | Get user ratings |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | List conversations |
| GET | `/api/messages/:userId` | Get messages |
| POST | `/api/messages` | Send message |

## 💰 Points Economy

- New users start with **100 points**
- Points are transferred from student to teacher upon session completion
- Teachers set their own point costs (5-500 points)
- Minimum session duration: 15 minutes
- Maximum session duration: 180 minutes

## 🎨 Design System

- **Color Scheme**: Dark theme with purple/cyan accents
- **Typography**: Inter font family
- **Effects**: Glassmorphism, smooth animations
- **Responsive**: Mobile-friendly design

## 📝 License

MIT License
