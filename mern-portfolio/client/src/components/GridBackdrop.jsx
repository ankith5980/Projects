import React from 'react';

/**
 * Fixed, non-interactive page backdrop: a faint technical grid plus two very
 * soft violet washes — just enough atmosphere that long scrolls don't go flat.
 * Pure CSS — no canvas, no per-frame JS — so it costs nothing on scroll.
 */
const GridBackdrop = React.memo(() => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
  >
    {/* Grid lines */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage:
          'radial-gradient(ellipse 100% 70% at 50% 0%, black 30%, transparent 85%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 70% at 50% 0%, black 30%, transparent 85%)',
      }}
    />

    {/* Violet wash — top centre, behind the hero portrait */}
    <div
      className="absolute left-1/2 top-[-14rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-[140px] sm:h-[46rem] sm:w-[46rem]"
      style={{
        background:
          'radial-gradient(circle, rgb(var(--accent) / 0.14) 0%, transparent 68%)',
      }}
    />

    {/* Violet wash — lower left, keeps the long scroll from going flat */}
    <div
      className="absolute bottom-[10%] left-[-12rem] h-[30rem] w-[30rem] rounded-full opacity-30 blur-[140px]"
      style={{
        background:
          'radial-gradient(circle, rgb(var(--accent-soft) / 0.12) 0%, transparent 70%)',
      }}
    />

    {/* Vignette so the grid never competes with content */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgb(var(--bg) / 0.55) 100%)',
      }}
    />
  </div>
));

GridBackdrop.displayName = 'GridBackdrop';

export default GridBackdrop;
