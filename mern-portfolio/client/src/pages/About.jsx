import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  FaPlane
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
  SiExpress
} from 'react-icons/si';
import apiService from '../utils/api';

const About = () => {
  const [aboutData, setAboutData] = useState({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'Passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions and turning complex problems into simple, beautiful designs.',
    location: 'Kerala, India',
    email: 'ankith@example.com',
    phone: '+91 9876543210',
    experience: '3+ Years',
    projects: '50+ Projects',
    avatar: { url: '/images/Ankith.jpg' },
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://linkedin.com/in/ankithmenon',
      instagram: 'https://instagram.com/ankithmenon',
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
          setAboutData(prev => ({ ...prev, ...aboutRes.value.data }));
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
    { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-500' },
    { name: 'Python', icon: SiPython, color: 'text-blue-600' },
    { name: 'Flutter', icon: SiFlutter, color: 'text-blue-400' },
    { name: 'MySQL', icon: SiMysql, color: 'text-orange-500' },
    { name: 'Docker', icon: SiDocker, color: 'text-blue-500' },
    { name: 'Git', icon: SiGit, color: 'text-red-500' },
    { name: 'Tailwind', icon: SiTailwindcss, color: 'text-teal-400' },
    { name: 'Express', icon: SiExpress, color: 'text-gray-700 dark:text-gray-300' },
    { name: 'Figma', icon: SiFigma, color: 'text-purple-500' }
  ];

  // Experience timeline
  const timeline = [
    {
      year: '2024',
      title: 'Senior Full Stack Developer',
      company: 'Tech Innovation Labs',
      description: 'Leading development of scalable web applications using React, Node.js, and cloud technologies.',
      type: 'work'
    },
    {
      year: '2023',
      title: 'Full Stack Developer',
      company: 'Digital Solutions Inc.',
      description: 'Developed and maintained multiple client projects, improved performance by 40%.',
      type: 'work'
    },
    {
      year: '2022',
      title: 'Bachelor of Computer Applications',
      company: 'University of Kerala',
      description: 'Graduated with First Class Honours, specialized in Software Development.',
      type: 'education'
    },
    {
      year: '2021',
      title: 'Junior Developer',
      company: 'StartUp Ventures',
      description: 'Started my professional journey, worked on mobile and web applications.',
      type: 'work'
    }
  ];

  // Personal interests
  const interests = [
    { name: 'Coding', icon: FaCode, color: 'text-blue-500' },
    { name: 'Coffee', icon: FaCoffee, color: 'text-yellow-600' },
    { name: 'Music', icon: FaMusic, color: 'text-purple-500' },
    { name: 'Gaming', icon: FaGamepad, color: 'text-green-500' },
    { name: 'Photography', icon: FaCamera, color: 'text-pink-500' },
    { name: 'Travel', icon: FaPlane, color: 'text-indigo-500' }
  ];

  return (
    <div className="min-h-screen section-padding pt-20">
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
              <h2 className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-6">
                {aboutData.title}
              </h2>
              
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