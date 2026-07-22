import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCode, FaExternalLinkAlt } from 'react-icons/fa';
import ProjectModal from './ProjectModal';
import Reveal, { RevealGroup, RevealItem } from './Reveal';
import DisplayType from './DisplayType';

const ProjectsSection = React.memo(({ featuredProjects }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  if (!featuredProjects || featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="section-padding relative overflow-hidden">
      <DisplayType solid="WORK" align="right" className="opacity-70" speed={45} slideIn={false} />

      <div className="container relative z-10 mx-auto container-padding">
        <Reveal className="mb-14 text-center">
          <span className="eyebrow">Selected work</span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">
            Featured <span className="text-accent">Projects</span>
          </h2>
          <p className="mt-3 text-base text-muted">Some of my recent work</p>
        </Reveal>

        <RevealGroup stagger={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <RevealItem
              key={project._id}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-hairline transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-glow-lg"
              onClick={() => setSelectedProject(project)}
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

              {/*
                Overlay: permanently visible on touch (there is no hover to
                trigger it), fades in on hover from `md` up.
              */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/55 to-transparent p-5 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
                <h3 className="relative mb-1.5 text-lg font-bold text-white drop-shadow-md transition-transform duration-300 sm:text-xl md:translate-y-4 md:group-hover:translate-y-0">
                  {project.title}
                </h3>

                <div className="relative mb-3 flex flex-wrap gap-1.5 transition-transform delay-75 duration-300 md:translate-y-4 md:group-hover:translate-y-0">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="relative transition-transform delay-100 duration-300 md:translate-y-4 md:group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow">
                    <FaExternalLinkAlt className="h-3 w-3" />
                    View Details
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-accent/50 px-6 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:scale-105 hover:bg-accent/10"
          >
            <span>View All Projects</span>
            <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
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
