import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL, scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // Otherwise scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Instant scroll for better UX on route changes
    });
  }, [pathname, hash, key]);

  return null; // This component doesn't render anything
};

export default RouteScrollToTop;