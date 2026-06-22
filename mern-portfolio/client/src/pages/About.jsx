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
  FaBrain,
  FaRobot,
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
  SiSupabase,
  SiFirebase,
  SiHtml5,
  SiPhp,
  SiPowerbi,
  SiPostgresql,
  SiBootstrap,
  SiNotion,
  SiPostman
} from 'react-icons/si';

const OllamaIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.361 10.26a.894.894 0 0 0-.558.47l-.072.148.001.207c0 .193.004.217.059.353.076.193.152.312.291.448.24.238.51.3.872.205a.86.86 0 0 0 .517-.436.752.752 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.06 1.06 0 0 0-.466 0zm-9.203.005c-.305.096-.533.32-.65.639a1.187 1.187 0 0 0-.06.52c.057.309.31.59.598.667.362.095.632.033.872-.205.14-.136.215-.255.291-.448.055-.136.059-.16.059-.353l.001-.207-.072-.148a.894.894 0 0 0-.565-.472 1.02 1.02 0 0 0-.474.007Zm4.184 2c-.131.071-.223.25-.195.383.031.143.157.288.353.407.105.063.112.072.117.136.004.038-.01.146-.029.243-.02.094-.036.194-.036.222.002.074.07.195.143.253.064.052.076.054.255.059.164.005.198.001.264-.03.169-.082.212-.234.15-.525-.052-.243-.042-.28.087-.355.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48.394.394 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053-.053-.032c-.219-.13-.259-.145-.391-.143a.396.396 0 0 0-.193.032zm.39-2.195c-.373.036-.475.05-.654.086-.291.06-.68.195-.951.328-.94.46-1.589 1.226-1.787 2.114-.04.176-.045.234-.045.53 0 .294.005.357.043.524.264 1.16 1.332 2.017 2.714 2.173.3.033 1.596.033 1.896 0 1.11-.125 2.064-.727 2.493-1.571.114-.226.169-.372.22-.602.039-.167.044-.23.044-.523 0-.297-.005-.355-.045-.531-.288-1.29-1.539-2.304-3.072-2.497a6.873 6.873 0 0 0-.855-.031zm.645.937a3.283 3.283 0 0 1 1.44.514c.223.148.537.458.671.662.166.251.26.508.303.82.02.143.01.251-.043.482-.08.345-.332.705-.672.957a3.115 3.115 0 0 1-.689.348c-.382.122-.632.144-1.525.138-.582-.006-.686-.01-.853-.042-.57-.107-1.022-.334-1.35-.68-.264-.28-.385-.535-.45-.946-.03-.192.025-.509.137-.776.136-.326.488-.73.836-.963.403-.269.934-.46 1.422-.512.187-.02.586-.02.773-.002zm-5.503-11a1.653 1.653 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503 0 .544.064 1.24.155 1.721.02.107.031.202.023.208a8.12 8.12 0 0 1-.187.152 5.324 5.324 0 0 0-.949 1.02 5.49 5.49 0 0 0-.94 2.339 6.625 6.625 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195-.037.064c-.269.452-.498 1.105-.605 1.732-.084.496-.095.629-.095 1.294 0 .67.009.803.088 1.266.095.555.288 1.143.503 1.534.071.128.243.393.264.407.007.003-.014.067-.046.141a7.405 7.405 0 0 0-.548 1.873c-.062.417-.071.552-.071.991 0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.915.915 0 0 0-.194-.25 1.74 1.74 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451.124-.486.329-.918.544-1.154a.787.787 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.136 3.136 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834.563-.814 1.353-1.336 2.237-1.475.199-.033.57-.028.776.01.226.04.367.028.512-.041.179-.085.268-.19.374-.431.093-.215.165-.333.36-.576.234-.29.46-.489.822-.729.413-.27.884-.467 1.352-.561.17-.035.25-.04.569-.04.319 0 .398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602.034.057.095.177.132.267.105.241.195.346.374.43.14.068.286.082.503.045.343-.058.607-.053.943.016 1.144.23 2.14 1.173 2.581 2.437.385 1.108.276 2.267-.296 3.153-.097.15-.193.27-.333.419-.301.322-.301.722-.001 1.053.493.539.801 1.866.708 3.036-.062.772-.26 1.463-.533 1.854a2.096 2.096 0 0 1-.224.258.916.916 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295.253 1.008.231 2.01-.059 2.581a.845.845 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074.036-.134c.019-.076.057-.3.088-.516.029-.217.029-1.016 0-1.258-.11-.875-.295-1.57-.597-2.226-.032-.074-.053-.138-.046-.141.008-.005.057-.074.108-.152.376-.569.607-1.284.724-2.228.031-.26.031-1.378 0-1.628-.083-.645-.182-1.082-.348-1.525a6.083 6.083 0 0 0-.329-.7l-.038-.064.131-.194c.402-.604.636-1.262.727-2.04a6.625 6.625 0 0 0-.024-1.358 5.512 5.512 0 0 0-.939-2.339 5.325 5.325 0 0 0-.95-1.02 8.097 8.097 0 0 1-.186-.152.692.692 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503-.19-.924-.535-1.658-.98-2.082-.354-.338-.716-.482-1.15-.455-.996.059-1.8 1.205-2.116 3.01a6.805 6.805 0 0 0-.097.726c0 .036-.007.066-.015.066a.96.96 0 0 1-.149-.078A4.857 4.857 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a.958.958 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a6.71 6.71 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2.096 2.096 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388.03.113.06.244.069.292.007.047.026.152.041.233.067.365.098.76.102 1.24l.002.475-.12.175-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.438 8.438 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711.067-.05.079-.049.157.013zm9.825-.012c.17.126.358.46.498.888.28.854.36 2.028.212 3.145-.019.14-.024.151-.057.144l-.238-.06a3.693 3.693 0 0 0-.954-.124h-.278l-.119-.178-.119-.175.002-.474c.004-.669.066-1.19.214-1.772.157-.623.434-1.185.68-1.382.078-.062.09-.063.159-.012z"/>
  </svg>
);

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

  const getTextColor = (text) => {
    return 'text-primary-600 dark:text-primary-400';
  };

  return (
    <span className="relative inline-flex items-center">
      <motion.span
        key={currentTextIndex}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`font-bold ${getTextColor(texts[currentTextIndex])}`}
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
  { name: 'Power BI', icon: SiPowerbi, color: 'text-yellow-600' },
  { name: 'HTML', icon: SiHtml5, color: 'text-orange-600' },
  { name: 'PHP', icon: SiPhp, color: 'text-indigo-600' },
  { name: 'MySQL', icon: SiMysql, color: 'text-orange-500' },
  { name: 'Machine Learning', icon: FaRobot, color: 'text-purple-600' },
  { name: 'Supabase', icon: SiSupabase, color: 'text-green-500' },
  { name: 'Firebase', icon: SiFirebase, color: 'text-yellow-500' },
  { name: 'Ollama', icon: OllamaIcon, color: 'text-gray-900 dark:text-gray-100' },
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

const About = () => {
  // Memoized typing texts for the title
  const typingTexts = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer', 
    'Creative Problem Solver',
    'AI/ML Enthusiast'
  ], []);

  const aboutData = useMemo(() => ({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'I\'m a passionate Full Stack Developer with a strong foundation in modern web and mobile technologies. I enjoy creating elegant, efficient solutions that solve real-world problems.',
    location: 'Kozhikode, Kerala, India',
    email: 'ankithpratheesh147@gmail.com',
    phone: '+91 9495540233',
    experience: '0',
    projects: '10',
    ongoingProjects: '1',
    avatar: { url: '/images/Ankith.jpg' },
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      instagram: 'https://www.instagram.com/ankith.pm/',
    }
  }), []);

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



  return (
    <div className="min-h-screen section-padding pt-20">
      <SEO 
        title="About Ankith Pratheesh Menon - Professional Background & Skills"
        description="Learn more about Ankith Pratheesh Menon - Professional Full Stack Developer from Kerala, India with expertise in React, Node.js, Flutter, Next.js, and modern web technologies. Discover my educational background at St. Joseph's College (Autonomous), Devagiri, professional experience, and passion for creating innovative software solutions."
        keywords="about Ankith Pratheesh Menon, Ankith biography, full-stack developer background, React developer Kerala, Node.js expert India, software engineer profile, web development experience, St. Joseph's College Devagiri graduate, computer science engineer, Next.js developer"
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
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden bg-primary-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src={aboutData.avatar?.url || '/images/Ankith.jpg'}
                      alt={aboutData.fullName}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      width="384"
                      height="384"
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
                <span className="text-primary-600 dark:text-primary-400">{aboutData.fullName}</span>
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
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary-500 rounded-full"
                  />
                </div>
              </motion.h2>
              
              {/* Quick Stats */}
              <div className="flex gap-4 mb-8 justify-center lg:justify-start">
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 px-6 py-4 rounded-lg text-center flex flex-col justify-center min-w-[130px]">
                  <div className="text-2xl font-bold text-primary-600">{aboutData.experience || '3+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years Experience</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 px-6 py-4 rounded-lg text-center flex flex-col justify-center min-w-[130px]">
                  <div className="text-2xl font-bold text-primary-600">{aboutData.projects || '50+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects Completed</div>
                </div>
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 px-6 py-4 rounded-lg text-center flex flex-col justify-center min-w-[130px]">
                  <div className="text-2xl font-bold text-primary-600">{aboutData.ongoingProjects || '2+'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ongoing Project(s)</div>
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
                  className="inline-flex items-center space-x-2 bg-primary-600/20 backdrop-blur-md border border-primary-600/40 hover:bg-primary-600/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  <FaEnvelope className="w-4 h-4" />
                  <span>Get In Touch</span>
                </Link>
                <a
                  href="/cv/My_Resume.pdf"
                  download="Ankith_Pratheesh_Menon_CV.pdf"
                  className="inline-flex items-center space-x-2 bg-purple-600/20 backdrop-blur-md border border-purple-600/40 hover:bg-purple-600/30 text-purple-700 dark:text-purple-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
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
            My <span className="text-primary-600 dark:text-primary-400">Story</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-8 rounded-2xl shadow-lg">
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
            Technologies & <span className="text-primary-600 dark:text-primary-400">Skills</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg text-center group transition-all duration-200"
                style={{ 
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.setProperty('--opacity', '1');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--opacity', '0');
                }}
              >
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 rounded-xl"
                  style={{
                    opacity: 'var(--opacity, 0)',
                    background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(59, 130, 246, 0.15), transparent 40%)`
                  }}
                />
                <tech.icon className={`relative z-10 w-12 h-12 mx-auto mb-3 ${tech.color} group-hover:scale-110 transition-transform duration-200`} />
                <h3 className="relative z-10 font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
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
            Experience & <span className="text-primary-600 dark:text-primary-400">Education</span>
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
                <div className="ml-6 flex-1 bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg">
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
            Personal <span className="text-primary-600 dark:text-primary-400">Interests</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all duration-200"
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
          <motion.div variants={itemVariants} className="bg-primary-600 rounded-2xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Let's Work Together!</h2>
            <p className="text-xl mb-8 opacity-90">
              Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <FaEnvelope className="w-5 h-5" />
                  <span>Start a Conversation</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/projects"
                  className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border-2 border-white/40 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <FaRocket className="w-5 h-5" />
                  <span>View My Work</span>
                </Link>
              </motion.div>
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
                className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
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
                className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
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
                className="p-3 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-all duration-200"
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