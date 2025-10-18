// Utility to safely get base URL during both build and runtime
export const getBaseUrl = () => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // During build time or SSR, use environment variable or fallback
  return process.env.VITE_BASE_URL || 'https://portfolio-ankith.vercel.app';
};

// Get full URL safely
export const getFullUrl = (path = '') => {
  const baseUrl = getBaseUrl();
  return path ? `${baseUrl}${path}` : baseUrl;
};

// Get full image URL safely
export const getFullImageUrl = (imagePath) => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${getBaseUrl()}${imagePath}`;
};