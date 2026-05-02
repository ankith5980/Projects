"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SplashScreen() {
  const container = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousBodyTouchAction = body.style.touchAction;

    // Disable scrolling while splash screen is active
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = "0";
    body.style.width = "100%";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";

    const ctx = gsap.context(() => {
      // Floating glowing blobs animation
      gsap.to(".splash-blob", {
        y: "random(-80, 80)",
        x: "random(-80, 80)",
        scale: "random(0.8, 1.2)",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = previousHtmlOverflow;
          html.style.overscrollBehavior = previousHtmlOverscroll;
          body.style.overflow = previousBodyOverflow;
          body.style.position = previousBodyPosition;
          body.style.top = previousBodyTop;
          body.style.width = previousBodyWidth;
          body.style.overscrollBehavior = previousBodyOverscroll;
          body.style.touchAction = previousBodyTouchAction;
          setIsVisible(false);
        }
      });

      // Text rise up and fade in
      tl.from(".splash-elem", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
      })
      // Animate progress line
      .fromTo(".progress-bar", 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
        "-=0.5"
      )
      // Pause then text fades out
      .to(".splash-elem", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.in",
        delay: 0.3
      })
      // Container slides up and out of the way
      .to(container.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      });

    }, container);

    return () => {
      ctx.revert();
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overscrollBehavior = previousBodyOverscroll;
      body.style.touchAction = previousBodyTouchAction;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#FAF9F6] overflow-hidden"
    >
      {/* Animated Vibrant Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        <div className="splash-blob bg-rose-300/60 w-[50vw] h-[50vw] rounded-full blur-[100px] absolute -top-[10%] -left-[10%] mix-blend-multiply" />
        <div className="splash-blob bg-orange-200/70 w-[60vw] h-[60vw] rounded-full blur-[120px] absolute top-[30%] -right-[15%] mix-blend-multiply" />
        <div className="splash-blob bg-pink-300/50 w-[45vw] h-[45vw] rounded-full blur-[90px] absolute -bottom-[20%] left-[20%] mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-6">
        <h1 className="text-4xl md:text-6xl tracking-[0.2em] font-medium text-stone-800 splash-elem text-center">
          KIOKU STORIES
        </h1>
        
        {/* Loading Progress Bar */}
        <div className="w-48 md:w-64 h-[2px] bg-stone-200/60 mt-10 splash-elem overflow-hidden relative rounded-full">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-400 to-orange-400 w-full progress-bar origin-left rounded-full" />
        </div>

        <p className="mt-8 text-rose-500/90 text-lg md:text-xl font-serif italic splash-elem text-center">
          Crafting your unique memory...
        </p>
      </div>
    </div>
  );
}