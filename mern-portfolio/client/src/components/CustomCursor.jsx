import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use refs for state that's accessed inside event listeners to avoid stale closures
  // and prevent needing to re-bind event listeners on every state change
  const hoverStateRef = useRef(false);
  const visibleStateRef = useRef(false);

  // Motion values to track pointer without triggering React re-renders on every pixel move
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  // Physics for the crisp center dot (very tight spring)
  const dotX = useSpring(pointerX, { stiffness: 2000, damping: 50, mass: 0.1 });
  const dotY = useSpring(pointerY, { stiffness: 2000, damping: 50, mass: 0.1 });

  // Physics for the trailing ring (loose, smooth spring)
  const ringX = useSpring(pointerX, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(pointerY, { stiffness: 150, damping: 20, mass: 0.5 });

  const isInteractiveElement = (element) => {
    // If element is completely invalid or doesn't support closest() (e.g. some deep text nodes or shadow DOM issues)
    if (!element || typeof element.closest !== 'function') {
      // Check parent node if closest is not a function
      if (element.parentNode && typeof element.parentNode.closest === 'function') {
        element = element.parentNode;
      } else {
        return false;
      }
    }

    // Check if the element itself or any parent is an interactive element
    // This perfectly captures hovering over text <span> or <svg> icons inside a button/link
    const interactiveParent = element.closest(
      'button, a, input, textarea, select, label, summary, [role="button"], [role="link"], [data-cursor="pointer"]'
    );

    if (interactiveParent) {
      return true;
    }

    // Fallback: check if the computed style has cursor: pointer
    try {
      if (window.getComputedStyle(element).cursor === 'pointer') {
        return true;
      }
      if (element.parentElement && window.getComputedStyle(element.parentElement).cursor === 'pointer') {
        return true;
      }
    } catch (e) {
      // Ignore computed style errors
    }

    return false;
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
      
      if (!visibleStateRef.current) {
        visibleStateRef.current = true;
        setIsVisible(true);
      }
      
      // Secondary hover check as a fallback during fast mouse movement
      // elementFromPoint can be slightly expensive, so we only use it if we are currently 
      // not hovering but want to double-check in case mouseover was missed
      if (!hoverStateRef.current && e.movementX > 0) {
         // Optionally do elementFromPoint here, but mouseover is usually sufficient
      }
    };

    const handleMouseOver = (e) => {
      const interactive = isInteractiveElement(e.target);
      if (interactive !== hoverStateRef.current) {
        hoverStateRef.current = interactive;
        setIsHovering(interactive);
      }
    };

    const handleMouseLeave = () => {
      visibleStateRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      visibleStateRef.current = true;
      setIsVisible(true);
    };

    // Use event delegation on the window for best reliability
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
  }, [pointerX, pointerY]); // Removed isHovering and isVisible to prevent re-binding listeners

  return (
    <>
      {/* Outer Ring/Blob */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform mix-blend-difference"
        style={{ 
          x: ringX, 
          y: ringY, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
          width: isHovering ? 48 : 36,
          height: isHovering ? 48 : 36,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          borderWidth: isHovering ? '0px' : '2px',
          borderColor: 'rgba(255, 255, 255, 1)',
        }}
        transition={{
          width: { type: 'spring', stiffness: 300, damping: 20 },
          height: { type: 'spring', stiffness: 300, damping: 20 },
          backgroundColor: { duration: 0.15 },
          opacity: { duration: 0.3 }
        }}
      />
      
      {/* Inner Crisp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform mix-blend-difference"
        style={{ 
          x: dotX, 
          y: dotY, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}
        animate={{ 
          opacity: isVisible && !isHovering ? 1 : 0,
          scale: isHovering ? 0 : 1
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.15 }
        }}
      />
    </>
  );
};

export default CustomCursor;