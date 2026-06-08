import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import ProjectModal from './ProjectModal';

const ProjectsSection = React.memo(({ featuredProjects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  if (!featuredProjects || featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="text-primary-600 dark:text-primary-400">Projects</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Some of my recent work
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
              onClick={() => setSelectedProject(project)}
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

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 drop-shadow-md">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 backdrop-blur-sm text-white/90 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-colors duration-200">
                    <FaExternalLinkAlt className="w-3 h-3" />
                    View Details
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 bg-primary-100/80 dark:bg-primary-900/30 border border-primary-600/40 hover:bg-primary-200/80 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            <span>View All Projects</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
      />
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;