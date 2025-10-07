import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaTag, 
  FaArrowLeft,
  FaShare,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaCheck,
  FaEye
} from 'react-icons/fa';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import { parseMarkdown, formatDate, getSocialShareUrl } from '../utils/blogUtils.js';
import { useViewTracker } from '../context/ViewTrackerContext.jsx';

// Mock blog data - This would typically come from your API
const mockBlogPosts = [
  {
    id: 1,
    title: "Building Scalable React Applications with Modern Architecture",
    slug: "building-scalable-react-applications",
    excerpt: "Learn how to structure React applications for scalability, maintainability, and performance. We'll explore best practices, design patterns, and tools that make a difference.",
    content: `
# Building Scalable React Applications with Modern Architecture

When building React applications that need to scale, architecture becomes crucial. In this comprehensive guide, we'll explore the patterns, practices, and tools that make the difference between a maintainable codebase and a nightmare to work with.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Performance Optimization](#performance-optimization)
5. [Testing Strategy](#testing-strategy)

## Project Structure

A well-organized project structure is the foundation of any scalable application. Here's a battle-tested structure that works well for most React applications:

\`\`\`
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components
├── pages/               # Page components (route components)
├── hooks/               # Custom React hooks
├── services/            # API services and external integrations
├── utils/               # Utility functions
├── context/             # React Context providers
├── constants/           # Application constants
└── types/               # TypeScript type definitions
\`\`\`

This structure separates concerns clearly and makes it easy for new team members to understand where to find and place code.

## Component Architecture

### Component Composition

One of the most important principles in React is component composition. Instead of creating large, monolithic components, break them down into smaller, focused pieces:

\`\`\`jsx
// Bad: Monolithic component
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="avatar">
        <img src={user.avatar} alt={user.name} />
      </div>
      <div className="info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <div className="stats">
          <span>Posts: {user.postCount}</span>
          <span>Followers: {user.followers}</span>
        </div>
      </div>
    </div>
  );
}

// Good: Composed components
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <UserAvatar src={user.avatar} alt={user.name} />
      <UserInfo user={user} />
      <UserStats stats={{ posts: user.postCount, followers: user.followers }} />
    </div>
  );
}
\`\`\`

### Custom Hooks for Logic Reuse

Custom hooks are perfect for extracting and reusing stateful logic:

\`\`\`jsx
// Custom hook for form handling
function useForm(initialValues, validationSchema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};
    // Validation logic here
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validate,
    setIsSubmitting
  };
}
\`\`\`

## State Management

### Context vs Redux vs Zustand

The choice of state management depends on your application's complexity:

- **React Context**: Perfect for simple global state (theme, auth)
- **Redux Toolkit**: Best for complex state with time-travel debugging needs
- **Zustand**: Great middle ground - simple API with powerful features

Here's an example using Zustand:

\`\`\`jsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useAuthStore = create()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        login: async (credentials) => {
          const user = await authService.login(credentials);
          set({ user, isAuthenticated: true });
        },
        logout: () => {
          authService.logout();
          set({ user: null, isAuthenticated: false });
        },
      }),
      { name: 'auth-storage' }
    )
  )
);
\`\`\`

## Performance Optimization

### Memoization Strategies

Use React's built-in memoization tools strategically:

\`\`\`jsx
// Memoize expensive calculations
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveComputation(item)
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});

// Memoize event handlers
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={useCallback(() => onToggle(todo.id), [todo.id, onToggle])}
          onDelete={useCallback(() => onDelete(todo.id), [todo.id, onDelete])}
        />
      ))}
    </div>
  );
}
\`\`\`

### Code Splitting

Implement route-based code splitting for better performance:

\`\`\`jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } 
      />
    </Routes>
  );
}
\`\`\`

## Testing Strategy

A comprehensive testing strategy includes:

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows

\`\`\`jsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo',
    completed: false
  };

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });
});
\`\`\`

## Conclusion

Building scalable React applications requires thoughtful architecture decisions from the start. By following these patterns and practices, you'll create applications that are not only performant but also maintainable and enjoyable to work with.

Remember, the best architecture is one that serves your team and project needs. Start simple and evolve as your requirements grow.

## Further Reading

- [React Documentation](https://react.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
`,
    author: "Ankith",
    date: "2024-10-01",
    readTime: "8 min read",
    category: "React",
    tags: ["React", "Architecture", "Best Practices", "Performance"],
    featured: true,
    image: "/images/blog/react-architecture.jpg",
    views: 1250
  },
  {
    id: 2,
    title: "The Complete Guide to Node.js Performance Optimization",
    slug: "nodejs-performance-optimization-guide",
    excerpt: "Deep dive into Node.js performance optimization techniques, from profiling to clustering, caching strategies, and memory management.",
    content: `
# The Complete Guide to Node.js Performance Optimization

Node.js applications can handle thousands of concurrent connections, but only if they're properly optimized. This comprehensive guide covers everything you need to know about Node.js performance optimization.

## Understanding Node.js Performance

Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. However, CPU-intensive operations can block the event loop and degrade performance.

### The Event Loop

The event loop is the heart of Node.js. Understanding how it works is crucial for optimization:

\`\`\`javascript
// This blocks the event loop
function blockingOperation() {
  let sum = 0;
  for (let i = 0; i < 10000000000; i++) {
    sum += i;
  }
  return sum;
}

// This doesn't block the event loop
function nonBlockingOperation() {
  return new Promise(resolve => {
    setImmediate(() => {
      let sum = 0;
      for (let i = 0; i < 10000000000; i++) {
        sum += i;
      }
      resolve(sum);
    });
  });
}
\`\`\`

## Profiling and Monitoring

Before optimizing, you need to identify bottlenecks:

### Using the Built-in Profiler

\`\`\`bash
# Start your app with profiling
node --prof app.js

# Process the profile
node --prof-process isolate-*.log > processed.txt
\`\`\`

### Monitoring with Clinic.js

\`\`\`bash
npm install -g clinic
clinic doctor -- node app.js
\`\`\`

## Memory Management

### Avoiding Memory Leaks

Common memory leak patterns and how to avoid them:

\`\`\`javascript
// Bad: Global variables accumulate
let cache = {};
function addToCache(key, value) {
  cache[key] = value; // Never cleaned up
}

// Good: Use a Map with size limits
const cache = new Map();
const MAX_CACHE_SIZE = 1000;

function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}
\`\`\`

## Clustering and Load Balancing

Take advantage of multi-core systems:

\`\`\`javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork(); // Replace the dead worker
  });
} else {
  // Workers can share any TCP/HTTP server
  require('./app.js');
  console.log(\`Worker \${process.pid} started\`);
}
\`\`\`

## Caching Strategies

### In-Memory Caching

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

function getCachedData(key) {
  const cachedResult = cache.get(key);
  if (cachedResult) {
    return Promise.resolve(cachedResult);
  }

  return fetchDataFromDatabase(key).then(result => {
    cache.set(key, result);
    return result;
  });
}
\`\`\`

### Redis Caching

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key) {
  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await fetchDataFromDatabase(key);
    await client.setex(key, 3600, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Cache error:', error);
    return fetchDataFromDatabase(key);
  }
}
\`\`\`

## Database Optimization

### Connection Pooling

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use the pool
async function queryDatabase(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
\`\`\`

## Conclusion

Node.js performance optimization is an ongoing process. Regular profiling and monitoring are essential to maintain optimal performance as your application grows.

Remember to:
- Profile before optimizing
- Focus on the biggest bottlenecks first
- Monitor in production
- Use clustering for CPU-intensive tasks
- Implement proper caching strategies
`,
    author: "Ankith",
    date: "2024-09-28",
    readTime: "12 min read",
    category: "Node.js",
    tags: ["Node.js", "Performance", "Backend", "Optimization"],
    featured: true,
    image: "/images/blog/nodejs-performance.jpg",
    views: 980
  }
];

const BlogPostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { getViewCount, incrementView } = useViewTracker();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundPost = mockBlogPosts.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        // Increment views only when directly accessing the post URL
        // This prevents double counting when clicking from blog page
        const hasBeenCounted = sessionStorage.getItem(`viewed-${slug}`);
        if (!hasBeenCounted) {
          incrementView(foundPost.slug, foundPost.views);
          sessionStorage.setItem(`viewed-${slug}`, 'true');
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, incrementView]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    } else {
      const shareUrl = getSocialShareUrl(platform, url, title);
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4" />
                </div>
                <span>by {post.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaEye className="w-4 h-4" />
                <span>{getViewCount(post.slug, post.views).toLocaleString()} views</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 aspect-video rounded-xl mb-8 flex items-center justify-center">
                <span className="text-white font-bold text-xl">{post.category}</span>
              </div>
              
              {/* Render markdown content using our parser */}
              <div 
                className="blog-content prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: parseMarkdown(post.content)
                }}
              />
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-80"
          >
            {/* Share Section */}
            <div className="bg-white dark:bg-dark-100 rounded-xl p-6 shadow-lg mb-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaShare className="w-4 h-4" />
                Share this post
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                  Share on Twitter
                </button>
                
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center gap-3 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                >
                  <FaLinkedin className="w-4 h-4" />
                  Share on LinkedIn
                </button>
                
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Related Posts or Categories could go here */}
            <div className="bg-white dark:bg-dark-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Category
              </h3>
              <Link
                to={`/blog?category=${post.category}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <FaTag className="w-4 h-4" />
                {post.category}
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;