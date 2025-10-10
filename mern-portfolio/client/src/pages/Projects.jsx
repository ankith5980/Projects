import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaCode, 
  FaExternalLinkAlt, 
  FaGithub,
  FaCheckCircle,
  FaClock,
  FaArchive,
  FaTimes,
  FaSync
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { getFullUrl } from '../utils/url';

// Memoized Project Card Component for better performance
const ProjectCard = memo(({ project, statusConfig, StatusIcon, itemVariants }) => (
  <motion.div
    key={project._id}
    variants={itemVariants}
    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium">
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
              className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
              title="View on GitHub"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm"
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

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized projects data to prevent re-creation on each render
  const projects = useMemo(() => [
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
      description: 'A modern, responsive library management system built with HTML, CSS, JavaScript, PHP, and MySQL.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      images: [{ url: '/images/kohabanner.jpg' }],
      liveUrl: 'https://koha-library-management-system.vercel.app',
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/koha-library-management-system',
      category: 'backend',
      status: 'continuous-development',
      featured: true
    },
  ], []);

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), []);

  // Memoized categories for filtering
  const categories = useMemo(() => [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'other', label: 'Other' }
  ], []);

  const statuses = useMemo(() => [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'continuous-development', label: 'Continuous Development' },
    { value: 'archived', label: 'Archived' }
  ], []);

  // Filter and search projects with debounced search
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           project.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           project.technologies.some(tech => 
                             tech.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                           );
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, debouncedSearchTerm, selectedCategory, selectedStatus]);

  // Memoized status configuration function
  const getStatusConfig = useCallback((status) => {
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
  }, []);

  // Memoized clear filters function
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  }, []);

  return (
    <div className="min-h-screen section-padding pt-40 md:pt-44 lg:pt-48">
      <SEO 
        title="Projects"
        description="Explore Ankith's portfolio of web applications, mobile apps, and software projects. Full-stack development projects built with React, Node.js, Python, and modern technologies."
        keywords="projects, portfolio, web applications, mobile apps, React projects, Node.js projects, full-stack development, software projects"
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
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Explore my portfolio of web applications, mobile apps, and other creative projects. 
            Each project represents a unique challenge and learning experience.
          </p>
          <div className="text-primary-600 dark:text-primary-400 font-medium">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects by name, description, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle Button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {(selectedCategory !== 'all' || selectedStatus !== 'all' || debouncedSearchTerm) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Filter Options */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showFilters ? 'auto' : 0, 
              opacity: showFilters ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
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
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;