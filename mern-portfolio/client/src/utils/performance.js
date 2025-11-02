// Performance monitoring utility
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${end - start} milliseconds`);
    }
    return result;
  };
};

// Cache utility for API responses
export const createCache = (maxAge = 5 * 60 * 1000) => { // 5 minutes default
  const cache = new Map();
  
  return {
    get: (key) => {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > maxAge) {
        cache.delete(key);
        return null;
      }
      
      return item.data;
    },
    
    set: (key, data) => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
    },
    
    clear: () => cache.clear(),
    
    delete: (key) => cache.delete(key),
    
    size: () => cache.size
  };
};

// Image preloader utility
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload multiple images
export const preloadImages = (srcArray) => {
  return Promise.all(srcArray.map(src => preloadImage(src)));
};

// Debounce utility for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Check if device is low-end
export const isLowEndDevice = () => {
  return navigator.hardwareConcurrency <= 4;
};

// Get network connection quality
export const getNetworkInfo = () => {
  if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
};

// Adaptive loading strategy
export const getLoadingStrategy = () => {
  const networkInfo = getNetworkInfo();
  const isLowEnd = isLowEndDevice();
  
  return {
    shouldReduceAnimations: isLowEnd || (networkInfo && networkInfo.saveData),
    shouldLoadHighResImages: !isLowEnd && (!networkInfo || networkInfo.effectiveType === '4g'),
    shouldPrefetchResources: !isLowEnd && (!networkInfo || networkInfo.effectiveType === '4g'),
    chunkLoadTimeout: networkInfo && networkInfo.effectiveType === 'slow-2g' ? 10000 : 5000,
  };
};

// Lazy load with intersection observer
export const lazyLoadImage = (img, src) => {
  const loadImage = () => {
    img.src = src;
    img.classList.add('loaded');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage();
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before element is visible
    });
    observer.observe(img);
  } else {
    loadImage();
  }
};

// Request idle callback with polyfill
export const requestIdleCallback = window.requestIdleCallback || function(callback) {
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1);
};

// Cancel idle callback with polyfill
export const cancelIdleCallback = window.cancelIdleCallback || function(id) {
  clearTimeout(id);
};

// Optimize animations based on device
export const getAnimationConfig = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = isLowEndDevice();
  
  return {
    disabled: prefersReducedMotion || isLowEnd,
    duration: isLowEnd ? 0.2 : 0.5,
    ease: isLowEnd ? 'linear' : 'easeInOut',
  };
};

// Prefetch resource
export const prefetchResource = (href) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// Preload critical resource
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
};