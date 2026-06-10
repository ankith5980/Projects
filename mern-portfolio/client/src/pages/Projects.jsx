import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaCode, 
  FaExternalLinkAlt, 
  FaCheckCircle,
  FaClock,
  FaArchive,
  FaSync
} from 'react-icons/fa';
import SEO from '../components/SEO';
import ProjectModal from '../components/ProjectModal';
import { getFullUrl } from '../utils/url';

// Memoized Project Card Component — image-only with hover overlay
const ProjectCard = memo(({ project, statusConfig, StatusIcon, itemVariants, onClick }) => (
  <motion.div
    variants={itemVariants}
    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
    onClick={onClick}
  >
    {/* Full-bleed image */}
    {project.images?.[0]?.url ? (
      <img
        src={project.images[0].url}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
      />
    ) : (
      <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white/60 text-5xl">
        <FaCode />
      </div>
    )}

    {/* Persistent badges — always visible */}
    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm z-10">
      <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
      <span>{statusConfig.label}</span>
    </div>
    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white backdrop-blur-sm capitalize z-10">
      {project.category}
    </div>

    {/* Hover overlay — slides up from bottom */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
      {/* Title */}
      <h3 className="text-white text-lg sm:text-xl font-bold mb-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 drop-shadow-md">
        {project.title}
      </h3>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
        {project.technologies.slice(0, 3).map((tech, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 backdrop-blur-sm text-white/90 border border-white/10"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 backdrop-blur-sm text-white/90 border border-white/10">
            +{project.technologies.length - 3} more
          </span>
        )}
      </div>

      {/* View Details button */}
      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-colors duration-200">
          <FaExternalLinkAlt className="w-3 h-3" />
          View Details
        </span>
      </div>
    </div>
  </motion.div>
));

ProjectCard.displayName = 'ProjectCard';

// Projects data
const projectsData = [
  {
    _id: 1,
    title: 'Personal Portfolio Website',
    description: 'A modern, responsive portfolio website built with the MERN stack featuring dark mode, animations, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion'],
    images: [{ url: '/images/PORTFOLIO.webp' }],
    liveUrl: 'https://portfolio-ankith.vercel.app',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/mern-portfolio',
    category: 'FullStack',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-05-16',
    client: 'Self',
  },
  {
    _id: 2,
    title: 'Enhancement of KOHA Library Management System',
    description: 'Enhancement of KOHA Library Management System, an open-source integrated library system. This project aims to improve the functionality and user experience of the system.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
    images: [{ url: '/images/KOHA.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/label',
    category: 'Backend',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2025-10-14',
    client: 'St. Joseph\'s College, Devagiri',
  },
  {
    _id: 3,
    title: 'Club Management System - Rotary Club of Calicut South',
    description: 'A comprehensive club management system designed to streamline operations, member management, and event planning and membership payment for the Rotary Club of Calicut South.',
    technologies: ['React', 'MongoDB Atlas', 'Tailwind CSS','Docker'],
    images: [{ url: '/images/CLUBMANAGEMENTSYSTEM.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/rotary-club-portal',
    category: 'Full-Stack',
    status: 'archived',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2025-11-14',
    client: 'Rotary Club of Calicut South',
  },
  {
    _id: 4,
    title: 'ICCIET 2025 Judging Portal',
    description: 'A judging portal for the International Conference on Computational Intelligence & Emerging Technologies (ICCIET) 2025, enabling judges to securely evaluate and score project submissions online.',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript'],
    images: [{ url: '/images/JUDGINGPORTAL.webp' }],
    liveUrl: 'https://icciet-judging.vercel.app/',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/iccet-judging',
    category: 'Full-Stack',
    status: 'completed',
    featured: true,
    developers: ['Ayush VP', 'Ankith Pratheesh Menon'],
    lastUpdated: '2025-11-29',
    client: 'St. Joseph\'s College, Devagiri',
  },
  {
    _id: 5,
    title: 'Skill-Swap : A Skill Exchange Platform',
    description: 'A production-ready full-stack web application for peer-to-peer skill exchange. Users can teach skills to earn points and spend points to learn from others.',
    technologies: ['TypeScript', 'MongoDB', 'Socket.io', 'Express.js'],
    images: [{ url: '/images/SKILL-SWAP.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/skill-exchange',
    category: 'Full-Stack',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon, Devananda J'],
    lastUpdated: '2026-04-02',
    client: 'Community',
  },
  {
    _id: 6,
    title: 'AI Multi-Agent Research System',
    description: 'A fully local, decoupled AI system where multiple agents collaborate using a graph-based state machine to autonomously research topics, analyze data via vector stores, and generate comprehensive reports.',
    technologies: ['Next.js', 'Python', 'LangGraph', 'FAISS', 'FastAPI'],
    images: [{ url: '/images/MULTI-AGENTRESEARCH.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/multi-agent-research-system',
    category: 'Artificial Intelligence',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-04-16',
    client: 'Self',
  },
  {
    _id: 7,
    title: 'NEXUS AI Fraud Vanguard',
    description: 'An AI-powered fraud detection system that leverages advanced machine learning algorithms and real-time data analysis to identify and detect fraudulent activities across various transactional domains.',
    technologies: ['Docker', 'Scikit-learn', 'Kafka', 'Redis', 'FastAPI'],
    images: [{ url: '/images/NEXUS-AI.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-fraud-detection',
    category: 'Machine Learning',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-04-19',
    client: 'Self',
  },
  {
    _id: 8,
    title: 'Automated AI Data Analyst',
    description: 'An AI-powered data analysis and visualization tool that enables users to upload datasets, perform exploratory data analysis, and generate insightful visualizations and reports using natural language queries.',
    technologies: ['Python', 'Next.js', 'Ollama', 'FastAPI', 'LangGraph'],
    images: [{ url: '/images/AIDATAANALYST.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-data-analysis-system',
    category: 'Data Analysis',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-04-20',
    client: 'Self',
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
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projectsData;
    const search = searchTerm.toLowerCase();
    return projectsData.filter(project =>
      project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      project.technologies.some(tech => tech.toLowerCase().includes(search)) ||
      project.category.toLowerCase().includes(search) ||
      project.status.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

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
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-5">My Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            Explore my portfolio of web applications, mobile apps, and other creative projects. 
            Each project represents a unique challenge and learning experience.
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} {searchTerm ? 'Found' : 'Available'}
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
                    onClick={() => setSelectedProject(project)}
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

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Projects;