"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = "none";

    const cursor = cursorRef.current;

    // quickTo is highly optimized for tracking cursor movements
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
        gsap.to(cursor, { scale: 1.6, rotate: -15, duration: 0.4, ease: "back.out(2)" });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
        gsap.to(cursor, { scale: 1, rotate: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.style.cursor = "auto"; // Restore on cleanup
    };
  }, []);

  // Note: We hide the custom cursor on touch devices using hidden md:flex
  return (
    <div 
      ref={cursorRef} 
      className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center transform-gpu origin-center -translate-x-1/2 -translate-y-1/2" 
    >
      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-md" />
    </div>
  );
}