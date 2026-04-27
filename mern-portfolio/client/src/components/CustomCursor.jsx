import React, { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Track pointer with motion values to avoid React re-renders on every pointer move.
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  // Fast center dot.
  const dotX = useSpring(pointerX, { stiffness: 1600, damping: 70, mass: 0.08 });
  const dotY = useSpring(pointerY, { stiffness: 1600, damping: 70, mass: 0.08 });

  // Smoother trailing ring.
  const ringX = useSpring(pointerX, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(pointerY, { stiffness: 380, damping: 32, mass: 0.6 });

  const ringTransition = useMemo(
    () => ({
      type: 'spring',
      stiffness: 520,
      damping: 34,
      mass: 0.45,
    }),
    []
  );

  const isInteractiveElement = (element) => {
    if (!element || !(element instanceof HTMLElement)) return false;

    const tag = element.tagName.toLowerCase();
    if (['button', 'a', 'input', 'textarea', 'select', 'label', 'summary'].includes(tag)) {
      return true;
    }

    if (
      element.closest('button, a, input, textarea, select, label, summary, [role="button"], [data-cursor="pointer"]')
    ) {
      return true;
    }

    return window.getComputedStyle(element).cursor === 'pointer';
  };

  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = 'none';
    
    // Also apply to all elements
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const updatePointerPosition = (e) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      setIsHovering(isInteractiveElement(e.target));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('pointermove', updatePointerPosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', updatePointerPosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      document.body.style.cursor = 'auto';
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [pointerX, pointerY]);

  const visibilityOpacity = isVisible ? 1 : 0;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visibilityOpacity,
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.20)' : 'rgba(59, 130, 246, 0)',
          borderWidth: isHovering ? 1 : 2,
          borderColor: isHovering ? 'rgba(59, 130, 246, 0.50)' : 'rgba(59, 130, 246, 0.80)',
          borderStyle: 'solid',
        }}
        transition={ringTransition}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visibilityOpacity, scale: isHovering ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 700, damping: 35, mass: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;