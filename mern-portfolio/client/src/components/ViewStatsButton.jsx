import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaChartBar, FaTimes, FaTrash } from 'react-icons/fa';
import { useViewTracker } from '../context/ViewTrackerContext.jsx';

const ViewStatsModal = ({ isOpen, onClose }) => {
  const { viewCounts, getTotalViews, resetViewCounts } = useViewTracker();

  if (!isOpen) return null;

  const sortedPosts = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-dark-100 rounded-xl shadow-xl max-w-md w-full max-h-96 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaChartBar className="w-5 h-5 text-primary-500" />
              View Statistics
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all view counts?')) {
                    resetViewCounts();
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reset all view counts"
              >
                <FaTrash className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <FaEye className="w-4 h-4" />
                <span className="font-medium">Total Views: {getTotalViews().toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sortedPosts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No views recorded yet
                </p>
              ) : (
                sortedPosts.map(([slug, count]) => (
                  <div
                    key={slug}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-200 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ViewStatsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getTotalViews } = useViewTracker();
  const totalViews = getTotalViews();

  // Only show in development or if there are views to display
  if (process.env.NODE_ENV === 'production' && totalViews === 0) {
    return null;
  }

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-colors"
        title={`View Statistics (${totalViews} total views)`}
      >
        <FaChartBar className="w-5 h-5" />
        {totalViews > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {totalViews > 99 ? '99+' : totalViews}
          </span>
        )}
      </motion.button>

      <ViewStatsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ViewStatsButton;