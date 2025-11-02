import { lazy } from 'react';

/**
 * Enhanced lazy loading with preloading capability
 * Prevents flashing of loading states for fast loads
 * @param {Function} importFunc - Dynamic import function
 * @param {number} minLoadTime - Minimum time to show component (ms)
 * @returns {React.LazyExoticComponent}
 */
export const lazyWithMinLoadTime = (importFunc, minLoadTime = 0) => {
  return lazy(() => {
    const start = Date.now();
    
    return importFunc().then(module => {
      const elapsed = Date.now() - start;
      
      // If load was very fast (< minLoadTime), don't show loading state
      // This prevents flickering
      if (minLoadTime > 0 && elapsed < minLoadTime) {
        return new Promise(resolve => {
          setTimeout(() => resolve(module), minLoadTime - elapsed);
        });
      }
      
      return module;
    });
  });
};

/**
 * Preload a lazy-loaded component
 * @param {React.LazyExoticComponent} LazyComponent 
 */
export const preloadComponent = (LazyComponent) => {
  // Access the _payload property to trigger loading
  if (LazyComponent && LazyComponent._payload && LazyComponent._payload._result === undefined) {
    LazyComponent._payload._result;
  }
};

export default lazyWithMinLoadTime;
