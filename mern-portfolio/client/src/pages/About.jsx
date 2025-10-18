import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { generatePersonSchema, generateOrganizationSchema } from '../utils/personalSEO';
import { getFullUrl } from '../utils/url';
import { 
  FaCode, 
  FaGraduationCap, 
  FaBriefcase, 
  FaAward, 
  FaHeart,
  FaDownload,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRocket,
  FaCoffee,
  FaMusic,
  FaGamepad,
  FaCamera,
  FaPlane,
} from 'react-icons/fa';
import { 
  SiReact, 
  SiNodedotjs, 
  SiMongodb, 
  SiJavascript, 
  SiPython, 
  SiFlutter, 
  SiMysql,
  SiDocker,
  SiGit,
  SiFigma,
  SiTailwindcss,
  SiExpress,
  SiDjango,
  SiNumpy,
  SiPandas,
  SiTensorflow,
  SiScikitlearn,
  SiHtml5,
  SiPhp,
  SiKotlin,
  SiPostgresql,
  SiBootstrap,
  SiNotion,
  SiPostman
} from 'react-icons/si';
import apiService from '../utils/api';

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

const About = () => {
  // Memoized typing texts for the title
  const typingTexts = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer', 
    'Creative Problem Solver',
    'AI/ML Enthusiast'
  ], []);

  const [aboutData, setAboutData] = useState({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'Passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions and turning complex problems into simple, beautiful designs.',
    location: 'Kozhikode, Kerala, India',
    email: 'ankithpratheesh147@gmail.com',
    phone: '+91 9495540233',
    experience: 'Fresher',
    projects: '2 Projects',
    avatar: { url: '/images/Ankith.jpg' },
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      instagram: 'https://www.instagram.com/ankith5980/',
    }
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [aboutRes, skillsRes] = await Promise.allSettled([
          apiService.getAbout(),
          apiService.getSkills()
        ]);

        if (aboutRes.status === 'fulfilled') {
          // Filter out placeholder values from API response
          const apiData = aboutRes.value.data || {};
          const cleanedData = {};
          
          // Only use API data if it's not a placeholder
          if (apiData.fullName && !apiData.fullName.toLowerCase().includes('your name')) {
            cleanedData.fullName = apiData.fullName;
          }
          if (apiData.title && !apiData.title.toLowerCase().includes('your')) {
            cleanedData.title = apiData.title;
          }
          if (apiData.bio && !apiData.bio.toLowerCase().includes('your')) {
            cleanedData.bio = apiData.bio;
          }
          if (apiData.email && !apiData.email.toLowerCase().includes('your')) {
            cleanedData.email = apiData.email;
          }
          if (apiData.location && !apiData.location.toLowerCase().includes('your')) {
            cleanedData.location = apiData.location;
          }
          if (apiData.phone) {
            cleanedData.phone = apiData.phone;
          }
          // Only use experience if it's not placeholder (0, empty, or contains "your")
          if (apiData.experience && 
              apiData.experience !== '0' && 
              apiData.experience !== '0 years' &&
              !apiData.experience.toLowerCase().includes('your')) {
            cleanedData.experience = apiData.experience;
          }
          // Only use projects if it's not placeholder (0, empty, or contains "your")
          if (apiData.projects && 
              apiData.projects !== '0' && 
              apiData.projects !== '0 Projects' &&
              !apiData.projects.toLowerCase().includes('your')) {
            cleanedData.projects = apiData.projects;
          }
          if (apiData.avatar) {
            cleanedData.avatar = apiData.avatar;
          }
          // Only use socialLinks if they exist and are valid URLs
          if (apiData.socialLinks) {
            const validSocialLinks = {};
            if (apiData.socialLinks.github && apiData.socialLinks.github.includes('github.com')) {
              validSocialLinks.github = apiData.socialLinks.github;
            }
            if (apiData.socialLinks.linkedin && apiData.socialLinks.linkedin.includes('linkedin.com')) {
              validSocialLinks.linkedin = apiData.socialLinks.linkedin;
            }
            if (apiData.socialLinks.instagram && apiData.socialLinks.instagram.includes('instagram.com')) {
              validSocialLinks.instagram = apiData.socialLinks.instagram;
            }
            // Only merge if we have at least one valid social link
            if (Object.keys(validSocialLinks).length > 0) {
              cleanedData.socialLinks = { ...cleanedData.socialLinks, ...validSocialLinks };
            }
          }
          
          setAboutData(prev => ({ ...prev, ...cleanedData }));
        }

        if (skillsRes.status === 'fulfilled') {
          setSkills(skillsRes.value.data || []);
        }
      } catch (error) {
        console.warn('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Tech stack with icons
  const techStack = [
    { name: 'React', icon: SiReact, color: 'text-blue-500' },
    { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
    { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-700' },
    { name: 'Bootstrap', icon: SiBootstrap, color: 'text-purple-600' },
    { name: 'Notion', icon: SiNotion, color: 'text-black' },
    { name: 'Postman', icon: SiPostman, color: 'text-orange-500' },
    { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-500' },
    { name: 'Python', icon: SiPython, color: 'text-blue-600' },
    { name: 'Django', icon: SiDjango, color: 'text-green-700' },
    { name: 'Flutter', icon: SiFlutter, color: 'text-blue-400' },
    { name: 'Kotlin', icon: SiKotlin, color: 'text-purple-600' },
    { name: 'HTML', icon: SiHtml5, color: 'text-orange-600' },
    { name: 'PHP', icon: SiPhp, color: 'text-indigo-600' },
    { name: 'MySQL', icon: SiMysql, color: 'text-orange-500' },
    { name: 'NumPy', icon: SiNumpy, color: 'text-blue-700' },
    { name: 'Pandas', icon: SiPandas, color: 'text-indigo-700' },
    { name: 'TensorFlow', icon: SiTensorflow, color: 'text-orange-400' },
    { name: 'Scikit-Learn', icon: SiScikitlearn, color: 'text-orange-600' },
    { name: 'Docker', icon: SiDocker, color: 'text-blue-500' },
    { name: 'Git', icon: SiGit, color: 'text-red-500' },
    { name: 'Tailwind', icon: SiTailwindcss, color: 'text-teal-400' },
    { name: 'Express', icon: SiExpress, color: 'text-gray-700 dark:text-gray-300' },
    { name: 'Figma', icon: SiFigma, color: 'text-purple-500' }
  ];

  // Experience timeline
  const timeline = [
    {
      year: '2025',
      title: 'Pursuing Master of Computer Applications',
      company: 'St. Joseph\'s College (Autonomous), Devagiri, Calicut',
      description: 'Pursuing advanced studies in computer applications to deepen my knowledge and skills in software development and related fields.',
      type: 'education'
    },
    {
      year: '2025',
      title: 'Accquired Campus Placement',
      company: 'Accenture',
      description: 'Accquired campus placement at Accenture, a global leader in IT services and consulting.',
      type: 'work'
    },
    {
      year: '2024',
      title: 'Completed Internship on AI/ML',
      company: 'Calicut UL Cyber Park',
      description: 'Gained hands-on experience in AI/ML technologies and their applications in real-world scenarios.',
      type: 'work'
    },
    {
      year: '2022',
      title: 'Bachelor of Computer Applications',
      company: 'St. Joseph\'s College (Autonomous), Devagiri, Calicut',
      description: 'Graduated with First Class with Distinction on 2025',
      type: 'education'
    },
  ];

  // Personal interests
  const interests = [
    { name: 'Coding', icon: FaCode, color: 'text-blue-500' },
    { name: 'Tea', icon: FaCoffee, color: 'text-yellow-600' },
    { name: 'Music', icon: FaMusic, color: 'text-purple-500' },
    { name: 'Gaming', icon: FaGamepad, color: 'text-green-500' },
    { name: 'Photography', icon: FaCamera, color: 'text-pink-500' },
    { name: 'Travel', icon: FaPlane, color: 'text-indigo-500' }
  ];

  return (
    <div className="min-h-screen section-padding pt-20">
      <SEO 
        title="About Ankith Pratheesh Menon - Professional Background & Skills"
        description="Learn more about Ankith Pratheesh Menon - Professional Full Stack Developer from Kerala, India with expertise in React, Node.js, Flutter, Python, and modern web technologies. Discover my educational background at Mar Baselios Christian College of Engineering and Technology, professional experience, and passion for creating innovative software solutions."
        keywords="about Ankith Pratheesh Menon, Ankith biography, full-stack developer background, React developer Kerala, Node.js expert India, software engineer profile, web development experience, MBCCET graduate, computer science engineer"
        url="/about"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Ankith Pratheesh Menon",
          "description": "Professional background and skills of Ankith Pratheesh Menon - Full Stack Developer",
          "url": getFullUrl("/about"),
          "mainEntity": generatePersonSchema()
        }}
      />
      <div className="container mx-auto container-padding">
        
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-16 lg:py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src={aboutData.avatar?.url || '/images/Ankith.jpg'}
                      alt={aboutData.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                >
                  <FaRocket className="w-6 h-6 text-primary-600" />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
                >
                  <FaHeart className="w-6 h-6 text-red-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gradient">{aboutData.fullName}</span>
              </h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl mb-6 min-h-[3rem] flex items-center justify-center lg:justify-start relative"
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
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-600 rounded-full"
                  />
                </div>
              </motion.h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{aboutData.experience || '3+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{aboutData.projects || '50+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-8 text-sm lg:text-base">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <FaMapMarkerAlt className="text-primary-600 flex-shrink-0" />
                  <span>{aboutData.location || 'Kerala, India'}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <FaEnvelope className="text-primary-600 flex-shrink-0" />
                  <span>{aboutData.email || 'contact@ankith.dev'}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <FaPhone className="text-primary-600 flex-shrink-0" />
                  <span>{aboutData.phone || '+91 9876543210'}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>Get In Touch</span>
                </Link>
                <a
                  href="/cv/My Resume.pdf"
                  download="Ankith_Pratheesh_Menon_CV.pdf"
                  className="inline-flex items-center space-x-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Bio Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
            My <span className="text-gradient">Story</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {aboutData.bio || `I'm a passionate full-stack developer with over 3 years of experience creating 
                digital solutions that make a difference. My journey began with a curiosity about how websites work, 
                and it has evolved into a career dedicated to building scalable, user-friendly applications.`}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge with the developer community. I believe in continuous learning and staying 
                updated with the latest industry trends.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
            <FaCode className="inline-block mr-3 text-primary-600" />
            Technologies & <span className="text-gradient">Skills</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200"
              >
                <tech.icon className={`w-12 h-12 mx-auto mb-3 ${tech.color} group-hover:scale-110 transition-transform duration-200`} />
                <h3 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Experience Timeline */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
            <FaBriefcase className="inline-block mr-3 text-primary-600" />
            Experience & <span className="text-gradient">Education</span>
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative flex items-center mb-8 last:mb-0"
              >
                {/* Timeline line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-20 bg-gray-300 dark:bg-gray-600"></div>
                )}
                
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  item.type === 'work' ? 'bg-primary-600' : 'bg-green-600'
                } text-white z-10`}>
                  {item.type === 'work' ? <FaBriefcase /> : <FaGraduationCap />}
                </div>
                
                {/* Content */}
                <div className="ml-6 flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                      {item.year}
                    </span>
                  </div>
                  <h4 className="text-primary-600 dark:text-primary-400 font-semibold mb-2">{item.company}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Personal Interests */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12">
            <FaHeart className="inline-block mr-3 text-red-500" />
            Personal <span className="text-gradient">Interests</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200"
              >
                <interest.icon className={`w-8 h-8 mx-auto mb-3 ${interest.color} group-hover:scale-125 transition-transform duration-200`} />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{interest.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Let's Work Together!</h2>
            <p className="text-xl mb-8 opacity-90">
              Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                <FaEnvelope className="w-5 h-5" />
                <span>Start a Conversation</span>
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                <FaRocket className="w-5 h-5" />
                <span>View My Work</span>
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* Social Links */}
        <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-8">
          <motion.div variants={itemVariants} className="flex justify-center space-x-6">
            {aboutData.socialLinks?.github && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={aboutData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
              >
                <FaGithub className="w-6 h-6" />
              </motion.a>
            )}
            {aboutData.socialLinks?.linkedin && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={aboutData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
              >
                <FaLinkedin className="w-6 h-6" />
              </motion.a>
            )}
            {aboutData.socialLinks?.instagram && (
              <motion.a
                whileHover={{ scale: 1.2 }}
                href={aboutData.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
              >
                <FaInstagram className="w-6 h-6" />
              </motion.a>
            )}
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;