import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * The glowing violet disc from the reference (the "Hi" circle) and its
 * smaller siblings. Floats on a slow y-loop; transform-only.
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
        {/* Glow */}
        <span
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: 'rgb(var(--accent) / 0.55)' }}
        />
        {/* Disc */}
        <span
          className={`relative flex h-full w-full items-center justify-center rounded-full font-display font-semibold ${
            filled
              ? 'text-[#0A0A0A]'
              : 'border border-accent/50 text-accent backdrop-blur-md'
          }`}
          style={
            filled
              ? {
                  background:
                    'linear-gradient(140deg, rgb(var(--accent-soft)), rgb(var(--accent)))',
                  boxShadow: '0 8px 32px -6px rgb(var(--accent) / 0.7)',
                }
              : { background: 'rgb(var(--accent) / 0.10)' }
          }
        >
          {children}
        </span>
      </motion.div>
    </motion.div>
  );
};

/** Small solid violet dot used as a decorative accent. */
export const AccentDot = ({ size = 14, className = '', delay = 0 }) => {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`pointer-events-none absolute rounded-full ${className} ${
        reduceMotion ? '' : 'animate-glow-pulse'
      }`}
      style={{
        width: size,
        height: size,
        background: 'rgb(var(--accent))',
        boxShadow: '0 0 20px 4px rgb(var(--accent) / 0.6)',
      }}
    />
  );
};

export default FloatingBadge;
