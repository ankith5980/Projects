import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroPage = ({ onComplete }) => {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'exiting'

  useEffect(() => {
    // After the intro animations play, begin exit transition
    const timer = setTimeout(() => {
      setPhase('exiting');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Letter-by-letter animation for the name
  const name = 'Ankith Pratheesh Menon';
  const nameLetters = name.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.5, duration: 0.8, ease: 'easeOut' },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay: 1.2, duration: 0.8, ease: 'easeInOut' },
    },
  };

  return (
    <AnimatePresence>
      {phase === 'intro' || phase === 'exiting' ? (
        <motion.div
          key="intro-page"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={phase === 'exiting' ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (phase === 'exiting') {
              onComplete();
            }
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950" />

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-500 blur-3xl opacity-20"
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: '15%', top: '25%' }}
          />
          <motion.div
            className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500 blur-3xl opacity-20"
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 30, -25, 0],
              scale: [1, 0.95, 1.08, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ right: '10%', top: '15%' }}
          />
          <motion.div
            className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-indigo-400 via-blue-300 to-indigo-500 blur-3xl opacity-15"
            animate={{
              x: [0, -15, 25, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.05, 0.92, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: '60%', bottom: '20%' }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            {/* Greeting */}
            <motion.p
              className="text-sm sm:text-base tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 mb-4 font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Welcome to my portfolio
            </motion.p>

            {/* Name - letter by letter */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 flex flex-wrap justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className={
                    letter === ' '
                      ? 'inline-block w-3 sm:w-4'
                      : 'inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
                  }
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              className="mx-auto w-24 sm:w-32 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4 origin-center"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
            />

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light tracking-wide"
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
            >
              Full Stack Developer
            </motion.p>

            {/* Loading indicator dots */}
            <motion.div
              className="flex justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default IntroPage;
