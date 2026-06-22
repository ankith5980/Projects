import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaCertificate,
  FaCalendarAlt,
  FaAward,
  FaLayerGroup,
  FaCheckCircle,
} from 'react-icons/fa';

// ── Animation variants ──────────────────────────────────────────
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
const CertificateModal = React.memo(({ cert, isOpen, onClose }) => {
  // Lock body scroll
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
    style.width = '100%';

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

  return createPortal(
    <AnimatePresence>
      {isOpen && cert && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-2 sm:p-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate details — ${cert.title}`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black sm:bg-black/50 dark:bg-black sm:dark:bg-black/70 sm:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="
              relative w-full sm:max-w-2xl
              max-h-[95vh] sm:max-h-[88vh]
              bg-white dark:bg-gray-900
              sm:bg-white/95 sm:dark:bg-gray-900/95
              sm:backdrop-blur-xl
              border-0 sm:border border-gray-200/60 dark:border-white/10
              rounded-2xl
              shadow-[0_4px_30px_rgba(0,0,0,0.2)] sm:shadow-[0_8px_60px_rgba(59,130,246,0.15),0_2px_20px_rgba(0,0,0,0.08)]
              dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:dark:shadow-[0_8px_60px_rgba(99,102,241,0.2),0_2px_20px_rgba(0,0,0,0.3)]
              overflow-hidden flex flex-col
              text-gray-900 dark:text-gray-100
            "
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero image */}
            <div className="relative flex-shrink-0">
              <div className="aspect-[16/9] sm:aspect-[16/7] bg-primary-600 overflow-hidden">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain bg-black/5"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-4xl sm:text-5xl">
                    <FaCertificate />
                  </div>
                )}
                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 sm:px-6 sm:pb-5">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white drop-shadow-md leading-snug">
                    {cert.title}
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
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm text-gray-800 dark:text-gray-200">
                <FaCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                <span>Valid Certificate</span>
              </div>
            </div>

            {/* Scrollable body */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 sm:py-5 space-y-3 sm:space-y-4"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {/* Issuer */}
                <MetaCard
                  icon={FaAward}
                  iconBg="bg-primary-100 dark:bg-primary-900/40"
                  iconColor="text-primary-600 dark:text-primary-400"
                  label="Issuer"
                  value={cert.issuer}
                />
                {/* Category */}
                {cert.category && (
                  <MetaCard
                    icon={FaLayerGroup}
                    iconBg="bg-purple-100 dark:bg-purple-900/40"
                    iconColor="text-purple-600 dark:text-purple-400"
                    label="Category"
                    value={cert.category}
                  />
                )}
                {/* Issue Date */}
                <MetaCard
                  icon={FaCalendarAlt}
                  iconBg="bg-green-100 dark:bg-green-900/40"
                  iconColor="text-green-600 dark:text-green-400"
                  label="Issue Date"
                  value={
                    cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })
                      : 'N/A'
                  }
                />
              </div>

              {/* Description */}
              <Section title="Description">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[13px] sm:text-[15px]">
                  {cert.description}
                </p>
              </Section>

              {/* Skills */}
              {cert.skills?.length > 0 && (
               <Section title="Skills">
                 <div className="flex flex-wrap gap-1.5 sm:gap-2">
                   {cert.skills.map((skill, i) => (
                     <span
                       key={i}
                       className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium rounded-md bg-gray-200/60 dark:bg-gray-700/50 border border-gray-300/40 dark:border-gray-600/40"
                     >
                       {skill}
                     </span>
                   ))}
                 </div>
               </Section>
              )}
            </div>
            
            {/* CTA/Footer (Optional for future external links like "Verify Certificate") */}
            {/* <div className="flex-shrink-0 px-4 pb-4 sm:px-6 sm:pb-5 pt-3 border-t border-gray-200/50 dark:border-gray-700/40">
                <button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium">
                  Close
                </button>
            </div> */}
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
      <p className="text-[11px] sm:text-sm font-medium break-words text-gray-900 dark:text-gray-100 capitalize">{value}</p>
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
CertificateModal.displayName = 'CertificateModal';

export default CertificateModal;
