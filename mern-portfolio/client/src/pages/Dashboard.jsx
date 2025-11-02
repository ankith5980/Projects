import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen section-padding pt-32">
      <div className="container mx-auto container-padding">
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome back, {user?.username}! Manage your portfolio content from here.
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600/20 backdrop-blur-md border border-red-600/40 hover:bg-red-600/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Projects</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your portfolio projects
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Update your skills and technologies
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Edit your personal information
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Messages</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View and respond to contact messages
            </p>
          </div>
        </motion.div>

        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Select a section above to start managing your portfolio content.
                <br />
                The complete admin interface will be implemented with full CRUD operations.
              </p>
            </motion.div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;