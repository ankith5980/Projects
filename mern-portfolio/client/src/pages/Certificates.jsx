import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaCertificate, 
  FaCalendarAlt,
  FaAward,
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import SEO from '../components/SEO';
import CertificateModal from '../components/CertificateModal';
import DisplayType from '../components/DisplayType';
import { getFullUrl } from '../utils/url';

// Static certificates data
const certificates = [
  {
    _id: 1,
    title: 'Python Programming with Django',
    issuer: 'RISS Technologies',
    description: 'Demonstrates knowledge of how to build and deploy secure and robust web applications using Python and Django',
    issueDate: '2023-03-30',
    coverImage: '/images/Cert_Cover_1.webp',
    image: '/images/python_cert (1).jpg',
    skills: ['Python', 'Django', 'Web Development', 'Backend'],
    category: 'Web Development'
  },
  {
    _id: 2,
    title: 'Flutter and Dart Certified Developer Program',
    issuer: 'Maitexa Info Solutions LLP',
    description: 'Validates knowledge of developing applications using Flutter and Dart.',
    issueDate: '2024-03-31',
    coverImage: '/images/Cert_Cover_2.webp',
    image: '/images/flutter_cert (1).jpg',
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Cross-Platform'],
    category: 'Mobile App Development'
  },
  {
    _id: 3,
    title: 'Figma UI/UX Design Mastery',
    issuer: 'TECHBYHEART',
    description: 'Comprehensive course covering Figma fundamentals, design systems, prototyping, and modern best practices.',
    issueDate: '2025-03-13',
    coverImage: '/images/Cert_Cover_3.webp',
    image: '/images/ui_ux_cert (1).jpg',
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems'],
    category: 'UI/UX Design'
  },
  {
    _id: 4,
    title: 'Python for Data Science and Machine Learning',
    issuer: 'Maitexa Info Solutions LLP',
    description: 'Comprehensive course covering Python fundamentals, data analysis, and machine learning techniques.',
    issueDate: '2026-03-31',
    coverImage: '/images/Cert_Cover_4.webp',
    image: '/images/python_data_science_cert (1).jpeg',
    skills: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy', 'Power BI', 'TensorFlow', 'Scikit-Learn'],
    category: 'Data Science'
  }
];

// Memoized Certificate Card Component for better performance
const CertificateCard = memo(({ cert, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-hairline transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-soft-lg"
    onClick={onClick}
    itemScope
    itemType="https://schema.org/EducationalOccupationalCredential"
  >
    {/* Full-bleed image */}
    {cert.coverImage ? (
      <img
        src={cert.coverImage}
        alt={`${cert.title} cover`}
        className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-110"
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
        itemProp="image"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-accent-700 text-8xl text-white/30 transition-transform duration-500 md:group-hover:scale-110" aria-label="Certificate placeholder">
        <FaCertificate aria-hidden="true" />
      </div>
    )}

    {/* Persistent badges — always visible */}
    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0A0A0A]/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
      <FaCheckCircle className="h-3 w-3 text-green-500" aria-hidden="true" />
      <span>Valid</span>
    </div>
    <div className="absolute right-3 top-3 z-10 rounded-full border border-accent/40 bg-accent/25 px-2.5 py-1 text-[11px] font-medium capitalize text-white backdrop-blur-md" itemProp="credentialCategory">
      {cert.category}
    </div>

    {/* Detail overlay — always visible on touch, hover-revealed from md up */}
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/55 to-transparent p-5 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
      {/* Title */}
      <h3 className="mb-1.5 text-lg font-bold text-white drop-shadow-md transition-transform delay-75 duration-300 sm:text-xl md:translate-y-4 md:group-hover:translate-y-0" itemProp="name">
        {cert.title}
      </h3>

      {/* Skills tags */}
      {cert.skills && (
        <div className="mb-3 flex flex-wrap gap-1.5 transition-transform delay-100 duration-300 md:translate-y-4 md:group-hover:translate-y-0" itemProp="about">
          {cert.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="rounded-md border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="rounded-md border border-white/15 bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
              +{cert.skills.length - 3} more
            </span>
          )}
        </div>
      )}

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

CertificateCard.displayName = 'CertificateCard';

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

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const handleCloseModal = useCallback(() => setSelectedCertificate(null), []);

  // Memoized filter to prevent unnecessary recalculations
  const filtered = useMemo(() => {
    if (!searchTerm) return certificates;
    const search = searchTerm.toLowerCase();
    return certificates.filter(cert =>
      cert.title.toLowerCase().includes(search) ||
      cert.issuer.toLowerCase().includes(search) ||
      cert.skills.some(s => s.toLowerCase().includes(search))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 animate-fadeIn">
      <SEO 
        title="Certificates - Professional Certifications & Credentials"
        description="View Ankith's professional certifications in Python, Django, Flutter, Dart, and UI/UX Design. Verified credentials from RISS Technologies, Maitexa Info Solutions, and TECHBYHEART demonstrating expertise in web development, mobile development, and design."
        keywords="certifications, professional certificates, Python certification, Django certification, Flutter certification, Dart certification, UI/UX certification, Figma certification, web development certificates, mobile development credentials, programming certifications, software development certificates"
        url="/certificates"
        breadcrumbName="Certificates"
        type="website"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Professional Certificates - Ankith's Portfolio",
          "description": "Collection of professional certifications and credentials earned by Ankith in web development, mobile development, and UI/UX design",
          "url": getFullUrl("/certificates"),
          "inLanguage": "en-US",
          "author": {
            "@type": "Person",
            "@id": getFullUrl("/#person"),
            "name": "Ankith Pratheesh Menon",
            "url": getFullUrl("/")
          },
          "mainEntity": {
            "@type": "ItemList",
            "name": "Certifications",
            "description": "Professional certifications and credentials",
            "numberOfItems": filtered.length,
            "itemListElement": filtered.map((cert, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "EducationalOccupationalCredential",
                "name": cert.title,
                "description": cert.description,
                "credentialCategory": "certificate",
                "about": cert.skills.join(", "),
                "recognizedBy": {
                  "@type": "Organization",
                  "name": cert.issuer
                },
                "dateCreated": cert.issueDate
              }
            }))
          }
        }}
      />
      
      <div className="relative mx-auto max-w-7xl">
        {/* Giant watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
          <DisplayType solid="CERTIFIED" align="center" className="opacity-70" speed={40} />
        </div>

        {/* Header */}
        <header className="relative z-10 mb-12 animate-slideDown text-center">
          <span className="eyebrow">Credentials</span>
          <h1 className="mb-4 mt-3 font-display text-4xl font-bold uppercase tracking-tight lg:text-6xl">
            My <span className="text-accent">Certificates</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-base text-muted sm:text-lg">
            Professional certifications validating my skills and expertise in web development, mobile development, and UI/UX design
          </p>
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent">
            {filtered.length} {filtered.length === 1 ? 'Certificate' : 'Certifications'} {searchTerm ? 'Found' : 'Acquired'}
          </p>
        </header>

        {/* Search */}
        <div className="group relative z-10 mx-auto mb-12 max-w-xl animate-slideUp">
          <label htmlFor="certificate-search" className="sr-only">Search certificates</label>
          <FaSearch className="absolute left-5 top-1/2 z-10 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-accent" aria-hidden="true" />
          <input
            id="certificate-search"
            type="search"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="glass-violet w-full rounded-full py-3.5 pl-12 pr-5 text-fg outline-none transition-all duration-300 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
            aria-label="Search certificates by title, issuer, or skills"
          />
        </div>

        {/* Grid */}
        <section aria-label="Certificates list" className="relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.length > 0 ? (
              filtered.map((cert, index) => (
                <CertificateCard 
                  key={cert._id} 
                  cert={cert} 
                  index={index} 
                  onClick={() => setSelectedCertificate(cert)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center"
              >
                <FaCertificate className="mx-auto mb-4 h-16 w-16 text-accent/30" />
                <h3 className="mb-2 font-display text-xl font-semibold text-fg">
                  No certificates found
                </h3>
                <p className="text-muted">
                  Try a different search term
                </p>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>

      {/* Certificate Detail Modal */}
      <CertificateModal
        cert={selectedCertificate}
        isOpen={!!selectedCertificate}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Certificates;

