import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scroll-triggered reveal. Wraps the intersection-observer boilerplate that
 * was previously hand-rolled in ~30 places so every section shares one
 * timing curve. Animates transform + opacity only.
 */
const DIRECTIONS = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

const Reveal = ({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  once = true,
  className = '',
  as = 'div',
  ...rest
}) => {
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/** Parent that staggers direct `RevealItem` children. */
export const RevealGroup = ({
  children,
  stagger = 0.08,
  delay = 0,
  once = true,
  className = '',
  ...rest
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once, margin: '-80px' }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const revealItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const RevealItem = ({ children, className = '', as = 'div', ...rest }) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag variants={revealItemVariants} className={className} {...rest}>
      {children}
    </MotionTag>
  );
};

export default Reveal;
