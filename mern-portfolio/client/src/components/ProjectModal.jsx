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
// Simpler animations for mobile: no scale transform (avoids repaints)
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: 30, transition: { duration: 0.15 } },
};

// ── Component ───────────────────────────────────────────────────
const ProjectModal = React.memo(({ project, isOpen, onClose }) => {
  // Lock body scroll — mobile-safe approach
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const originalOverflow = style.overflow;
    const originalPosition = style.position;
    const originalTop = style.top;
    const originalWidth = style.width;

    style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.width = '100%'; // prevents layout shift on mobile

    return () => {
      style.overflow = originalOverflow;
      style.position = originalPosition;
      style.top = originalTop;
      style.width = '';
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
          className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center sm:p-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details — ${project.title}`}
        >
          {/* ── Backdrop — no blur on mobile for performance ── */}
          <motion.div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 sm:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ── Panel ────────────────────────────────────────── */}
          <motion.div
            className="
              relative w-full sm:max-w-2xl
              max-h-[92vh] sm:max-h-[88vh]
              bg-white dark:bg-gray-900
              sm:bg-white/95 sm:dark:bg-gray-900/95
              sm:backdrop-blur-xl
              border-0 sm:border border-gray-200/60 dark:border-white/10
              rounded-t-2xl sm:rounded-2xl
              shadow-[0_-4px_30px_rgba(0,0,0,0.15)] sm:shadow-[0_8px_60px_rgba(59,130,246,0.15),0_2px_20px_rgba(0,0,0,0.08)]
              dark:shadow-[0_-4px_30px_rgba(0,0,0,0.4)] sm:dark:shadow-[0_8px_60px_rgba(99,102,241,0.2),0_2px_20px_rgba(0,0,0,0.3)]
              overflow-hidden flex flex-col
              text-gray-900 dark:text-gray-100
            "
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Drag handle (mobile only) ─────────────────── */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* ── Hero image ──────────────────────────────────── */}
            <div className="relative flex-shrink-0">
              <div className="aspect-[16/6] sm:aspect-[16/6] bg-gradient-to-br from-primary-400 to-purple-600 overflow-hidden">
                {project.images?.[0]?.url ? (
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-4xl sm:text-5xl">
                    <FaCode />
                  </div>
                )}
                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 sm:px-6 sm:pb-5">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white drop-shadow-md leading-snug">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full bg-black/30 sm:bg-white/20 sm:dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 text-white hover:bg-black/50 sm:hover:bg-white/40 sm:dark:hover:bg-black/50 transition-colors duration-200"
                aria-label="Close modal"
              >
                <FaTimes className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              {/* Status badge */}
              {project.status && (() => {
                const sc = getStatusConfig(project.status);
                const Icon = sc.icon;
                return (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm text-gray-800 dark:text-gray-200">
                    <Icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${sc.color}`} />
                    <span>{sc.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* ── Scrollable body ─────────────────────────────── */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-5 space-y-3 sm:space-y-4"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Meta grid — single column on mobile, 2 columns on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
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
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[13px] sm:text-[15px]">
                  {project.description}
                </p>
              </Section>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <Section title="Key Features">
                  <ul className="space-y-1.5">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-[13px] sm:text-[15px]">
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
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium rounded-md bg-gray-200/60 dark:bg-gray-700/50 border border-gray-300/40 dark:border-gray-600/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* ── Footer — CTA buttons ───────────────────────── */}
            <div className="flex-shrink-0 px-4 pb-4 sm:px-6 sm:pb-5">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-3 border-t border-gray-200/50 dark:border-gray-700/40">
                {/* Live Preview */}
                <a
                  href={project.liveUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { if (!project.liveUrl) e.preventDefault(); }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    project.liveUrl
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]'
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
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    project.githubUrl
                      ? 'bg-gray-200/80 dark:bg-gray-700/60 border border-gray-300/40 dark:border-gray-600/40 hover:bg-gray-300/80 dark:hover:bg-gray-600/60 active:scale-[0.98]'
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
  <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/40">
    <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${iconBg}`}>
      <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${iconColor}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold leading-none mb-0.5">
        {label}
      </p>
      <p className="text-[11px] sm:text-sm font-medium break-words text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
));

const Section = React.memo(({ title, children }) => (
  <div>
    <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 sm:mb-1.5">
      {title}
    </h3>
    {children}
  </div>
));

MetaCard.displayName = 'MetaCard';
Section.displayName = 'Section';
ProjectModal.displayName = 'ProjectModal';

export default ProjectModal;
