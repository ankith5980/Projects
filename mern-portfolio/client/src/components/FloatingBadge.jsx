import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * The accent disc from the reference (the "Hi" circle) and its smaller
 * siblings. Floats on a slow y-loop; transform-only.
 */
const FloatingBadge = ({
  children,
  size = 88,
  delay = 0,
  float = 10,
  className = '',
  filled = true,
  ...rest
}) => {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size }}
      {...rest}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
        className="relative flex h-full w-full items-center justify-center rounded-full"
      >
        {/* Disc */}
        <span
          className={`relative flex h-full w-full items-center justify-center rounded-full font-display font-semibold ${
            filled
              ? 'bg-accent text-on-accent'
              : 'border border-accent/50 bg-accent/10 text-accent backdrop-blur-md'
          }`}
          style={filled ? { boxShadow: 'var(--shadow-2)' } : undefined}
        >
          {children}
        </span>
      </motion.div>
    </motion.div>
  );
};

/**
 * Small solid dot used as a decorative accent. `onAccent` switches it to the
 * on-accent colour for use on top of a solid accent panel, where an accent
 * dot would disappear.
 */
export const AccentDot = ({ size = 14, className = '', delay = 0, onAccent = false }) => (
  <motion.span
    aria-hidden="true"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className={`pointer-events-none absolute rounded-full ${onAccent ? 'bg-on-accent' : 'bg-accent'} ${className}`}
    style={{ width: size, height: size }}
  />
);

export default FloatingBadge;
