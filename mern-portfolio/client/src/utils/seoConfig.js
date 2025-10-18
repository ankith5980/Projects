// Advanced SEO Configuration and Utilities
// This file contains helper functions and configurations for maximum SEO optimization

import { siteMetadata } from './personalSEO';

/**
 * Generate dynamic meta tags for name-based searches
 * Optimized for "Ankith Pratheesh Menon" searches
 */
export const generateNameSearchMeta = () => {
  return {
    // Primary name variations
    'personal-name': 'Ankith Pratheesh Menon',
    'personal-alternate-names': 'Ankith, Ankith Menon, Ankith Pratheesh',
    
    // Professional information
    'personal-profession': 'Full Stack Developer, Software Engineer',
    'personal-specialization': 'React.js, Node.js, MERN Stack, Full Stack Development',
    
    // Location information
    'personal-location': `${siteMetadata.location.city}, ${siteMetadata.location.state}, ${siteMetadata.location.country}`,
    'geo.region': 'IN-KL',
    'geo.placename': `${siteMetadata.location.city}, ${siteMetadata.location.state}`,
    'geo.position': `${siteMetadata.location.coordinates.latitude};${siteMetadata.location.coordinates.longitude}`,
    'ICBM': `${siteMetadata.location.coordinates.latitude}, ${siteMetadata.location.coordinates.longitude}`,
    
    // Contact information
    'personal-email': siteMetadata.social.email,
    'personal-phone': siteMetadata.social.phone,
    
    // Social media
    'personal-github': siteMetadata.social.github,
    'personal-linkedin': siteMetadata.social.linkedin,
    'personal-instagram': siteMetadata.social.instagram,
  };
};

/**
 * Generate BreadcrumbList schema for better navigation SEO
 */
export const generateBreadcrumbSchema = (pathSegments) => {
  const baseUrl = siteMetadata.siteUrl;
  
  const itemListElement = pathSegments.map((segment, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": segment.name,
    "item": `${baseUrl}${segment.path}`
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
};

/**
 * Generate optimized keywords based on page type
 */
export const generatePageKeywords = (pageType, additionalKeywords = []) => {
  const baseKeywords = [
    'Ankith Pratheesh Menon',
    'Ankith Menon',
    'Ankith Pratheesh',
    'Ankith',
    'Full Stack Developer',
    'Web Developer',
    'Software Engineer'
  ];

  const pageSpecificKeywords = {
    home: [
      'Ankith Pratheesh Menon Portfolio',
      'Ankith Developer Portfolio',
      'React Developer Kozhikode',
      'Node.js Developer Kerala',
      'Full Stack Developer India'
    ],
    about: [
      'About Ankith Pratheesh Menon',
      'Ankith Biography',
      'Ankith Background',
      'Ankith Education',
      'Ankith Experience',
      'Ankith Skills'
    ],
    projects: [
      'Ankith Projects',
      'Ankith Portfolio Projects',
      'Ankith Web Applications',
      'Ankith Development Work',
      'Ankith Software Projects'
    ],
    contact: [
      'Contact Ankith Pratheesh Menon',
      'Hire Ankith',
      'Ankith Email',
      'Ankith Phone',
      'Get in touch with Ankith'
    ]
  };

  return [
    ...baseKeywords,
    ...(pageSpecificKeywords[pageType] || []),
    ...additionalKeywords
  ].join(', ');
};

/**
 * Generate Open Graph tags for social media optimization
 */
export const generateOGTags = (page) => {
  const baseUrl = siteMetadata.siteUrl;
  
  return {
    'og:site_name': 'Ankith Pratheesh Menon Portfolio',
    'og:type': page.type || 'website',
    'og:url': `${baseUrl}${page.url}`,
    'og:title': page.title || 'Ankith Pratheesh Menon - Full Stack Developer',
    'og:description': page.description || siteMetadata.description,
    'og:image': page.image || `${baseUrl}/images/Ankith.jpg`,
    'og:image:alt': 'Ankith Pratheesh Menon - Full Stack Developer',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': 'en_US',
    'profile:first_name': 'Ankith Pratheesh',
    'profile:last_name': 'Menon',
    'profile:username': 'ankith5980'
  };
};

/**
 * Generate Twitter Card tags
 */
export const generateTwitterTags = (page) => {
  const baseUrl = siteMetadata.siteUrl;
  
  return {
    'twitter:card': 'summary_large_image',
    'twitter:site': '@ankith_dev',
    'twitter:creator': '@ankith_dev',
    'twitter:title': page.title || 'Ankith Pratheesh Menon - Full Stack Developer',
    'twitter:description': page.description || siteMetadata.description,
    'twitter:image': page.image || `${baseUrl}/images/Ankith.jpg`,
    'twitter:image:alt': 'Ankith Pratheesh Menon - Professional Full Stack Developer'
  };
};

/**
 * Generate WebSite schema with SiteNavigationElement
 */
export const generateWebSiteSchema = () => {
  const baseUrl = siteMetadata.siteUrl;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ankith Pratheesh Menon Portfolio",
    "alternateName": ["Ankith.dev", "Ankith Portfolio"],
    "url": baseUrl,
    "description": siteMetadata.description,
    "author": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/projects?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon",
      "email": siteMetadata.social.email
    }
  };
};

/**
 * Generate ProfilePage schema for About page
 */
export const generateProfilePageSchema = () => {
  const baseUrl = siteMetadata.siteUrl;
  
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "About Ankith Pratheesh Menon",
    "url": `${baseUrl}/about`,
    "description": "Professional profile and background of Ankith Pratheesh Menon, Full Stack Developer",
    "mainEntity": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon",
      "alternateName": ["Ankith", "Ankith Menon", "Ankith Pratheesh"],
      "jobTitle": "Full Stack Developer",
      "email": siteMetadata.social.email,
      "telephone": siteMetadata.social.phone,
      "url": baseUrl
    }
  };
};

/**
 * Validate and optimize page title for SEO
 * Ensures "Ankith Pratheesh Menon" appears in every page title
 */
export const optimizePageTitle = (pageTitle, includeNameSuffix = true) => {
  const maxLength = 60; // Google's recommended title length
  const nameSuffix = ' | Ankith Pratheesh Menon';
  
  if (includeNameSuffix && !pageTitle.includes('Ankith')) {
    const fullTitle = `${pageTitle}${nameSuffix}`;
    return fullTitle.length > maxLength 
      ? `${pageTitle.substring(0, maxLength - nameSuffix.length)}${nameSuffix}`
      : fullTitle;
  }
  
  return pageTitle.length > maxLength 
    ? `${pageTitle.substring(0, maxLength - 3)}...` 
    : pageTitle;
};

/**
 * Generate optimized meta description
 * Ensures "Ankith Pratheesh Menon" is mentioned in the description
 */
export const optimizeMetaDescription = (description) => {
  const maxLength = 160; // Google's recommended description length
  const name = 'Ankith Pratheesh Menon';
  
  if (!description.includes('Ankith')) {
    const withName = `${description} - ${name}`;
    return withName.length > maxLength 
      ? description.substring(0, maxLength - 3) + '...'
      : withName;
  }
  
  return description.length > maxLength 
    ? description.substring(0, maxLength - 3) + '...'
    : description;
};

/**
 * Generate CollectionPage schema for Projects page
 */
export const generateCollectionPageSchema = (projects = []) => {
  const baseUrl = siteMetadata.siteUrl;
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Ankith Pratheesh Menon - Projects Portfolio",
    "description": "Portfolio of web applications and software projects developed by Ankith Pratheesh Menon",
    "url": `${baseUrl}/projects`,
    "author": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon"
    },
    "numberOfItems": projects.length,
    "about": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon",
      "jobTitle": "Full Stack Developer"
    }
  };
};

export default {
  siteMetadata,
  generateNameSearchMeta,
  generateBreadcrumbSchema,
  generatePageKeywords,
  generateOGTags,
  generateTwitterTags,
  generateWebSiteSchema,
  generateProfilePageSchema,
  optimizePageTitle,
  optimizeMetaDescription,
  generateCollectionPageSchema
};
