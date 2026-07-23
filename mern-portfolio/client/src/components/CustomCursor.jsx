import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Detect touch/mobile devices and bail out
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(mq.matches);
    const onChange = (e) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  
  // Use refs for state that's accessed inside event listeners to avoid stale closures
  // and prevent needing to re-bind event listeners on every state change
  const hoverStateRef = useRef(false);
  const visibleStateRef = useRef(false);

  // Motion values to track pointer without triggering React re-renders on every pixel move
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  // Use pointer directly for the crisp center dot to avoid spring instability on low frame rates
  const dotX = pointerX;
  const dotY = pointerY;

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
    // Skip all cursor logic on touch/mobile devices
    if (isTouchDevice) return;

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

    let rafId = null;

    const updatePointerPosition = (e) => {
      // Throttle high-frequency pointer events to requestAnimationFrame
      // This prevents the main thread from being flooded by 1000Hz gaming mice,
      // which causes stuttering on battery power.
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        pointerX.set(e.clientX);
        pointerY.set(e.clientY);
        
        if (!visibleStateRef.current) {
          visibleStateRef.current = true;
          setIsVisible(true);
        }
        
        rafId = null;
      });
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
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', updatePointerPosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      document.body.style.cursor = 'auto';
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [pointerX, pointerY, isTouchDevice]);

  // Don't render cursor elements on touch/mobile devices
  if (isTouchDevice) return null;

  return (
    <>
      {/*
        Outer trailing ring. Fixed 36px box scaled with `scale` rather than
        animated width/height, so the cursor never triggers layout on move.
      */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 hidden h-9 w-9 rounded-full border-2 will-change-transform md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          borderColor: 'rgb(var(--accent))',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? (isHovering ? 1.35 : 1) : 0,
          backgroundColor: isHovering
            ? 'rgb(var(--accent) / 0.9)'
            : 'rgb(var(--accent) / 0)',
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          backgroundColor: { duration: 0.15 },
          opacity: { duration: 0.3 },
        }}
      />

      {/* Inner Crisp Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 hidden h-2 w-2 rounded-full will-change-transform md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          backgroundColor: 'rgb(var(--accent))',
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