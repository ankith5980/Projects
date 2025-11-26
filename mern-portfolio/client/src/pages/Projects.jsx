import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaCode, 
  FaExternalLinkAlt, 
  FaGithub,
  FaCheckCircle,
  FaClock,
  FaArchive,
  FaSync
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { getFullUrl } from '../utils/url';

// Memoized Project Card Component for better performance
const ProjectCard = memo(({ project, statusConfig, StatusIcon, itemVariants }) => (
  <motion.div
    key={project._id}
    variants={itemVariants}
    className="group bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
  >
    {/* Project Image */}
    <div className="aspect-video bg-gradient-to-br from-primary-400 to-purple-600 relative overflow-hidden">
      {project.images?.[0]?.url ? (
        <img
          src={project.images[0].url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-4xl">
          <FaCode />
        </div>
      )}
      
      {/* Status Badge */}
      <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full text-xs">
        <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
        <span className="font-medium">{statusConfig.label}</span>
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
        {project.category}
      </div>
    </div>
    
    {/* Project Content */}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 3).map((tech, techIndex) => (
          <span
            key={techIndex}
            className="px-2 py-1 bg-gray-400/20 backdrop-blur-sm border border-gray-400/30 text-xs rounded font-medium"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="px-2 py-1 bg-gray-400/20 backdrop-blur-sm border border-gray-400/30 text-xs rounded font-medium">
            +{project.technologies.length - 3} more
          </span>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors text-sm"
              title="View Source Code"
            >
              <FaGithub className="w-3 h-3" />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 bg-primary-600/20 backdrop-blur-md border border-primary-600/40 hover:bg-primary-600/30 text-primary-700 dark:text-primary-300 rounded-lg transition-colors text-sm"
              title="View Live Demo"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  </motion.div>
));

ProjectCard.displayName = 'ProjectCard';

// Projects data
const projectsData = [
  {
    _id: 1,
    title: 'MERN Portfolio Website',
    description: 'A modern, responsive portfolio website built with the MERN stack featuring dark mode, animations, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion'],
    images: [{ url: '/images/portfolio_thumbnail_1.png' }],
    liveUrl: 'https://portfolio-ankith.vercel.app',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/mern-portfolio',
    category: 'fullstack',
    status: 'completed',
    featured: true
  },
  {
    _id: 2,
    title: 'Continuous Development of KOHA Library Management System',
    description: 'Live Demo isn\'t available currently due to privacy concerns. Please contact me for more details.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    images: [{ url: '/images/kohabanner.jpg' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/label',
    category: 'backend',
    status: 'continuous-development',
    featured: true
  },
  {
    _id: 3,
    title: 'Club Management System - Rotary Club of Calicut South',
    description: 'A comprehensive club management system designed to streamline operations, member management, and event planning and membership payment for the Rotary Club of Calicut South.',
    technologies: ['React', 'MongoDB Atlas', 'Tailwind CSS','Docker'],
    images: [{ url: '/images/Club_Management_App.png' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/rotary-club-portal',
    category: 'fullstack',
    status: 'archived',
    featured: true
  },
  {
    _id: 4,
    title: 'ICCIET 2025 Judging Portal',
    description: 'A judging portal for the International Conference on Computational Intelligence & Emerging Technologies (ICCIET) 2025, enabling judges to securely evaluate and score project submissions online. Developed by Ayush VP and Ankith Pratheesh Menon.',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript'],
    images: [{ url: '/images/icciet_judging_portal.jpg' }],
    liveUrl: 'https://icciet-judging.vercel.app/',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/iccet-judging',
    category: 'fullstack',
    status: 'completed',
    featured: true
  },
];

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

// Status configuration function
const getStatusConfig = (status) => {
  switch (status) {
    case 'completed':
      return { icon: FaCheckCircle, color: 'text-green-500', label: 'Completed' };
    case 'in-progress':
      return { icon: FaClock, color: 'text-yellow-500', label: 'In Progress' };
    case 'continuous-development':
      return { icon: FaSync, color: 'text-blue-500', label: 'Continuous Development' };
    case 'archived':
      return { icon: FaArchive, color: 'text-gray-500', label: 'Archived' };
    default:
      return { icon: FaCheckCircle, color: 'text-green-500', label: 'Completed' };
  }
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized projects data to prevent re-creation on each render
  const projects = useMemo(() => projectsData, []);

  // Simple filter - same style as Certificates section
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return project.title.toLowerCase().includes(search) ||
             project.description.toLowerCase().includes(search) ||
             project.technologies.some(tech => tech.toLowerCase().includes(search)) ||
             project.category.toLowerCase().includes(search) ||
             project.status.toLowerCase().includes(search);
    });
  }, [projects, searchTerm]);

  return (
    <div className="min-h-screen section-padding pt-40 md:pt-44 lg:pt-48">
      <SEO 
        title="Projects"
        description="Explore Ankith's portfolio of web applications, mobile apps, and software projects. Full-stack development projects built with React, Node.js, Next.js, Supabase, Python, and modern technologies."
        keywords="projects, portfolio, web applications, mobile apps, React projects, Node.js projects, Next.js projects, Supabase, TypeScript, full-stack development, software projects"
        url="/projects"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Projects - Ankith's Portfolio",
          "description": "Collection of web applications, mobile apps, and software projects by Ankith",
          "url": getFullUrl("/projects"),
          "mainEntity": {
            "@type": "ItemList",
            "name": "Projects",
            "description": "Portfolio projects by Ankith",
            "numberOfItems": filteredProjects.length
          }
        }}
      />
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-5">My Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Explore my portfolio of web applications, mobile apps, and other creative projects. 
            Each project represents a unique challenge and learning experience.
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} {searchTerm ? 'Found' : 'Total'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12 animate-slideUp group">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-300"
            aria-label="Search projects by title, description, technology, category, or status"
          />
        </div>

        {/* Projects Grid */}
        <section aria-label="Projects list">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    statusConfig={statusConfig}
                    StatusIcon={StatusIcon}
                    itemVariants={itemVariants}
                  />
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <FaCode className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Try a different search term
                </p>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Projects;