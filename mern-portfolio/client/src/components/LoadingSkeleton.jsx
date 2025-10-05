import React from 'react';

const LoadingSkeleton = ({ className = "", type = "text" }) => {
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