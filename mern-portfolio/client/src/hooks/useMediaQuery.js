import { useState, useEffect } from 'react';

/**
 * Subscribe to a CSS media query.
 * Used to gate desktop-only parallax and float loops so touch devices and
 * reduced-motion users never pay for animations they don't want.
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

/** True when the user has asked for reduced motion. */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/** True at the `md` breakpoint and up. */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');

export default useMediaQuery;
