import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaDownload, 
  FaArrowRight,
  FaCode,
  FaMobile,
  FaServer,
  FaDatabase,
  FaReact,
  FaPython,
  FaJava,
  FaDocker,
  FaGitAlt,
  FaFilePdf
} from 'react-icons/fa';
import { 
  SiFlutter,
  SiMongodb,
  SiMysql
} from 'react-icons/si';
import apiService from '../utils/api';
import SEO from '../components/SEO';
import { getBaseUrl, getFullUrl, getFullImageUrl } from '../utils/url';
import { generatePersonSchema, generateOrganizationSchema } from '../utils/personalSEO';

// Lazy load non-critical sections
const SkillsSection = lazy(() => import('../components/SkillsSection'));
const ProjectsSection = lazy(() => import('../components/ProjectsSection'));

// Optimized Typing Effect Component with React.memo
const TypingEffect = React.memo(({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(() => {
      const targetText = texts[currentTextIndex];
      
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseTime]);

  // Dynamic color mapping for different roles
  const getTextColor = (text) => {
    const colorMap = {
      'Full Stack Developer': 'bg-gradient-to-r from-blue-600 to-purple-600',
      'Mobile App Developer': 'bg-gradient-to-r from-green-600 to-teal-600', 
      'Creative Problem Solver': 'bg-gradient-to-r from-orange-600 to-red-600',
      'AI/ML Enthusiast': 'bg-gradient-to-r from-purple-600 to-pink-600',
    };
    return colorMap[text] || 'bg-gradient-to-r from-primary-600 to-indigo-600';
  };

  return (
    <span className="relative inline-flex items-center">
      <motion.span
        key={currentTextIndex}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`font-bold bg-clip-text text-transparent ${getTextColor(texts[currentTextIndex])}`}
      >
        {currentText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="text-primary-600 dark:text-primary-400 font-bold ml-1 text-2xl"
      >
        |
      </motion.span>
    </span>
  );
});

TypingEffect.displayName = 'TypingEffect';

const Home = () => {
  // Static fallback data for immediate rendering
  const staticFallbackData = useMemo(() => ({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'Passionate developer creating amazing digital experiences with modern technologies.',
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      instagram: 'https://www.instagram.com/ankith5980/'
    }
  }), []);

  const [aboutData, setAboutData] = useState(staticFallbackData);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false); // Start with false for faster initial render
  const [dataLoaded, setDataLoaded] = useState(false);

  // Handle CV download tracking
  const handleCVDownload = () => {
    console.log('CV download initiated');
    // You can add analytics tracking here
    // Example: gtag('event', 'download', { file_name: 'Ankith_Pratheesh_Menon_CV.pdf' });
  };
  // Memoized typing texts to avoid re-creation on each render
  const typingTexts = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer', 
    'Creative Problem Solver',
    'AI/ML Enthusiast'
  ], []);

  // Optimized data fetching with progressive loading
  const fetchData = useCallback(async () => {
    try {
      // Fetch about data first (highest priority)
      const aboutPromise = apiService.getAbout().then(res => {
        // Filter out placeholder values from API response
        const apiData = res.data || {};
        const cleanedData = {};
        
        // Only use API data if it's not a placeholder
        if (apiData.fullName && !apiData.fullName.toLowerCase().includes('your name')) {
          cleanedData.fullName = apiData.fullName;
        }
        if (apiData.title && !apiData.title.toLowerCase().includes('your')) {
          cleanedData.title = apiData.title;
        }
        // Don't use API bio - always use fallback from staticFallbackData
        // if (apiData.bio && !apiData.bio.toLowerCase().includes('your')) {
        //   cleanedData.bio = apiData.bio;
        // }
        if (apiData.email && !apiData.email.toLowerCase().includes('your')) {
          cleanedData.email = apiData.email;
        }
        if (apiData.location && !apiData.location.toLowerCase().includes('your')) {
          cleanedData.location = apiData.location;
        }
        if (apiData.phone) {
          cleanedData.phone = apiData.phone;
        }
        if (apiData.avatar) {
          cleanedData.avatar = apiData.avatar;
        }
        if (apiData.resume) {
          cleanedData.resume = apiData.resume;
        }
        // Don't accept socialLinks from API - always use fallback
        // This ensures Instagram and other links are always displayed
        // if (apiData.socialLinks) {
        //   const validSocialLinks = {};
        //   if (apiData.socialLinks.github && apiData.socialLinks.github.includes('github.com')) {
        //     validSocialLinks.github = apiData.socialLinks.github;
        //   }
        //   if (apiData.socialLinks.linkedin && apiData.socialLinks.linkedin.includes('linkedin.com')) {
        //     validSocialLinks.linkedin = apiData.socialLinks.linkedin;
        //   }
        //   if (apiData.socialLinks.instagram && apiData.socialLinks.instagram.includes('instagram.com')) {
        //     validSocialLinks.instagram = apiData.socialLinks.instagram;
        //   }
        //   // Only update social links if we have valid ones, and merge with existing
        //   if (Object.keys(validSocialLinks).length > 0) {
        //     cleanedData.socialLinks = validSocialLinks;
        //   }
        // }
        
        setAboutData(prev => ({ ...prev, ...cleanedData }));
      }).catch(err => {
        console.warn('About data not available:', err);
      });

      // Set recent 3 projects (hardcoded)
      const recentProjects = [
        {
          _id: 1,
          title: 'MERN Portfolio Website',
          description: 'A modern, responsive portfolio website built with the MERN stack featuring dark mode, animations, and admin dashboard.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion'],
          images: [{ url: '/images/portfolio_thumbnail_1.png' }],
          liveUrl: 'https://portfolio-ankith.vercel.app',
          githubUrl: 'https://github.com/ankith5980/Projects/tree/main/mern-portfolio'
        },
        {
          _id: 2,
          title: 'Continuous Development of KOHA Library Management System',
          description: 'Live Demo isn\'t available currently due to privacy concerns. Please contact me for more details.',
          technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
          images: [{ url: '/images/kohabanner.jpg' }],
          liveUrl: 'https://koha-library-management-system.vercel.app',
          githubUrl: 'https://github.com/ankith5980/Projects/tree/main/label'
        },
        {
          _id: 3,
          title: 'Club Management System - Rotary Club of Calicut South',
          description: 'A comprehensive club management system designed to streamline operations, member management, and event planning and membership payment for the Rotary Club of Calicut South.',
          technologies: ['React', 'MongoDB Atlas', 'Tailwind CSS','Docker'],
          images: [{ url: '/images/Club_Management_App.png' }],
          liveUrl: '',
          githubUrl: '',
        }
      ];
      setFeaturedProjects(recentProjects);

      const skillsPromise = apiService.getSkills().then(res => {
        setSkills(res.data || {});
      }).catch(err => {
        console.warn('Skills data not available:', err);
      });

      // Wait for about data, let others load progressively
      await aboutPromise;
      setDataLoaded(true);
      
      // Continue loading other data in background
      Promise.all([skillsPromise]).finally(() => {
        setLoading(false);
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setDataLoaded(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Add a small delay to let initial render complete first
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Lightweight loading component for better UX
  const LoadingSpinner = () => (
    <div className="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  );

  return (
    <div className="min-h-screen">
      <SEO 
        title="Ankith Pratheesh Menon - Full Stack Developer Portfolio"
        description="Welcome to Ankith Pratheesh Menon's portfolio - Professional Full Stack Developer from Kerala, India specializing in React, Node.js, Flutter, and modern web technologies. Explore my projects, skills, and experience in software development."
        keywords="Ankith Pratheesh Menon, Ankith, full-stack developer, React developer, Node.js, JavaScript, Flutter developer, portfolio, web development, software engineer, Kerala, India, MERN stack"
        url="/"
        schemaData={generatePersonSchema()}
      />
      {/* Hero Section */}
      <section className="section-padding pt-32">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              >
                Hi, I'm{' '}
                <span className="text-gradient">
                  {aboutData?.fullName || 'Ankith Pratheesh Menon'}
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl lg:text-3xl mb-6 min-h-[3rem] flex items-center relative"
              >
                <div className="relative inline-block">
                  <TypingEffect 
                    texts={typingTexts}
                    speed={80}
                    deleteSpeed={40}
                    pauseTime={3000}
                  />
                  {/* Subtle animated underline */}
                  <motion.div
                    animate={{
                      scaleX: [0.8, 1, 0.8],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-full"
                  />
                  {/* Subtle glow behind text */}
                  <motion.div
                    animate={{
                      opacity: [0.0, 0.1, 0.0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-md blur-sm -z-10"
                  />
                </div>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              >
                {aboutData?.bio || 'Passionate developer creating amazing digital experiences with modern technologies.'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center space-x-2 bg-primary-600/20 backdrop-blur-md border border-primary-600/40 hover:bg-primary-600/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>View My Work</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-purple-600/20 backdrop-blur-md border border-purple-600/40 hover:bg-purple-600/30 text-purple-700 dark:text-purple-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>Get In Touch</span>
                </Link>
                
                <a
                  href="/cv/My Resume.pdf"
                  download="Ankith_Pratheesh_Menon_CV.pdf"
                  onClick={handleCVDownload}
                  className="inline-flex items-center space-x-2 bg-green-600/20 backdrop-blur-md border border-green-600/40 hover:bg-green-600/30 text-green-700 dark:text-green-300 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  title=""
                >
                  <FaFilePdf className="w-4 h-4" />
                  <span className="hidden sm:inline">Download CV</span>
                  <span className="sm:hidden">CV</span>
                  <FaDownload className="w-3 h-3 ml-1" />
                </a>
                
                {aboutData?.resume?.url && (
                  <a
                    href={aboutData.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>Resume</span>
                  </a>
                )}
              </motion.div>
              
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex space-x-4"
              >
                {aboutData?.socialLinks?.github && (
                  <a
                    href={aboutData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                )}
                {aboutData?.socialLinks?.linkedin && (
                  <a
                    href={aboutData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                )}
                {aboutData?.socialLinks?.instagram && (
                  <a
                    href={aboutData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                )}
              </motion.div>
            </motion.div>
            
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                    {aboutData?.avatar?.url ? (
                      <img
                        src={aboutData.avatar.url}
                        alt={aboutData.fullName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <img
                        src="/images/Ankith.jpg"
                        alt="Ankith Pratheesh Menon"
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    )}
                    <div className="w-full h-full hidden items-center justify-center text-6xl text-gray-400">
                      👤
                    </div>
                  </div>
                </div>
                
                {/* Floating Technology Elements */}
                {/* React - Top Right */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaReact className="w-6 h-6 text-blue-500" />
                </motion.div>
                
                {/* Flutter - Top Left */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
                  className="absolute -top-6 -left-6 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <SiFlutter className="w-6 h-6 text-blue-400" />
                </motion.div>
                
                {/* MongoDB - Bottom Right */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 0.6 }}
                  className="absolute -bottom-6 -right-6 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <SiMongodb className="w-6 h-6 text-green-500" />
                </motion.div>
                
                {/* MySQL - Bottom Left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.9 }}
                  className="absolute -bottom-6 -left-6 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <SiMysql className="w-6 h-6 text-orange-500" />
                </motion.div>
                
                {/* Python - Right Middle */}
                <motion.div
                  animate={{ x: [0, 12, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: 1.2 }}
                  className="absolute top-1/4 -right-10 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaPython className="w-6 h-6 text-yellow-500" />
                </motion.div>
                
                {/* Java - Left Middle */}
                <motion.div
                  animate={{ x: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute top-1/4 -left-10 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaJava className="w-6 h-6 text-red-600" />
                </motion.div>
                
                {/* Docker - Right Lower */}
                <motion.div
                  animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: 1.8 }}
                  className="absolute top-3/4 -right-10 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaDocker className="w-6 h-6 text-blue-600" />
                </motion.div>
                
                {/* Git - Left Lower */}
                <motion.div
                  animate={{ x: [0, -10, 0], y: [0, -5, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, delay: 2.1 }}
                  className="absolute top-3/4 -left-10 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaGitAlt className="w-6 h-6 text-orange-600" />
                </motion.div>
                
                {/* Original floating elements - repositioned */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2.4 }}
                  className="absolute top-1/2 -right-12 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaMobile className="w-5 h-5 text-purple-600" />
                </motion.div>
                
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, delay: 2.7 }}
                  className="absolute top-1/2 -left-12 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <FaServer className="w-5 h-5 text-green-600" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lazy-loaded Skills Section */}
      <Suspense fallback={
        <div className="section-padding bg-gray-50 dark:bg-dark-200 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <SkillsSection skills={skills} />
      </Suspense>

      {/* Lazy-loaded Projects Section */}
      <Suspense fallback={
        <div className="section-padding flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <ProjectsSection featuredProjects={featuredProjects} />
      </Suspense>
    </div>
  );
};

export default Home;