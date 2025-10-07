import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaCode, 
  FaExternalLinkAlt, 
  FaGithub,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaArchive,
  FaTimes
} from 'react-icons/fa';
import apiService from '../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'archived', label: 'Archived' }
  ];

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProjects();
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.technologies.some(tech => 
                             tech.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus && project.isVisible !== false;
    });
  }, [projects, searchTerm, selectedCategory, selectedStatus]);

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { icon: FaCheckCircle, color: 'text-green-500', label: 'Completed' };
      case 'in-progress':
        return { icon: FaClock, color: 'text-yellow-500', label: 'In Progress' };
      case 'archived':
        return { icon: FaArchive, color: 'text-gray-500', label: 'Archived' };
      default:
        return { icon: FaCheckCircle, color: 'text-green-500', label: 'Completed' };
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen section-padding pt-32">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-4">My Projects</h1>
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

            {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
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
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center space-x-1"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>
                        
                        <div className="flex items-center space-x-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                              title="View on GitHub"
                            >
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                              title="View Live Demo"
                            >
                              <FaExternalLinkAlt className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
        )}
      </div>
    </div>
  );
};

export default Projects;