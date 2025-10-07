import React, { createContext, useContext, useState, useEffect } from 'react';

const ViewTrackerContext = createContext();

export const useViewTracker = () => {
  const context = useContext(ViewTrackerContext);
  if (!context) {
    throw new Error('useViewTracker must be used within a ViewTrackerProvider');
  }
  return context;
};

export const ViewTrackerProvider = ({ children }) => {
  const [viewCounts, setViewCounts] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('blog-view-counts');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever viewCounts change
  useEffect(() => {
    localStorage.setItem('blog-view-counts', JSON.stringify(viewCounts));
  }, [viewCounts]);

  // Increment view for a specific post
  const incrementView = (postSlug, initialViews = 0) => {
    setViewCounts(prev => {
      const currentCount = prev[postSlug] || initialViews;
      const newCount = currentCount + 1;
      
      // In a real application, you would also send this to your backend API
      // fetch('/api/blog/increment-view', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ slug: postSlug, newCount })
      // });

      return {
        ...prev,
        [postSlug]: newCount
      };
    });
  };

  // Get current view count for a post
  const getViewCount = (postSlug, initialViews = 0) => {
    return viewCounts[postSlug] || initialViews;
  };

  // Reset all view counts (useful for development/testing)
  const resetViewCounts = () => {
    setViewCounts({});
    localStorage.removeItem('blog-view-counts');
  };

  // Get total views across all posts
  const getTotalViews = () => {
    return Object.values(viewCounts).reduce((total, count) => total + count, 0);
  };

  // Get popular posts (sorted by view count)
  const getPopularPosts = (posts) => {
    return [...posts].sort((a, b) => {
      const aViews = getViewCount(a.slug, a.views);
      const bViews = getViewCount(b.slug, b.views);
      return bViews - aViews;
    });
  };

  const value = {
    viewCounts,
    incrementView,
    getViewCount,
    resetViewCounts,
    getTotalViews,
    getPopularPosts
  };

  return (
    <ViewTrackerContext.Provider value={value}>
      {children}
    </ViewTrackerContext.Provider>
  );
};

export default ViewTrackerContext;