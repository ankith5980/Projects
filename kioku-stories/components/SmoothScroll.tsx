"use client";

import { useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 1. Run OUTSIDE the React lifecycle. 
// This executes instantly before Next.js or React even mount to the screen.
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
  ScrollTrigger.clearScrollMemory("manual"); // Tell GSAP to forget previous positions
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // 2. Force window to the top on initial load
    window.scrollTo(0, 0);

    // 3. The Magic Hack: Snap to top right BEFORE the page refreshes
    // This stops Next.js from saving your scrolled-down position into its cache
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  );
}