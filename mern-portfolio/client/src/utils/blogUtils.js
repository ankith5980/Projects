// Simple markdown parser for blog content
export const parseMarkdown = (markdown) => {
  if (!markdown) return '';

  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">$1</h1>')
    
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-dark-100 p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono"><code class="language-$1">$2</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-dark-100 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">$1</code>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-500 hover:text-primary-600 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Lists
    .replace(/^\* (.+)$/gim, '<li class="mb-2">$1</li>')
    .replace(/^(\d+)\. (.+)$/gim, '<li class="mb-2">$2</li>')
    
    // Blockquotes
    .replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 dark:bg-dark-100 rounded-r-lg mb-6 italic text-gray-700 dark:text-gray-300">$1</blockquote>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p class="mb-6 text-base leading-7 text-gray-800 dark:text-gray-200">')
    .replace(/^\s*(.+)$/gm, function(match, content) {
      // Don't wrap already wrapped content
      if (content.startsWith('<') || content.trim() === '') {
        return content;
      }
      return `<p class="mb-6 text-base leading-7 text-gray-800 dark:text-gray-200">${content}</p>`;
    });

  // Wrap lists in ul/ol tags
  html = html.replace(/(<li class="mb-2">.*?<\/li>)/gs, function(match) {
    return `<ul class="mb-6 pl-6 list-disc">${match}</ul>`;
  });

  return html;
};

// Format date utility
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate reading time
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return `${readingTime} min read`;
};

// Truncate text
export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Search highlight utility
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
};

// Category colors
export const getCategoryColor = (category) => {
  const colors = {
    'React': 'bg-blue-500',
    'Node.js': 'bg-green-500',
    'JavaScript': 'bg-yellow-500',
    'CSS': 'bg-purple-500',
    'Database': 'bg-red-500',
    'DevOps': 'bg-orange-500',
    'Tutorial': 'bg-indigo-500',
    'Tips': 'bg-pink-500',
    'Performance': 'bg-cyan-500',
    'Security': 'bg-gray-700'
  };
  
  return colors[category] || 'bg-gray-500';
};

// Social share URLs
export const getSocialShareUrl = (platform, url, title) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'reddit':
      return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    default:
      return url;
  }
};