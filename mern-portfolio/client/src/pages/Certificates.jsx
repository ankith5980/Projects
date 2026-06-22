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
    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
    onClick={onClick}
    itemScope
    itemType="https://schema.org/EducationalOccupationalCredential"
  >
    {/* Full-bleed image */}
    {cert.coverImage ? (
      <img
        src={cert.coverImage}
        alt={`${cert.title} cover`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        decoding="async"
        width="640"
        height="480"
        itemProp="image"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white/30 text-8xl transition-transform duration-500 group-hover:scale-110" aria-label="Certificate placeholder">
        <FaCertificate aria-hidden="true" />
      </div>
    )}

    {/* Persistent badges — always visible */}
    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm z-10">
      <FaCheckCircle className="w-3 h-3 text-green-500" aria-hidden="true" />
      <span>Valid</span>
    </div>
    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white backdrop-blur-sm capitalize z-10" itemProp="credentialCategory">
      {cert.category}
    </div>

    {/* Hover overlay — slides up from bottom */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
      {/* Title */}
      <h3 className="text-white text-lg sm:text-xl font-bold mb-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 drop-shadow-md" itemProp="name">
        {cert.title}
      </h3>

      {/* Skills tags */}
      {cert.skills && (
        <div className="flex flex-wrap gap-1.5 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100" itemProp="about">
          {cert.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 backdrop-blur-sm text-white/90 border border-white/10"
            >
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 backdrop-blur-sm text-white/90 border border-white/10">
              +{cert.skills.length - 3} more
            </span>
          )}
        </div>
      )}

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
            "name": "Ankith",
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
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            My Certificates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            Professional certifications validating my skills and expertise in web development, mobile development, and UI/UX design
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {filtered.length} {filtered.length === 1 ? 'Certificate' : 'Certifications'} {searchTerm ? 'Found' : 'Acquired'}
          </p>
        </header>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12 animate-slideUp group">
          <label htmlFor="certificate-search" className="sr-only">Search certificates</label>
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" aria-hidden="true" />
          <input
            id="certificate-search"
            type="search"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-300"
            aria-label="Search certificates by title, issuer, or skills"
          />
        </div>

        {/* Grid */}
        <section aria-label="Certificates list">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                className="col-span-full text-center py-12"
              >
                <FaCertificate className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  No certificates found
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
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

