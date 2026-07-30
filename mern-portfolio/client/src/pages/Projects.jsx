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
import DisplayType from '../components/DisplayType';
import { getFullUrl } from '../utils/url';

// Memoized Project Card Component — image-only with an overlay that is always
// visible on touch and hover-revealed from `md` up.
const ProjectCard = memo(({ project, statusConfig, StatusIcon, itemVariants, onClick }) => (
  <motion.div
    variants={itemVariants}
    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-hairline transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-soft-lg"
    onClick={onClick}
  >
    {/* Full-bleed image */}
    {project.images?.[0]?.url ? (
      <img
        src={project.images[0].url}
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-110"
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-accent/20 text-5xl text-accent">
        <FaCode />
      </div>
    )}

    {/* Persistent badges — always visible */}
    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0A0A0A]/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
      <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
      <span>{statusConfig.label}</span>
    </div>
    <div className="absolute right-3 top-3 z-10 rounded-full border border-accent/40 bg-accent/25 px-2.5 py-1 text-[11px] font-medium capitalize text-white backdrop-blur-md">
      {project.category}
    </div>

    {/* Detail overlay */}
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/55 to-transparent p-5 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
      {/* Title */}
      <h3 className="mb-1.5 text-lg font-bold text-white drop-shadow-md transition-transform delay-75 duration-300 sm:text-xl md:translate-y-4 md:group-hover:translate-y-0">
        {project.title}
      </h3>

      {/* Tech tags */}
      <div className="mb-3 flex flex-wrap gap-1.5 transition-transform delay-100 duration-300 md:translate-y-4 md:group-hover:translate-y-0">
        {project.technologies.slice(0, 3).map((tech, i) => (
          <span
            key={i}
            className="rounded-md border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span className="rounded-md border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            +{project.technologies.length - 3} more
          </span>
        )}
      </div>

      {/* View Details button */}
      <div className="transition-transform delay-150 duration-300 md:translate-y-4 md:group-hover:translate-y-0">
        <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-soft">
          <FaExternalLinkAlt className="h-3 w-3" />
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
    category: 'Full-Stack',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-07-11',
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
  {
    _id: 9,
    title: 'Context-Aware Accessibility Linter',
    description: 'An AI-augmented developer tool designed to automatically detect and remediate accessibility errors by evaluating DOM context. Evolving from a real-time browser extension into an enterprise-grade CI/CD pipeline integration, this project aims to provide a comprehensive B2B SaaS solution for automated software accessibility compliance.',
    technologies: ['Node.js', 'Playwright', 'Browser Extension API', 'AI DOM Analysis', 'React', 'LLM API'],
    images: [{ url: '/images/CAAL.webp' }],
    liveUrl: '',
    githubUrl: 'https://github.com/ankith5980/Mini_Project/tree/main/DTP_CAAL',
    category: 'Full-Stack',
    status: 'in-progress',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-07-10',
    client: 'Self',
  },
  {
    _id: 10,
    title: 'LiveQ: An AI-Moderated Anonymous Live Q&A Platform',
    description: 'A modern, real-time, anonymous live Q&A platform featuring AI-powered moderation, and seamless cross-device accessibility. Designed for large-scale events, conferences, and hybrid meetups.',
    technologies: ['Next.js', 'TypeScript', 'Socket.IO', 'WebRTC', 'Multi-LLM API', 'SupaBase'],
    images: [{ url: '/images/LiveQ.webp' }],
    liveUrl: 'https://liveq.vercel.app/',
    githubUrl: 'https://github.com/ankith5980/QnA-App',
    category: 'Full-Stack',
    status: 'completed',
    featured: true,
    developers: ['Ankith Pratheesh Menon'],
    lastUpdated: '2026-07-11',
    client: 'St.Joseph\'s College(Autonomous), Devagiri',
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
      <div className="relative container mx-auto container-padding">
        {/* Giant watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
          <DisplayType solid="PROJECTS" align="center" className="opacity-70" speed={40} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-12 text-center"
        >
          <span className="eyebrow">Selected work</span>
          <h1 className="mb-5 mt-3 font-display text-4xl font-bold uppercase tracking-tight lg:text-6xl">
            My <span className="text-accent">Projects</span>
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-base text-muted sm:text-lg">
            Explore my portfolio of web applications, mobile apps, and other creative projects.
            Each project represents a unique challenge and learning experience.
          </p>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} {searchTerm ? 'Found' : 'Available'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="group relative z-10 mx-auto mb-12 max-w-xl animate-slideUp">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <FaSearch className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-accent" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="glass-violet w-full rounded-full py-3.5 pl-12 pr-5 text-fg outline-none transition-all duration-300 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
            aria-label="Search projects by title, description, technology, category, or status"
          />
        </div>

        {/* Projects Grid */}
        <section aria-label="Projects list" className="relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
                className="col-span-full py-16 text-center"
              >
                <FaCode className="mx-auto mb-4 h-16 w-16 text-accent/30" />
                <h3 className="mb-2 font-display text-xl font-semibold text-fg">
                  No projects found
                </h3>
                <p className="text-muted">
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