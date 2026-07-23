import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * Full-screen intro.
 *
 * The name is drawn twice: an outlined ghost and a solid violet copy clipped
 * to the load progress, so the word literally fills from the bottom up as the
 * app boots. A scan line rides the fill edge.
 *
 * On completion the panel leaves as a set of vertical slats that lift in
 * sequence, revealing the hero underneath. `onComplete` fires as the first
 * slat starts moving, so the page's own entrance animation plays during the
 * reveal instead of after it.
 */
const MIN_DURATION = 1500; // keeps the counter from flashing past on warm loads
const SLATS = 5;

const STAGES = [
  { until: 25, label: 'Initialising' },
  { until: 55, label: 'Loading assets' },
  { until: 85, label: 'Composing layout' },
  { until: 100, label: 'Finishing up' },
  { until: Infinity, label: 'Welcome' },
];

const stageFor = (p) => STAGES.find((s) => p < s.until || s.until === Infinity).label;

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const completedRef = useRef(false);

  // Lock scroll for as long as the intro owns the screen
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    let raf;
    let startedAt;
    let loaded = document.readyState === 'complete';

    const onLoad = () => { loaded = true; };
    if (!loaded) window.addEventListener('load', onLoad);

    const tick = (now) => {
      if (startedAt === undefined) startedAt = now;
      const elapsed = now - startedAt;

      // Creep toward 92 on a timer, then release to 100 once the page has
      // actually loaded and the minimum display time has passed.
      const canFinish = loaded && elapsed >= MIN_DURATION;
      const target = canFinish ? 100 : Math.min(92, (elapsed / MIN_DURATION) * 92);

      setProgress((prev) => {
        const next = prev + (target - prev) * 0.1;
        return next > 99.4 ? 100 : next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  // Hand off once the counter lands on 100
  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;

    const t = setTimeout(() => {
      setFinishing(true);
      onComplete?.();
    }, reduceMotion ? 120 : 480);

    return () => clearTimeout(t);
  }, [progress, onComplete, reduceMotion]);

  const shown = Math.round(progress);
  const stage = stageFor(shown);

  // Slats lift one after another; content clears out just ahead of them.
  const container = {
    visible: {},
    exit: { transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: 0.15 } },
  };

  const slat = reduceMotion
    ? { visible: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.25 } } }
    : {
        visible: { y: '0%' },
        exit: { y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
      };

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      variants={container}
      initial="visible"
      animate="visible"
      exit="exit"
    >
      {/* Slats form the background — the panel itself is transparent so they
          can lift independently. */}
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.div
            key={i}
            variants={slat}
            className="h-full flex-1 bg-bg"
            style={i < SLATS - 1 ? { borderRight: '1px solid var(--hairline)' } : undefined}
          />
        ))}
      </div>

      {/* Everything above the slats fades out first */}
      <motion.div
        className="relative flex h-full flex-col"
        animate={{ opacity: finishing ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Grid + wash, matching the page backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgb(var(--accent) / 0.14) 0%, transparent 70%)',
          }}
        />

        {/* HUD corner brackets — same motif as the portrait ticks */}
        <span aria-hidden="true" className="pointer-events-none absolute left-5 top-5 h-7 w-7 border-l-2 border-t-2 border-accent/50 sm:left-8 sm:top-8" />
        <span aria-hidden="true" className="pointer-events-none absolute right-5 top-5 h-7 w-7 border-r-2 border-t-2 border-accent/50 sm:right-8 sm:top-8" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-5 left-5 h-7 w-7 border-b-2 border-l-2 border-accent/50 sm:bottom-8 sm:left-8" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-5 right-5 h-7 w-7 border-b-2 border-r-2 border-accent/50 sm:bottom-8 sm:right-8" />

        {/* Top row */}
        <div className="relative flex items-start justify-between px-9 pt-9 sm:px-14 sm:pt-12">
          <span className="font-display text-sm font-bold uppercase tracking-tight text-fg">
            Ankith<span className="text-accent">.dev</span>
          </span>
          <span className="font-display text-sm font-semibold tabular-nums text-accent">
            {String(shown).padStart(3, '0')}
            <span className="text-muted">%</span>
          </span>
        </div>

        {/* Name — outlined ghost with a violet fill that rises with progress */}
        <div className="relative flex flex-1 items-center justify-center px-6">
          <div className="relative">
            {/* Dimmed so the solid fill rising through it stays legible */}
            <span
              className="text-outline-accent block select-none font-display font-bold uppercase leading-none tracking-tighter opacity-40"
              style={{ fontSize: 'clamp(3.25rem, 15vw, 10rem)' }}
            >
              Ankith
            </span>

            {/* Solid copy, clipped to the fill level */}
            <span
              aria-hidden="true"
              className="absolute inset-0 block select-none font-display font-bold uppercase leading-none tracking-tighter text-accent"
              style={{
                fontSize: 'clamp(3.25rem, 15vw, 10rem)',
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            >
              Ankith
            </span>

            {/* Scan line riding the fill edge */}
            {!finishing && progress > 1 && progress < 100 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-px bg-accent"
                style={{ bottom: `${progress}%` }}
              />
            )}
          </div>
        </div>

        {/* Stage label */}
        <div className="relative flex h-6 items-center justify-center px-6 pb-12 sm:pb-16">
          <AnimatePresence mode="wait">
            <motion.span
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="eyebrow"
            >
              {stage}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
