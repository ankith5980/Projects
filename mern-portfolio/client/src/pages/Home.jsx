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
import { useViewTracker } from '../context/ViewTrackerContext.jsx';

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
  const { incrementView } = useViewTracker();

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
        setAboutData(prev => ({ ...prev, ...res.data }));
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
          liveUrl: 'https://ankith-portfolio.vercel.app',
          githubUrl: 'https://github.com/ankith5980/mern-portfolio'
        },
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
      Promise.all([projectsPromise, skillsPromise]).finally(() => {
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
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>View My Work</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <span>Get In Touch</span>
                </Link>
                
                <a
                  href="/cv/My Resume.pdf"
                  download="Ankith_Pratheesh_Menon_CV.pdf"
                  onClick={handleCVDownload}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
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
                    className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
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
                    className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                )}
                {aboutData?.socialLinks?.linkedin && (
                  <a
                    href={aboutData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                )}
                {aboutData?.socialLinks?.instagram && (
                  <a
                    href={aboutData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
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

      {/* Recent Blog Posts Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest from the <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development and technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Mock recent blog posts - would be fetched from API */}
            {[
              {
                id: 1,
                title: "Building Scalable React Applications",
                excerpt: "Learn how to structure React applications for scalability and maintainability...",
                date: "2024-10-01",
                readTime: "8 min read",
                category: "React",
                slug: "building-scalable-react-applications"
              },
              {
                id: 2,
                title: "Node.js Performance Optimization",
                excerpt: "Deep dive into Node.js performance optimization techniques and best practices...",
                date: "2024-09-28",
                readTime: "12 min read",
                category: "Node.js",
                slug: "nodejs-performance-optimization-guide"
              },
              {
                id: 3,
                title: "Modern CSS Techniques",
                excerpt: "Explore advanced CSS layout techniques and modern features for responsive design...",
                date: "2024-09-25",
                readTime: "6 min read",
                category: "CSS",
                slug: "modern-css-techniques-grid-flexbox"
              }
            ].map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                    <Link 
                      to={`/blog/${post.slug}`} 
                      onClick={() => incrementView(post.slug, 1250)}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      onClick={() => incrementView(post.slug, 1250)}
                      className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors"
                    >
                      Read More
                      <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
            >
              View All Posts
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;