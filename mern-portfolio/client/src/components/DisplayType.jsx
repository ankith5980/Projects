import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * The giant overlapping background lettering.
 *
 * Renders up to two stacked lines — one solid-filled, one outlined — at
 * clamp() sizes that bleed past the viewport edges. Parallax is transform-only
 * and switched off below `md` and under reduced-motion, so it never touches
 * layout or paint on mobile.
 */
const DisplayType = ({
  solid,
  outlined,
  align = 'right',
  className = '',
  speed = 60,     // px of parallax travel across the scroll range
  slideIn = true,
  // Default suits single short words. Longer phrases need a smaller ramp or
  // they overflow their box and get clipped at the viewport edge.
  fontSize = 'clamp(2.75rem, 13vw, 11rem)',
}) => {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();
  const animate = isDesktop && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const ySolid = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const yOutlined = useTransform(scrollYProgress, [0, 1], [-speed * 0.6, speed * 0.6]);

  const alignment =
    align === 'right' ? 'items-end text-right'
      : align === 'center' ? 'items-center text-center'
        : 'items-start text-left';

  const lineClass =
    'font-display font-bold uppercase leading-[0.85] tracking-tighter whitespace-nowrap select-none';

  const size = { fontSize };

  const slideFrom = (dir) =>
    slideIn && !reduceMotion
      ? { initial: { opacity: 0, x: dir * 80 }, animate: { opacity: 1, x: 0 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className={`flex h-full w-full flex-col justify-center gap-1 sm:gap-2 ${alignment}`}>
        {solid && (
          <motion.div
            {...slideFrom(1)}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={animate ? { y: ySolid } : undefined}
            className="relative"
          >
            <span className={`${lineClass} block text-fg/[0.13]`} style={size}>
              {solid}
            </span>
          </motion.div>
        )}

        {outlined && (
          <motion.div
            {...slideFrom(-1)}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            style={animate ? { y: yOutlined } : undefined}
            className="relative"
          >
            <span className={`${lineClass} text-outline-accent block italic`} style={size}>
              {outlined}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DisplayType);
