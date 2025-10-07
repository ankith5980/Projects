import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaTag, 
  FaArrowRight,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import { formatDate, getCategoryColor } from '../utils/blogUtils.js';
import { useViewTracker } from '../context/ViewTrackerContext.jsx';

// Mock blog data - This would typically come from your API
const mockBlogPosts = [
  {
    id: 1,
    title: "Building Scalable React Applications with Modern Architecture",
    slug: "building-scalable-react-applications",
    excerpt: "Learn how to structure React applications for scalability, maintainability, and performance. We'll explore best practices, design patterns, and tools that make a difference.",
    content: "Full blog content here...",
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
    content: "Full blog content here...",
    author: "Ankith",
    date: "2024-09-28",
    readTime: "12 min read",
    category: "Node.js",
    tags: ["Node.js", "Performance", "Backend", "Optimization"],
    featured: true,
    image: "/images/blog/nodejs-performance.jpg",
    views: 980
  },
  {
    id: 3,
    title: "Modern CSS Techniques: Grid, Flexbox, and Beyond",
    slug: "modern-css-techniques-grid-flexbox",
    excerpt: "Explore advanced CSS layout techniques, custom properties, and modern features that make responsive design easier and more maintainable.",
    content: "Full blog content here...",
    author: "Ankith",
    date: "2024-09-25",
    readTime: "6 min read",
    category: "CSS",
    tags: ["CSS", "Layout", "Responsive Design", "Web Design"],
    featured: false,
    image: "/images/blog/modern-css.jpg",
    views: 750
  },
  {
    id: 4,
    title: "Database Design Patterns for Modern Web Applications",
    slug: "database-design-patterns-web-applications",
    excerpt: "Learn essential database design patterns, normalization techniques, and optimization strategies for web applications.",
    content: "Full blog content here...",
    author: "Ankith",
    date: "2024-09-22",
    readTime: "10 min read",
    category: "Database",
    tags: ["Database", "Design Patterns", "SQL", "Performance"],
    featured: false,
    image: "/images/blog/database-design.jpg",
    views: 620
  },
  {
    id: 5,
    title: "JavaScript ES2024: New Features and Best Practices",
    slug: "javascript-es2024-new-features",
    excerpt: "Discover the latest JavaScript features in ES2024, including new array methods, decorators, and performance improvements.",
    content: "Full blog content here...",
    author: "Ankith",
    date: "2024-09-18",
    readTime: "7 min read",
    category: "JavaScript",
    tags: ["JavaScript", "ES2024", "Features", "Best Practices"],
    featured: false,
    image: "/images/blog/javascript-es2024.jpg",
    views: 890
  },
  {
    id: 6,
    title: "DevOps Best Practices: CI/CD Pipeline Implementation",
    slug: "devops-cicd-pipeline-implementation",
    excerpt: "Step-by-step guide to implementing robust CI/CD pipelines using modern DevOps tools and practices.",
    content: "Full blog content here...",
    author: "Ankith",
    date: "2024-09-15",
    readTime: "15 min read",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Automation", "Docker"],
    featured: false,
    image: "/images/blog/devops-cicd.jpg",
    views: 1100
  }
];

const categories = ["All", "React", "Node.js", "CSS", "JavaScript", "Database", "DevOps"];

const BlogPost = React.memo(({ post, index }) => {
  const { getViewCount, incrementView } = useViewTracker();
  const currentViews = getViewCount(post.slug, post.views);

  const handlePostClick = () => {
    incrementView(post.slug, post.views);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-white dark:bg-dark-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        post.featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <div className={`${post.featured ? 'md:flex' : ''}`}>
        <div className={`relative overflow-hidden ${post.featured ? 'md:w-1/2' : ''}`}>
          <Link to={`/blog/${post.slug}`} onClick={handlePostClick}>
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary-500 to-secondary-500">
              <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-white font-bold text-lg">{post.category}</span>
              </div>
            </div>
          </Link>
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <motion.span 
              key={currentViews}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs"
            >
              {currentViews.toLocaleString()} views
            </motion.span>
          </div>
        </div>
      
      <div className={`p-6 ${post.featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <FaCalendarAlt className="w-4 h-4" />
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <FaClock className="w-4 h-4" />
          <span>{post.readTime}</span>
        </div>
        
        <h2 className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors ${
          post.featured ? 'text-xl lg:text-2xl' : 'text-lg'
        }`}>
          <Link to={`/blog/${post.slug}`} onClick={handlePostClick} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <FaUser className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              by {post.author}
            </span>
          </div>
          
          <Link
            to={`/blog/${post.slug}`}
            onClick={handlePostClick}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
          >
            Read More
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  </motion.article>
);
});

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Simulate API call
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockBlogPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on web development, technology, and programming best practices.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors sm:hidden"
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            
            {/* Desktop Categories */}
            <div className="hidden sm:flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-dark-200 sm:hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Categories</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <BlogPost key={post.id} post={post} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {featuredPosts.length > 0 ? 'Recent Posts' : 'All Posts'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <BlogPost key={post.id} post={post} index={index + featuredPosts.length} />
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;