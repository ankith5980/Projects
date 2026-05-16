import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaExternalLinkAlt,
  FaGithub,
  FaCode,
  FaCalendarAlt,
  FaUser,
  FaLayerGroup,
  FaCheckCircle,
  FaClock,
  FaArchive,
  FaSync,
  FaStar,
} from 'react-icons/fa';

// Status config — matches the project cards
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

// ── Animation variants ──────────────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 340, mass: 0.8 },
  },
  exit: { opacity: 0, scale: 0.95, y: 24, transition: { duration: 0.18 } },
};

// ── Component ───────────────────────────────────────────────────
const ProjectModal = React.memo(({ project, isOpen, onClose }) => {
  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Click backdrop
  const onBackdrop = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose],
  );

  // ── Render via portal so the modal escapes all stacking contexts ──
  return createPortal(
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details — ${project.title}`}
        >
          {/* ── Backdrop ─────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ── Panel ────────────────────────────────────────── */}
          <motion.div
            className="
              relative w-full max-w-2xl max-h-[88vh]
              bg-white/95 dark:bg-gray-900/95
              backdrop-blur-2xl
              border border-gray-200/60 dark:border-white/10
              rounded-2xl
              shadow-[0_8px_60px_rgba(59,130,246,0.15),0_2px_20px_rgba(0,0,0,0.08)]
              dark:shadow-[0_8px_60px_rgba(99,102,241,0.2),0_2px_20px_rgba(0,0,0,0.3)]
              overflow-hidden flex flex-col
              text-gray-900 dark:text-gray-100
            "
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Hero image ──────────────────────────────────── */}
            <div className="relative flex-shrink-0">
              <div className="aspect-[16/5] sm:aspect-[16/6] bg-gradient-to-br from-primary-400 to-purple-600 overflow-hidden">
                {project.images?.[0]?.url ? (
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-5xl">
                    <FaCode />
                  </div>
                )}
                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 sm:px-6 sm:pb-5">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md leading-snug">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/10 text-white hover:bg-white/40 dark:hover:bg-black/50 transition-colors duration-200"
                aria-label="Close modal"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>

              {/* Status badge */}
              {project.status && (() => {
                const sc = getStatusConfig(project.status);
                const Icon = sc.icon;
                return (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm text-gray-800 dark:text-gray-200">
                    <Icon className={`w-3 h-3 ${sc.color}`} />
                    <span>{sc.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* ── Scrollable body ─────────────────────────────── */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5 space-y-4"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Category */}
                {project.category && (
                  <MetaCard
                    icon={FaLayerGroup}
                    iconBg="bg-primary-100 dark:bg-primary-900/40"
                    iconColor="text-primary-600 dark:text-primary-400"
                    label="Category"
                    value={project.category}
                  />
                )}
                {/* Client */}
                <MetaCard
                  icon={FaUser}
                  iconBg="bg-purple-100 dark:bg-purple-900/40"
                  iconColor="text-purple-600 dark:text-purple-400"
                  label="Client"
                  value={project.client || 'Personal Project'}
                />
                {/* Last Update */}
                <MetaCard
                  icon={FaCalendarAlt}
                  iconBg="bg-green-100 dark:bg-green-900/40"
                  iconColor="text-green-600 dark:text-green-400"
                  label="Last Update"
                  value={
                    project.lastUpdated
                      ? new Date(project.lastUpdated).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                      : 'N/A'
                  }
                />
                {/* Developers */}
                <MetaCard
                  icon={FaCode}
                  iconBg="bg-orange-100 dark:bg-orange-900/40"
                  iconColor="text-orange-600 dark:text-orange-400"
                  label="Developer(s)"
                  value={
                    project.developers
                      ? Array.isArray(project.developers) ? project.developers.join(', ') : project.developers
                      : 'Ankith Pratheesh Menon'
                  }
                />
              </div>

              {/* Description */}
              <Section title="Project Description">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-[15px]">
                  {project.description}
                </p>
              </Section>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <Section title="Key Features">
                  <ul className="space-y-1.5">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm sm:text-[15px]">
                        <FaStar className="w-3 h-3 mt-1 text-primary-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Technologies */}
              {project.technologies?.length > 0 && (
                <Section title="Technologies">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-200/60 dark:bg-gray-700/50 border border-gray-300/40 dark:border-gray-600/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* ── Footer — CTA buttons ───────────────────────── */}
            <div className="flex-shrink-0 px-5 pb-4 sm:px-6 sm:pb-5">
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-gray-200/50 dark:border-gray-700/40">
                {/* Live Preview */}
                <a
                  href={project.liveUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!project.liveUrl) e.preventDefault(); }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    project.liveUrl
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-200/60 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </a>

                {/* View on GitHub */}
                <a
                  href={project.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!project.githubUrl) e.preventDefault(); }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    project.githubUrl
                      ? 'bg-gray-200/80 dark:bg-gray-700/60 border border-gray-300/40 dark:border-gray-600/40 hover:bg-gray-300/80 dark:hover:bg-gray-600/60 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-200/60 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaGithub className="w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
});

// ── Helper sub-components ─────────────────────────────────────────
const MetaCard = React.memo(({ icon: Icon, iconBg, iconColor, label, value }) => (
  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/40">
    <div className={`p-1.5 rounded-lg ${iconBg}`}>
      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold leading-none mb-0.5">
        {label}
      </p>
      <p className="text-xs sm:text-sm font-medium break-words capitalize text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
));

const Section = React.memo(({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
      {title}
    </h3>
    {children}
  </div>
));

MetaCard.displayName = 'MetaCard';
Section.displayName = 'Section';
ProjectModal.displayName = 'ProjectModal';

export default ProjectModal;
