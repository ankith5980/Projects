import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ className = "", type = "text", fullPage = false }) => {
  // Full page loading state for lazy loaded routes
  if (fullPage) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Logo/Brand Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Loading...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your experience
            </p>
          </motion.div>

          {/* Animated Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Content Skeleton Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-2xl mx-auto px-4"
          >
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mx-auto"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Loading Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 max-w-xs mx-auto"
          >
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Component-level skeleton for individual elements
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  
  const typeClasses = {
    text: "h-4",
    title: "h-8",
    avatar: "w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full",
    button: "h-12 w-32",
    card: "h-48"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}></div>
  );
};

export default LoadingSkeleton;