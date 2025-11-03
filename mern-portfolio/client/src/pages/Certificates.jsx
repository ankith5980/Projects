import React, { useState } from 'react';
import { 
  FaSearch, 
  FaCertificate, 
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaAward,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { getFullUrl } from '../utils/url';

// Static certificates data
const certificates = [
  {
    _id: 1,
    title: 'Python Programming with Django',
    issuer: 'RISS Technologies',
    description: 'Demonstrates knowledge of how to build and deploy secure and robust web applications using Python and Django',
    issueDate: '2023-03-30',
    image: '/images/python_cert (1).jpg',
    skills: ['Python', 'Django', 'Web Development', 'Backend'],
    category: 'technical'
  },
  {
    _id: 2,
    title: 'Flutter and Dart Certified Developer Program',
    issuer: 'Maitexa Info Solutions LLP',
    description: 'Validates knowledge of developing applications using Flutter and Dart.',
    issueDate: '2024-03-31',
    image: '/images/flutter_cert (1).jpg',
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Cross-Platform'],
    category: 'technical'
  },
  {
    _id: 3,
    title: 'Figma UI/UX Design Mastery',
    issuer: 'TECHBYHEART',
    description: 'Comprehensive course covering Figma fundamentals, design systems, prototyping, and modern best practices.',
    issueDate: '2025-03-13',
    image: '/images/ui_ux_cert (1).jpg',
    skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems'],
    category: 'technical'
  }
];

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simple filter
  const filtered = certificates.filter(cert => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return cert.title.toLowerCase().includes(search) ||
           cert.issuer.toLowerCase().includes(search) ||
           cert.skills.some(s => s.toLowerCase().includes(search));
  });

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
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-4">
            My Certificates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            Professional certifications validating my skills and expertise in web development, mobile development, and UI/UX design
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {filtered.length} {filtered.length === 1 ? 'Certificate' : 'Certificates'} {searchTerm ? 'Found' : 'Total'}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert, index) => (
            <article
              key={cert._id}
              className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 certificate-card"
              style={{ animationDelay: `${index * 100}ms` }}
              itemScope
              itemType="https://schema.org/EducationalOccupationalCredential"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate from ${cert.issuer}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    itemProp="image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl" aria-label="Certificate placeholder">
                    <FaCertificate aria-hidden="true" />
                  </div>
                )}
                
                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <FaCheckCircle className="w-3 h-3" aria-hidden="true" />
                  <span>Valid</span>
                </div>

                {/* Category */}
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium capitalize" itemProp="credentialCategory">
                  {cert.category}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors" itemProp="name">
                  {cert.title}
                </h2>
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3" itemProp="recognizedBy" itemScope itemType="https://schema.org/Organization">
                  <FaAward className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  <span className="font-medium text-sm" itemProp="name">{cert.issuer}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2" itemProp="description">
                  {cert.description}
                </p>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <FaCalendarAlt className="w-3 h-3" aria-hidden="true" />
                  <time dateTime={cert.issueDate} itemProp="dateCreated">
                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </time>
                </div>
                
                {/* Skills */}
                {cert.skills && (
                  <div className="flex flex-wrap gap-2" itemProp="about">
                    {cert.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium">
                        +{cert.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        </section>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FaCertificate className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No certificates found
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;

