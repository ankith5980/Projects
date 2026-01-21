# 🎓 SkillSwap - Peer Skill Exchange Network

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.6.1-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
</p>

A **production-ready full-stack web application** for peer-to-peer skill exchange. Users can teach skills to earn points and spend points to learn from others. Built with modern technologies featuring real-time messaging, JWT authentication, and a beautiful glassmorphism UI design.

---

## 📑 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Backend Documentation](#-backend-documentation)
  - [Architecture Overview](#architecture-overview)
  - [Database Models](#database-models)
  - [API Endpoints](#api-endpoints)
  - [Authentication & Middleware](#authentication--middleware)
  - [Real-time Socket Events](#real-time-socket-events)
- [Frontend Documentation](#-frontend-documentation)
  - [Architecture Overview](#frontend-architecture-overview)
  - [Page Components](#page-components)
  - [Reusable Components](#reusable-components)
  - [Context Providers](#context-providers)
  - [API Services](#api-services)
  - [TypeScript Types](#typescript-types)
- [Points Economy System](#-points-economy-system)
- [Design System](#-design-system)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | JWT-based authentication with secure bcrypt password hashing |
| **Skill Listings** | Create, browse, and search skills with advanced filtering and categories |
| **Session Booking** | Book learning sessions with a points-based economy |
| **Points Economy** | Earn points by teaching, spend points to learn from others |
| **Rating System** | Rate and review both teachers and students after sessions |
| **Real-time Chat** | Socket.io powered messaging with typing indicators and read receipts |
| **Responsive Design** | Modern dark theme with glassmorphism effects |
| **Online Status** | Real-time online/offline user status tracking |

---

## 📁 Project Structure

```
skill-exchange/
├── 📂 backend/                    # Node.js + Express API Server
│   ├── 📂 src/
│   │   ├── 📂 config/             # Database configuration
│   │   │   └── db.js              # MongoDB connection setup
│   │   ├── 📂 controllers/        # Route handler logic
│   │   │   ├── authController.js      # Authentication handlers
│   │   │   ├── messageController.js   # Messaging handlers
│   │   │   ├── ratingController.js    # Rating handlers
│   │   │   ├── sessionController.js   # Session handlers
│   │   │   ├── skillController.js     # Skill handlers
│   │   │   └── userController.js      # User handlers
│   │   ├── 📂 middleware/         # Express middleware
│   │   │   ├── auth.js                # JWT authentication middleware
│   │   │   └── errorHandler.js        # Global error handler
│   │   ├── 📂 models/             # Mongoose schemas
│   │   │   ├── Message.js             # Message model
│   │   │   ├── Rating.js              # Rating model
│   │   │   ├── Session.js             # Session model
│   │   │   ├── Skill.js               # Skill model
│   │   │   └── User.js                # User model
│   │   ├── 📂 routes/             # API route definitions
│   │   │   ├── auth.js                # /api/auth routes
│   │   │   ├── messages.js            # /api/messages routes
│   │   │   ├── ratings.js             # /api/ratings routes
│   │   │   ├── sessions.js            # /api/sessions routes
│   │   │   ├── skills.js              # /api/skills routes
│   │   │   └── users.js               # /api/users routes
│   │   ├── 📂 socket/             # Socket.io handlers
│   │   │   └── chatHandler.js         # Real-time chat logic
│   │   └── server.js              # Application entry point
│   ├── .env                       # Environment variables
│   └── package.json               # Backend dependencies
│
├── 📂 frontend/                   # React + TypeScript Client
│   ├── 📂 src/
│   │   ├── 📂 components/         # Reusable UI components
│   │   │   ├── AlertDialog.tsx        # Alert dialog component
│   │   │   ├── ConfirmDialog.tsx      # Confirmation dialog
│   │   │   ├── CustomDateTimePicker.tsx # Date/time picker
│   │   │   ├── CustomDropdown.tsx     # Dropdown component
│   │   │   ├── LoadingSpinner.tsx     # Loading indicator
│   │   │   ├── Modal.tsx              # Modal wrapper
│   │   │   ├── Navbar.tsx             # Navigation bar
│   │   │   ├── RatingStars.tsx        # Star rating display
│   │   │   └── SkillCard.tsx          # Skill card display
│   │   ├── 📂 context/            # React Context providers
│   │   │   ├── AuthContext.tsx        # Authentication state
│   │   │   ├── SocketContext.tsx      # Socket.io connection
│   │   │   └── ThemeContext.tsx       # Theme management
│   │   ├── 📂 pages/              # Page components
│   │   │   ├── CreateSkillPage.tsx    # Create new skill
│   │   │   ├── ExplorePage.tsx        # Browse skills
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── LoginPage.tsx          # User login
│   │   │   ├── MessagesPage.tsx       # Chat interface
│   │   │   ├── MySkillsPage.tsx       # User's skills
│   │   │   ├── ProfilePage.tsx        # User profile
│   │   │   ├── RegisterPage.tsx       # User registration
│   │   │   ├── SessionsPage.tsx       # Session management
│   │   │   └── SkillDetailPage.tsx    # Skill details
│   │   ├── 📂 services/           # API communication
│   │   │   └── api.ts                 # API service functions
│   │   ├── 📂 styles/             # CSS stylesheets
│   │   │   └── index.css              # Global styles
│   │   ├── 📂 types/              # TypeScript definitions
│   │   │   └── index.ts               # Type interfaces
│   │   ├── App.tsx                # Main application component
│   │   ├── main.tsx               # React entry point
│   │   └── vite-env.d.ts          # Vite type definitions
│   ├── index.html                 # HTML template
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite configuration
│   └── package.json               # Frontend dependencies
│
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

---

## 🛠️ Tech Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM for schema modeling |
| **JWT** | 9.0.2 | JSON Web Token authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Socket.io** | 4.6.1 | Real-time bidirectional communication |
| **express-validator** | 7.0.1 | Input validation middleware |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.3.1 | Environment variable management |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.6.2 | Static type checking |
| **Vite** | 5.4.0 | Build tool and dev server |
| **React Router** | 6.22.0 | Client-side routing |
| **Socket.io Client** | 4.6.1 | Real-time client connection |
| **Lucide React** | 0.312.0 | Icon library |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd skill-exchange
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (see Environment Variables section)
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Available Scripts

#### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run production server |
| Dev | `npm run dev` | Run with auto-reload (watch mode) |

#### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |

---

# 🔧 Backend Documentation

## Architecture Overview

The backend follows a **layered MVC architecture** pattern:

```
Request → Routes → Controllers → Models → Database
              ↓
         Middleware (Auth, Validation, Error Handling)
```

### Request Flow

1. **Client Request** → Incoming HTTP request from frontend
2. **CORS Middleware** → Handle Cross-Origin requests
3. **Body Parser** → Parse JSON request body
4. **Route Handler** → Match URL to appropriate route
5. **Auth Middleware** → Verify JWT token (for protected routes)
6. **Controller** → Execute business logic
7. **Model** → Interact with MongoDB database
8. **Response** → Send JSON response to client

### Server Entry Point (`server.js`)

```javascript
// Key server configurations:
- Express application initialization
- HTTP server creation for Socket.io
- Socket.io setup with CORS configuration
- Body parser middleware
- CORS middleware for allowed origins
- API route mounting
- Health check endpoint
- Global error handling
- Unhandled promise rejection handling
```

---

## Database Models

### 📋 User Model

```javascript
{
  name: String,           // Required, max 50 chars
  email: String,          // Required, unique, lowercase
  password: String,       // Required, min 6 chars, hashed
  avatar: String,         // Profile picture URL
  bio: String,            // Max 500 chars
  skillsOffered: [String], // Array of skills user can teach
  skillsWanted: [String],  // Array of skills user wants to learn
  points: Number,         // Default: 100 (starting credits)
  averageRating: Number,  // 0-5 rating
  totalRatings: Number,   // Number of ratings received
  totalSessionsAsTeacher: Number,
  totalSessionsAsStudent: Number,
  isOnline: Boolean,      // Real-time online status
  lastSeen: Date,         // Last active timestamp
  createdAt: Date
}
```

**Methods:**
- `getSignedJwtToken()` - Generate JWT token
- `matchPassword(password)` - Compare passwords

**Hooks:**
- Pre-save: Hash password with bcrypt (salt rounds: 10)

---

### 📚 Skill Model

```javascript
{
  title: String,          // Required, max 100 chars
  description: String,    // Required, max 1000 chars
  category: String,       // Enum: Programming, Design, Marketing, etc.
  teacher: ObjectId,      // Reference to User
  pointsCost: Number,     // 5-500 points
  duration: Number,       // 15-180 minutes
  level: String,          // Beginner, Intermediate, Advanced, All Levels
  availability: [{        // Weekly availability slots
    day: String,          // Monday-Sunday
    startTime: String,
    endTime: String
  }],
  tags: [String],         // Searchable tags
  isActive: Boolean,      // Default: true
  totalBookings: Number,  // Number of sessions booked
  averageRating: Number,  // Skill rating
  totalRatings: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Categories Available:**
- Programming, Design, Marketing, Music, Languages
- Business, Photography, Writing, Fitness, Cooking
- Arts & Crafts, Finance, Science, Other

**Indexes:**
- Text index on title, description, tags for full-text search

---

### 📅 Session Model

```javascript
{
  skill: ObjectId,        // Reference to Skill
  teacher: ObjectId,      // Reference to User (teacher)
  student: ObjectId,      // Reference to User (student)
  scheduledAt: Date,      // Session date and time
  duration: Number,       // Duration in minutes
  status: String,         // pending, confirmed, in-progress, completed, cancelled
  pointsTransferred: Number, // Points for this session
  notes: String,          // Max 500 chars
  meetingLink: String,    // Video call URL
  teacherRated: Boolean,  // Has student rated teacher?
  studentRated: Boolean,  // Has teacher rated student?
  cancelledBy: ObjectId,  // Who cancelled
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Session Status Flow:**
```
pending → confirmed → in-progress → completed
    ↓
 cancelled
```

**Indexes:**
- `{ teacher: 1, status: 1 }` - Teacher's sessions by status
- `{ student: 1, status: 1 }` - Student's sessions by status
- `{ scheduledAt: 1 }` - Sessions by date

---

### ⭐ Rating Model

```javascript
{
  session: ObjectId,      // Reference to Session
  skill: ObjectId,        // Reference to Skill
  rater: ObjectId,        // Who gave the rating
  rated: ObjectId,        // Who received the rating
  rating: Number,         // 1-5 stars
  review: String,         // Max 500 chars
  type: String,           // 'teacher' or 'student'
  createdAt: Date
}
```

**Static Methods:**
- `calcAverageRating(userId)` - Update user's average rating
- `calcSkillRating(skillId)` - Update skill's average rating

**Indexes:**
- `{ session: 1, rater: 1 }` - Unique constraint (one rating per session per user)

---

### 💬 Message Model

```javascript
{
  sender: ObjectId,       // Reference to User (sender)
  receiver: ObjectId,     // Reference to User (receiver)
  content: String,        // Required, max 1000 chars
  clearedBy: [ObjectId],  // Users who cleared this message
  read: Boolean,          // Default: false
  readAt: Date,           // When message was read
  createdAt: Date
}
```

**Indexes:**
- `{ sender: 1, receiver: 1, createdAt: -1 }` - Chat history
- `{ receiver: 1, read: 1 }` - Unread messages

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Authenticate user and get token | No |
| GET | `/me` | Get current logged-in user | Yes |
| PUT | `/updatedetails` | Update user profile | Yes |
| POST | `/logout` | Logout user | Yes |

**Request/Response Examples:**

```javascript
// POST /api/auth/register
Request: { name, email, password, bio }
Response: { success: true, token: "jwt...", data: {user} }

// POST /api/auth/login
Request: { email, password }
Response: { success: true, token: "jwt...", data: {user} }

// GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success: true, data: {user} }
```

---

### 👥 Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all users | No |
| GET | `/:id` | Get user by ID | No |
| GET | `/:id/stats` | Get user statistics | No |
| GET | `/leaderboard` | Get top users by points | No |

**Query Parameters:**
- `search` - Search by name or skill
- `skill` - Filter by skill offered
- `page` - Pagination page number
- `limit` - Results per page

---

### 📚 Skills (`/api/skills`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | List all skills | No |
| GET | `/:id` | Get skill by ID | No |
| POST | `/` | Create new skill | Yes |
| PUT | `/:id` | Update skill | Yes (owner only) |
| DELETE | `/:id` | Delete skill | Yes (owner only) |
| GET | `/my` | Get current user's skills | Yes |
| GET | `/teacher/:teacherId` | Get skills by teacher | No |
| GET | `/categories` | Get all categories with counts | No |

**Query Parameters for Listing:**
- `search` - Search in title, description, tags
- `category` - Filter by category
- `level` - Filter by skill level
- `minPoints` / `maxPoints` - Price range filter
- `sortBy` - Sort field (createdAt, pointsCost, averageRating, totalBookings)
- `order` - Sort order (asc, desc)
- `page` / `limit` - Pagination

---

### 📅 Sessions (`/api/sessions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's sessions | Yes |
| GET | `/:id` | Get session by ID | Yes |
| POST | `/` | Book new session | Yes |
| PUT | `/:id` | Update session (status, meeting link) | Yes |
| GET | `/upcoming` | Get upcoming sessions | Yes |
| GET | `/stats` | Get session statistics | Yes |

**Query Parameters:**
- `status` - Filter by status
- `role` - Filter by 'teacher' or 'student'
- `page` / `limit` - Pagination

**Session Status Updates:**
- Teacher can: confirm, cancel
- Student can: cancel
- System auto-manages: in-progress, completed

---

### ⭐ Ratings (`/api/ratings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create rating for completed session | Yes |
| GET | `/user/:id` | Get ratings for a user | No |
| GET | `/skill/:id` | Get ratings for a skill | No |
| GET | `/check/:sessionId` | Check if user can rate session | Yes |

---

### 💬 Messages (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/conversations` | Get all conversations | Yes |
| GET | `/:userId` | Get messages with specific user | Yes |
| POST | `/` | Send message | Yes |
| GET | `/unread/count` | Get unread message count | Yes |
| PUT | `/read/:userId` | Mark messages as read | Yes |
| DELETE | `/clear/:userId` | Clear chat with user | Yes |

---

## Authentication & Middleware

### JWT Authentication Middleware

```javascript
// Protected route middleware (auth.js)
export const protect = async (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify token with JWT_SECRET
  // 3. Find user by decoded ID
  // 4. Attach user to request object
  // 5. Call next() or return 401 error
};

// Optional auth (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  // Same as protect but continues without user if no token
};
```

**Token Format:**
```
Authorization: Bearer <jwt_token>
```

### Error Handler Middleware

```javascript
// Global error handler (errorHandler.js)
const errorHandler = (err, req, res, next) => {
  // Log error
  // Format error response
  // Send appropriate status code and message
};
```

---

## Real-time Socket Events

### Connection Flow

```
Client                          Server
   |                               |
   |-- Connect with JWT auth --→  |
   |                               | Verify token
   |                               | Store in onlineUsers Map
   |←-- user_online broadcast -----|
   |                               |
   |-- send_message -----------→  |
   |                               | Save to database
   |←-- message_sent (ack) --------|
   |   (receiver) ←-- receive_message
   |                               |
   |-- typing -----------------→  |
   |   (receiver) ←-- user_typing  |
   |                               |
   |-- disconnect -------------→  |
   |                               | Update user offline
   |   (all) ←-- user_online false |
```

### Socket Events Reference

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `send_message` | Client → Server | `{ receiverId, content }` | Send a message |
| `receive_message` | Server → Client | `{ _id, sender, receiver, content, read, createdAt }` | Receive a message |
| `message_sent` | Server → Client | `{ _id, receiver, content, createdAt }` | Confirmation of sent message |
| `message_error` | Server → Client | `{ error }` | Message sending failed |
| `typing` | Client → Server | `{ receiverId }` | User is typing |
| `stop_typing` | Client → Server | `{ receiverId }` | User stopped typing |
| `user_typing` | Server → Client | `{ userId, name }` | Someone is typing to you |
| `user_stop_typing` | Server → Client | `{ userId }` | Someone stopped typing |
| `mark_read` | Client → Server | `{ senderId }` | Mark messages as read |
| `messages_read` | Server → Client | `{ readBy }` | Your messages were read |
| `user_online` | Server → All | `{ userId, isOnline, lastSeen? }` | User online status changed |

---

# 🎨 Frontend Documentation

## Frontend Architecture Overview

The frontend follows a **Component-Based Architecture** with React Context for state management:

```
App.tsx
    ├── ThemeProvider (Theme Context)
    │   └── Router
    │       ├── AuthProvider (Auth Context)
    │       │   └── SocketProvider (Socket Context)
    │       │       └── Routes
    │       │           ├── Public Routes
    │       │           │   ├── HomePage
    │       │           │   ├── LoginPage
    │       │           │   ├── RegisterPage
    │       │           │   └── ExplorePage
    │       │           └── Protected Routes
    │       │               ├── CreateSkillPage
    │       │               ├── MySkillsPage
    │       │               ├── SessionsPage
    │       │               ├── MessagesPage
    │       │               └── ProfilePage
    │       └── Navbar (conditionally rendered)
    └── ScrollToTop (scroll restoration)
```

### Routing Structure

```javascript
// Public Routes (accessible without login)
/                  → HomePage
/login             → LoginPage (redirects to / if authenticated)
/register          → RegisterPage (redirects to / if authenticated)
/explore           → ExplorePage
/skills/:id        → SkillDetailPage

// Protected Routes (require authentication)
/skills/new        → CreateSkillPage
/my-skills         → MySkillsPage
/sessions          → SessionsPage
/messages          → MessagesPage
/profile           → ProfilePage

// Fallback
*                  → Redirects to /
```

---

## Page Components

### 🏠 HomePage (`/`)
Landing page with hero section, featured skills, and platform overview.

### 🔐 LoginPage (`/login`)
User authentication form with email/password fields.

### 📝 RegisterPage (`/register`)
New user registration with name, email, password, and optional bio.

### 🔍 ExplorePage (`/explore`)
Browse and search skills with filtering options:
- Full-text search
- Category filter
- Level filter
- Points range filter
- Sort options

### 📖 SkillDetailPage (`/skills/:id`)
Detailed skill view with:
- Skill information
- Teacher profile
- Reviews and ratings
- Session booking form

### ➕ CreateSkillPage (`/skills/new`)
Form to create new skill listing with all required fields.

### 📋 MySkillsPage (`/my-skills`)
Manage user's own skill listings (edit, activate/deactivate, delete).

### 📅 SessionsPage (`/sessions`)
View and manage booked sessions:
- As teacher: confirm, add meeting link, mark complete
- As student: view status, cancel if needed
- Rate completed sessions

### 💬 MessagesPage (`/messages`)
Real-time chat interface with:
- Conversation list
- Message history
- Typing indicators
- Read receipts
- Online status

### 👤 ProfilePage (`/profile`)
User profile management:
- Update personal information
- View statistics
- See ratings and reviews

---

## Reusable Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Navigation bar with links, user menu, and notifications |
| `SkillCard` | Card display for skill listings |
| `RatingStars` | Star rating display (1-5 stars) |
| `LoadingSpinner` | Loading indicator with optional text |
| `Modal` | Base modal wrapper component |
| `AlertDialog` | Alert/notification dialog |
| `ConfirmDialog` | Confirmation dialog with actions |
| `CustomDateTimePicker` | Date and time selection component |
| `CustomDropdown` | Styled dropdown select component |

---

## Context Providers

### 🔐 AuthContext

Manages user authentication state globally.

```typescript
interface AuthContextType {
    user: User | null;          // Current user or null
    token: string | null;       // JWT token
    isAuthenticated: boolean;   // Auth status
    isLoading: boolean;         // Initial auth check loading
    login: (email, password) => Promise<void>;
    register: (name, email, password, bio?) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}
```

**Usage:**
```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth();
    // ...
}
```

---

### 🔌 SocketContext

Manages Socket.io connection and online users.

```typescript
interface SocketContextType {
    socket: Socket | null;        // Socket.io instance
    isConnected: boolean;         // Connection status
    onlineUsers: Set<string>;     // Set of online user IDs
}
```

**Automatic Behavior:**
- Connects when user is authenticated
- Disconnects when user logs out
- Tracks online/offline status of other users

**Usage:**
```typescript
import { useSocket } from './context/SocketContext';

function ChatComponent() {
    const { socket, isConnected, onlineUsers } = useSocket();
    
    // Send message
    socket?.emit('send_message', { receiverId, content });
    
    // Listen for messages
    socket?.on('receive_message', (message) => {
        // Handle incoming message
    });
}
```

---

### 🎨 ThemeContext

Manages application theme (dark/light mode).

```typescript
interface ThemeContextType {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}
```

---

## API Services

All API calls are centralized in `services/api.ts` using a generic fetch wrapper.

### Available API Modules

```typescript
// Authentication
authApi.register(data)           // Register user
authApi.login(data)              // Login user
authApi.getMe()                  // Get current user
authApi.updateDetails(data)      // Update profile
authApi.logout()                 // Logout

// Users
usersApi.getAll(params)          // List users
usersApi.getById(id)             // Get user
usersApi.getStats(id)            // Get user stats
usersApi.getLeaderboard(limit)   // Get top users

// Skills
skillsApi.getAll(params)         // List skills
skillsApi.getById(id)            // Get skill
skillsApi.create(data)           // Create skill
skillsApi.update(id, data)       // Update skill
skillsApi.delete(id)             // Delete skill
skillsApi.getMy()                // Get my skills
skillsApi.getByTeacher(id)       // Get teacher's skills
skillsApi.getCategories()        // Get categories

// Sessions
sessionsApi.getAll(params)       // List sessions
sessionsApi.getById(id)          // Get session
sessionsApi.create(data)         // Book session
sessionsApi.update(id, data)     // Update session
sessionsApi.getUpcoming()        // Upcoming sessions
sessionsApi.getStats()           // Session stats

// Ratings
ratingsApi.create(data)          // Create rating
ratingsApi.getForUser(id)        // User's ratings
ratingsApi.getForSkill(id)       // Skill's ratings
ratingsApi.checkCanRate(id)      // Can rate session?

// Messages
messagesApi.getConversations()   // List conversations
messagesApi.getMessages(userId)  // Get chat history
messagesApi.send(data)           // Send message
messagesApi.getUnreadCount()     // Unread count
messagesApi.markAsRead(userId)   // Mark read
messagesApi.clearChat(userId)    // Clear chat
```

---

## TypeScript Types

### Core Interfaces

```typescript
// User
interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    points: number;
    averageRating: number;
    totalRatings: number;
    totalSessionsAsTeacher: number;
    totalSessionsAsStudent: number;
    isOnline?: boolean;
    lastSeen?: string;
    createdAt: string;
}

// Skill
interface Skill {
    _id: string;
    title: string;
    description: string;
    category: SkillCategory;
    teacher: User | string;
    pointsCost: number;
    duration: number;
    level: SkillLevel;
    availability?: Availability[];
    tags: string[];
    isActive: boolean;
    totalBookings: number;
    averageRating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}

// Session
interface Session {
    _id: string;
    skill: Skill | string;
    teacher: User | string;
    student: User | string;
    scheduledAt: string;
    duration: number;
    status: SessionStatus;
    pointsTransferred: number;
    notes?: string;
    meetingLink?: string;
    teacherRated: boolean;
    studentRated: boolean;
    createdAt: string;
    updatedAt: string;
}

// Type Aliases
type SkillCategory = 'Programming' | 'Design' | 'Marketing' | ...
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
type SessionStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
```

---

## 💰 Points Economy System

### How Points Work

| Action | Points |
|--------|--------|
| New user signup | **+100 points** (starting balance) |
| Complete session as teacher | **+{pointsCost}** (receive from student) |
| Book session as student | **-{pointsCost}** (pay to teacher) |
| Session cancelled | Points refunded (if already deducted) |

### Rules

- Minimum skill cost: **5 points**
- Maximum skill cost: **500 points**
- Minimum session duration: **15 minutes**
- Maximum session duration: **180 minutes**
- Points transfer only on **session completion**

### Points Flow Diagram

```
Student                              Teacher
   |                                    |
   |  Has >= pointsCost?                |
   |  ✓ Book session                    |
   |----------- pointsCost ------------>|
   |  (held until completion)           |
   |                                    |
   |  Session completed?                |
   |  ✓ Points transferred              |
   |  ✗ Points refunded                 |
   |                                    |
```

---

## 🎨 Design System

### Color Scheme

| Element | Color |
|---------|-------|
| Primary | Purple gradient (#8B5CF6 → #6366F1) |
| Secondary | Cyan accent (#06B6D4) |
| Background | Dark (#0F0F23 → #1A1A2E) |
| Surface | Glassmorphism (rgba(255,255,255,0.05)) |
| Text Primary | White (#FFFFFF) |
| Text Secondary | Gray (#A0A0B0) |
| Success | Green (#10B981) |
| Warning | Yellow (#F59E0B) |
| Error | Red (#EF4444) |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effect
- **Body**: Regular weight, good readability

### Effects

- **Glassmorphism**: Frosted glass backgrounds
- **Gradients**: Smooth purple/cyan transitions
- **Shadows**: Subtle depth with colored glows
- **Animations**: Smooth transitions (0.3s ease)

### Responsive Breakpoints

```css
/* Mobile */
max-width: 640px

/* Tablet */
max-width: 768px

/* Desktop */
min-width: 1024px

/* Large Desktop */
min-width: 1280px
```

---

## 🔐 Environment Variables

### Backend (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skill-exchange

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
```

### Frontend (optional `.env`)

```env
# API URL (if not using Vite proxy)
VITE_API_URL=http://localhost:5000/api
```

---

## 📝 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Made with ❤️ for the skill-sharing community
</p>
