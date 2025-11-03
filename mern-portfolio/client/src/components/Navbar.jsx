import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSun, 
  FaMoon, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaProjectDiagram,
  FaCertificate, 
  FaEnvelope,
  FaCog
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shouldAnimate] = useState(() => {
    // Only animate on true first load (not on HMR or reloads)
    const hasLoaded = sessionStorage.getItem('navbarLoaded');
    if (!hasLoaded) {
      sessionStorage.setItem('navbarLoaded', 'true');
      return true;
    }
    return false;
  });
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/about', label: 'About', icon: FaUser },
    { path: '/projects', label: 'Projects', icon: FaProjectDiagram },
    { path: '/certificates', label: 'Certificates', icon: FaCertificate },
    { path: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  if (isAuthenticated() && isAdmin()) {
    navItems.push({ path: '/dashboard', label: 'Dashboard', icon: FaCog });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={shouldAnimate ? { y: -100, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-dark-200/90 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-padding">
          <div className="flex items-center justify-between h-16 md:h-18 lg:h-20">
            {/* Logo - Hidden on md to prevent overlap, shown on lg+ */}
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform hidden lg:block"
            >
              Ankith.dev
            </Link>
            
            {/* Mobile/Tablet Logo - Smaller and shown only on smaller screens */}
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform lg:hidden"
            >
              Ankith.dev
            </Link>

            {/* --- 
              MODIFICATION START 
              --- 
            */}
            
            {/* Navigation container with bright blue outline and outer glow - Better tablet positioning */}
            <div 
              className="hidden md:flex md:relative lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 rounded-full shadow-lg border-2 border-blue-500"
              style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)' }}
            >
              {/* This is your original div, now nested.
                It keeps the flex layout, internal padding, and background color.
                We removed positioning, shadow, and border from this.
              */}
              <div className="flex items-center space-x-1 md:space-x-2 bg-transparent rounded-full px-2 md:px-4 py-2">
                {navItems.map((item) => (
                  <motion.div key={item.path} className="relative">
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 ${
                        isActiveLink(item.path)
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                      } relative z-10`}
                    >
                      <item.icon className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>

                    {/* The Animated Slider */}
                    {isActiveLink(item.path) && (
                      <motion.div
                        layoutId="active-pill-slider"
                        className="absolute inset-0 bg-primary-500/20 dark:bg-white/10 backdrop-blur-md rounded-full border border-primary-500/40 dark:border-white/20"
                        style={{ zIndex: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- 
              MODIFICATION END 
              --- 
            */}

            {/* Theme Toggle - Right Side */}
            <div className="hidden md:flex items-center">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 transition-all duration-400 hover:border-white/50 dark:hover:border-white/30"
                aria-label="Toggle theme"
              >
                <div className={`absolute top-0.5 ${isDark ? 'left-0.5' : 'left-[1.875rem]'} w-6 h-6 rounded-full border-2 border-yellow-400 dark:border-blue-400 bg-transparent flex items-center justify-center transition-all duration-500 ease-in-out`}>
                  <div className="relative w-3 h-3 transition-all duration-500 ease-in-out">
                    {isDark ? (
                      <FaMoon className="w-3 h-3 text-blue-400 transition-all duration-500 ease-in-out" />
                    ) : (
                      <FaSun className="w-3 h-3 text-yellow-400 transition-all duration-500 ease-in-out" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 transition-all duration-400"
                aria-label="Toggle theme"
              >
                <div className={`absolute top-0.5 ${isDark ? 'left-0.5' : 'left-[1.875rem]'} w-6 h-6 rounded-full border-2 border-yellow-400 dark:border-blue-400 bg-transparent flex items-center justify-center transition-all duration-500 ease-in-out`}>
                  <div className="relative w-3 h-3 transition-all duration-500 ease-in-out">
                    {isDark ? (
                      <FaMoon className="w-3 h-3 text-blue-400 transition-all duration-500 ease-in-out" />
                    ) : (
                      <FaSun className="w-3 h-3 text-yellow-400 transition-all duration-500 ease-in-out" />
                    )}
                  </div>
                </div>
              </button>
              
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation (Unchanged) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="bg-white/95 dark:bg-dark-200/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
              <div className="container-padding py-4">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActiveLink(item.path)
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay (Unchanged) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;