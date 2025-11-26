import React, { memo } from 'react';

// Static orb configurations - CSS only, no JavaScript animations
const orbs = [
  {
    id: 1,
    gradient: 'from-blue-400 via-cyan-300 to-blue-500',
    size: 'w-96 h-96',
    left: '10%',
    top: '20%',
    animationName: 'float-slow',
  },
  {
    id: 2,
    gradient: 'from-purple-400 via-pink-300 to-purple-500',
    size: 'w-[28rem] h-[28rem]',
    left: '65%',
    top: '15%',
    animationName: 'float-medium',
  },
  {
    id: 3,
    gradient: 'from-indigo-400 via-blue-300 to-indigo-500',
    size: 'w-80 h-80',
    left: '80%',
    top: '65%',
    animationName: 'float-fast',
  },
];

const GlassmorphismBackground = memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 w-full max-w-full" style={{ minHeight: '100vh', maxWidth: '100vw' }}>
      {/* Static base gradient background - Extended to prevent white space */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 w-full" 
        style={{ minHeight: '120vh', top: '-10vh' }} />
      
      {/* Floating gradient orbs - Static for performance */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute ${orb.size} rounded-full bg-gradient-to-br ${orb.gradient} blur-3xl opacity-20`}
          style={{
            left: orb.left,
            top: orb.top,
            // Animation removed to prevent GPU strain and scrolling glitches
            transform: 'translateZ(0)', // Force GPU layer for the static background
          }}
        />
      ))}
      
      {/* Glassmorphism overlay - Reduced blur for performance */}
      <div className="absolute inset-0 backdrop-blur-[30px]" />
      
      {/* CSS Keyframe animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-15px, -20px) scale(0.95); }
          75% { transform: translate(-25px, 10px) scale(1.03); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 25px) scale(1.08); }
          66% { transform: translate(20px, -15px) scale(0.92); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -35px) scale(1.1); }
        }
      `}</style>
    </div>
  );
});

GlassmorphismBackground.displayName = 'GlassmorphismBackground';

export default GlassmorphismBackground;
