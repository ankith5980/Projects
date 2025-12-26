// Enhanced SEO utilities for personal branding and Google Knowledge Graph
import { getBaseUrl, getFullUrl, getFullImageUrl } from './url';

// Site metadata configuration for consistent SEO
export const siteMetadata = {
  siteName: 'Ankith Pratheesh Menon - Full Stack Developer Portfolio',
  siteUrl: 'https://portfolio-ankith.vercel.app', // Update with your actual domain
  author: 'Ankith Pratheesh Menon',
  description: 'Portfolio of Ankith Pratheesh Menon - Full Stack Developer specializing in React, Node.js, MongoDB, and modern web technologies. Explore projects, skills, and professional experience.',
  keywords: [
    'Ankith Pratheesh Menon',
    'Ankith Menon',
    'Ankith Pratheesh',
    'Ankith',
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Web Developer Kozhikode',
    'JavaScript Developer',
    'MERN Stack Developer',
    'Software Engineer Kerala',
    'Portfolio Ankith',
    'Ankith Developer Kerala',
    'Frontend Developer India',
    'Backend Developer India',
    'Ankith Pratheesh Menon Portfolio',
    'Ankith Full Stack',
    'Ankith Web Developer'
  ],
  social: {
    github: 'https://github.com/ankith5980',
    linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
    instagram: 'https://www.instagram.com/ankith.pm/',
    email: 'ankithpratheesh147@gmail.com',
    phone: '+919495540233'
  },
  location: {
    city: 'Kozhikode',
    state: 'Kerala',
    country: 'India',
    coordinates: {
      latitude: '11.2588',
      longitude: '75.7804'
    }
  }
};

// Comprehensive Person Schema for Google Knowledge Graph
export const generatePersonSchema = () => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ankith Pratheesh Menon",
    "alternateName": ["Ankith", "Ankith Menon", "Ankith Pratheesh"],
    "givenName": "Ankith Pratheesh",
    "familyName": "Menon",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer specializing in React, Node.js, Python, and modern web technologies. Creating innovative digital solutions and scalable applications.",
    "url": baseUrl,
    "image": [
      getFullImageUrl("/images/Ankith.jpg"),
      getFullImageUrl("/images/portfolio_thumbnail_1.png")
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "birthPlace": {
      "@type": "Place",
      "name": "Kerala, India"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kozhikode",
      "addressRegion": "Kerala",
      "addressCountry": "India"
    },
    "nationality": {
      "@type": "Country",
      "name": "India"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "St. Joseph's College (Autonomous), Devagiri, Calicut",
        "description": "Bachelor of Computer Applications & Master of Computer Applications"
      }
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Accenture",
      "description": "Campus Placement Acquired"
    },
    "knowsAbout": [
      "Full Stack Development",
      "React.js",
      "Node.js",
      "JavaScript",
      "Python",
      "MongoDB",
      "PostgreSQL",
      "Web Development",
      "Mobile App Development",
      "AI/ML",
      "Software Engineering",
      "Frontend Development",
      "Backend Development",
      "Database Design",
      "RESTful APIs",
      "Git",
      "Docker",
      "Tailwind CSS",
      "Bootstrap",
      "Django",
      "Flutter",
      "Kotlin"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "description": "Develops both frontend and backend components of web applications",
      "skills": "React, Node.js, Python, JavaScript, MongoDB, PostgreSQL"
    },
    "sameAs": [
      "https://github.com/ankith5980",
      "https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/",
      "https://www.instagram.com/ankith.pm/",
      getFullUrl("/"),
      getFullUrl("/about"),
      getFullUrl("/projects"),
      getFullUrl("/contact")
    ],
    "email": "ankithpratheesh147@gmail.com",
    "telephone": "+91 9495540233",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9495540233",
      "contactType": "professional",
      "email": "ankithpratheesh147@gmail.com",
      "availableLanguage": ["English", "Malayalam", "Hindi"]
    },
    "seeks": {
      "@type": "Demand",
      "name": "Full Stack Development Opportunities",
      "description": "Seeking opportunities in full-stack development, web application development, and software engineering roles"
    },
    "brand": {
      "@type": "Brand",
      "name": "Ankith.dev",
      "url": baseUrl,
      "logo": getFullImageUrl("/images/Ankith.jpg")
    }
  };
};

// Professional Portfolio Schema
export const generatePortfolioSchema = () => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "ProfilePage"],
    "name": "Ankith Pratheesh Menon - Full Stack Developer Portfolio",
    "alternateName": "Ankith.dev Portfolio",
    "description": "Professional portfolio showcasing full-stack development projects, skills, and experience of Ankith Pratheesh Menon",
    "url": baseUrl,
    "mainEntity": generatePersonSchema(),
    "author": generatePersonSchema(),
    "creator": generatePersonSchema(),
    "publisher": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon",
      "url": baseUrl
    },
    "inLanguage": "en-US",
    "copyrightHolder": {
      "@type": "Person",
      "name": "Ankith Pratheesh Menon"
    },
    "copyrightYear": new Date().getFullYear(),
    "genre": ["Technology", "Web Development", "Software Engineering"],
    "keywords": [
      "Ankith Pratheesh Menon",
      "Ankith",
      "Full Stack Developer",
      "React Developer", 
      "Node.js Developer",
      "Web Developer",
      "Software Engineer",
      "JavaScript Developer",
      "Python Developer",
      "Portfolio",
      "Kerala Developer",
      "India Developer"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/projects?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "hasPart": [
      {
        "@type": "WebPage",
        "name": "About Ankith",
        "url": getFullUrl("/about"),
        "description": "Learn about Ankith's background, skills, and experience"
      },
      {
        "@type": "WebPage", 
        "name": "Projects Portfolio",
        "url": getFullUrl("/projects"),
        "description": "Showcase of web applications and software projects"
      },
      {
        "@type": "WebPage",
        "name": "Contact Ankith",
        "url": getFullUrl("/contact"),
        "description": "Get in touch for project collaborations and opportunities"
      }
    ]
  };
};

// Organization Schema for Professional Context
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ankith.dev",
    "alternateName": "Ankith Pratheesh Menon Portfolio",
    "url": getBaseUrl(),
    "logo": getFullImageUrl("/images/Ankith.jpg"),
    "image": getFullImageUrl("/images/portfolio_thumbnail_1.png"),
    "description": "Professional portfolio and personal brand of Full Stack Developer Ankith Pratheesh Menon",
    "founder": generatePersonSchema(),
    "employee": generatePersonSchema(),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9495540233",
      "contactType": "customer service",
      "email": "ankithpratheesh147@gmail.com",
      "availableLanguage": ["English", "Malayalam"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kozhikode",
      "addressRegion": "Kerala", 
      "addressCountry": "India"
    },
    "areaServed": ["India", "Global"],
    "serviceType": ["Web Development", "Full Stack Development", "Software Engineering"]
  };
};

// Rich Article Schema for Blog Posts (future use)
export const generateArticleSchema = (articleData) => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "image": getFullImageUrl(articleData.image),
    "datePublished": articleData.publishDate,
    "dateModified": articleData.modifiedDate || articleData.publishDate,
    "author": generatePersonSchema(),
    "publisher": generateOrganizationSchema(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": getFullUrl(articleData.url)
    },
    "wordCount": articleData.wordCount,
    "articleSection": articleData.category,
    "inLanguage": "en-US"
  };
};

// FAQ Schema for better search results
export const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Ankith Pratheesh Menon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith Pratheesh Menon is a Full Stack Developer from Kerala, India, specializing in React, Node.js, Python, and modern web technologies. He has acquired campus placement at Accenture and is pursuing Master of Computer Applications."
        }
      },
      {
        "@type": "Question", 
        "name": "What technologies does Ankith work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith works with React.js, Node.js, JavaScript, Python, MongoDB, PostgreSQL, Django, Flutter, Kotlin, Docker, Git, and many other modern web technologies for full-stack development."
        }
      },
      {
        "@type": "Question",
        "name": "How to contact Ankith Pratheesh Menon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Ankith at ankithpratheesh147@gmail.com or call +91 9495540233. You can also connect via LinkedIn, GitHub, or through his portfolio website."
        }
      },
      {
        "@type": "Question",
        "name": "What is Ankith's educational background?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith completed his Bachelor of Computer Applications from St. Joseph's College (Autonomous), Devagiri, Calicut with First Class with Distinction and is currently pursuing Master of Computer Applications from the same institution."
        }
      }
    ]
  };
};