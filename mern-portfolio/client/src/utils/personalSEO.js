// Enhanced SEO, GEO, and AEO utilities for Google Knowledge Graph and AI Answer Engines
import { getBaseUrl, getFullUrl, getFullImageUrl } from './url';

// Site metadata configuration for consistent SEO across search & generative engines
export const siteMetadata = {
  siteName: 'Ankith Pratheesh Menon - Full Stack Developer Portfolio',
  siteUrl: 'https://portfolio-ankith.vercel.app',
  author: 'Ankith Pratheesh Menon',
  description: 'Official portfolio of Ankith Pratheesh Menon - Full Stack Developer and AI Specialist from Kerala, India specializing in React, Next.js, Node.js, Python, Flutter, and modern web & AI technologies.',
  keywords: [
    'Ankith Pratheesh Menon',
    'Ankith Menon',
    'Ankith Pratheesh',
    'Ankith',
    'Full Stack Developer',
    'AI Engineer Kerala',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'Python Developer',
    'Web Developer Kozhikode',
    'JavaScript Developer',
    'MERN Stack Developer',
    'Software Engineer Kerala',
    'Accenture Placement',
    'Portfolio Ankith',
    'Ankith Developer Kerala',
    'Frontend Developer India',
    'Backend Developer India',
    'LangGraph Developer',
    'FastAPI Developer',
    'Shopify Developer',
    'E-Commerce Developer'
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
    region: 'IN-KL',
    coordinates: {
      latitude: '11.2588',
      longitude: '75.7804'
    }
  }
};

// Comprehensive Person Schema for Google E-E-A-T & Knowledge Graph
export const generatePersonSchema = () => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    "name": "Ankith Pratheesh Menon",
    "alternateName": ["Ankith", "Ankith Menon", "Ankith Pratheesh", "Ankith Developer"],
    "givenName": "Ankith Pratheesh",
    "familyName": "Menon",
    "jobTitle": "Full Stack Developer",
    "description": "Full Stack Developer and AI Specialist from Kerala, India specializing in React, Next.js, Node.js, Python, Flutter, and scalable distributed web architectures.",
    "url": baseUrl,
    "image": {
      "@type": "ImageObject",
      "url": getFullImageUrl("/images/Ankith.jpg"),
      "contentUrl": getFullImageUrl("/images/Ankith.jpg"),
      "caption": "Ankith Pratheesh Menon - Full Stack Developer",
      "width": "800",
      "height": "800"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "birthPlace": {
      "@type": "Place",
      "name": "Kerala, India"
    },
    "homeLocation": {
      "@type": "Place",
      "name": "Kozhikode, Kerala, India"
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
        "description": "Master of Computer Applications (MCA) — Advanced Computer Science & Distributed Systems"
      },
      {
        "@type": "EducationalOrganization",
        "name": "St. Joseph's College (Autonomous), Devagiri, Calicut",
        "description": "Bachelor of Computer Applications (BCA) — First Class with Distinction (2022–2025)"
      }
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Accenture",
      "description": "Campus Placement Acquired as Associate Software Engineer"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Python Programming with Django",
        "recognizedBy": { "@type": "Organization", "name": "RISS Technologies" }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Flutter and Dart Certified Developer Program",
        "recognizedBy": { "@type": "Organization", "name": "Maitexa Info Solutions LLP" }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Figma UI/UX Design Mastery",
        "recognizedBy": { "@type": "Organization", "name": "TECHBYHEART" }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Python for Data Science and Machine Learning",
        "recognizedBy": { "@type": "Organization", "name": "Maitexa Info Solutions LLP" }
      }
    ],
    "knowsAbout": [
      "Full Stack Development",
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "JavaScript",
      "TypeScript",
      "Python",
      "FastAPI",
      "Django",
      "Flutter",
      "Tailwind CSS",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Firebase",
      "MySQL",
      "Supabase",
      "LangGraph",
      "Multi-Agent AI Systems",
      "Shopify",
      "Claude Code",
      "Docker",
      "Git",
      "RESTful APIs",
      "WebSockets"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "description": "Architects, builds, and maintains full-stack web applications, microservices, and AI-driven platforms",
      "skills": "React, Next.js, Node.js, Python, FastAPI, MongoDB, PostgreSQL, Tailwind CSS, Docker, Git, Shopify"
    },
    "sameAs": [
      "https://github.com/ankith5980",
      "https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/",
      "https://www.instagram.com/ankith.pm/",
      getFullUrl("/"),
      getFullUrl("/about"),
      getFullUrl("/projects"),
      getFullUrl("/certificates"),
      getFullUrl("/contact")
    ],
    "email": "ankithpratheesh147@gmail.com",
    "telephone": "+91 9495540233",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9495540233",
      "contactType": "Professional",
      "email": "ankithpratheesh147@gmail.com",
      "availableLanguage": ["English", "Malayalam", "Hindi"]
    },
    "brand": {
      "@type": "Brand",
      "name": "Ankith.dev",
      "url": baseUrl,
      "logo": getFullImageUrl("/images/Ankith.jpg")
    }
  };
};

// Professional Portfolio WebSite Schema with GEO & E-E-A-T
export const generatePortfolioSchema = () => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": ["WebSite", "ProfilePage"],
    "@id": `${baseUrl}/#website`,
    "name": "Ankith Pratheesh Menon - Full Stack Developer Portfolio",
    "alternateName": "Ankith.dev",
    "description": "Official portfolio showcasing full-stack web applications, AI research systems, and professional experience of Ankith Pratheesh Menon",
    "url": baseUrl,
    "mainEntity": {
      "@id": `${baseUrl}/#person`
    },
    "author": {
      "@id": `${baseUrl}/#person`
    },
    "creator": {
      "@id": `${baseUrl}/#person`
    },
    "publisher": {
      "@id": `${baseUrl}/#person`
    },
    "inLanguage": "en-US",
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
        "description": "Learn about Ankith's background, education, and technical expertise"
      },
      {
        "@type": "WebPage", 
        "name": "Projects Portfolio",
        "url": getFullUrl("/projects"),
        "description": "Showcase of full-stack web applications, AI multi-agent systems, and software projects"
      },
      {
        "@type": "WebPage",
        "name": "Certificates & Credentials",
        "url": getFullUrl("/certificates"),
        "description": "Professional certifications in Python, Django, Flutter, and UI/UX design"
      },
      {
        "@type": "WebPage",
        "name": "Contact Ankith",
        "url": getFullUrl("/contact"),
        "description": "Get in touch for project collaborations and software engineering opportunities"
      }
    ]
  };
};

// AEO FAQ Schema for Featured Snippets, Zero-Click Answers & AI Overviews
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
          "text": "Ankith Pratheesh Menon is a Full Stack Developer and Software Engineer from Kozhikode, Kerala, India. He specializes in React, Next.js, Node.js, Python, FastAPI, and AI Multi-Agent architectures. He holds campus placement at Accenture and is pursuing a Master of Computer Applications (MCA) at St. Joseph's College (Autonomous), Devagiri."
        }
      },
      {
        "@type": "Question", 
        "name": "What technologies and programming languages does Ankith specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith specializes in JavaScript, TypeScript, Python, and Dart. His core stack encompasses React, Next.js, Node.js, Express.js, FastAPI, Django, Flutter, Tailwind CSS, MongoDB, PostgreSQL, Redis, Firebase, Shopify, and AI technologies such as LangGraph and Claude Code."
        }
      },
      {
        "@type": "Question",
        "name": "What are Ankith Pratheesh Menon's key portfolio projects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith's flagship projects include: (1) Skill-Swap: a real-time peer-to-peer skill exchange platform using TypeScript and WebSockets; (2) AI Multi-Agent Research System: a local graph-based multi-agent topic research engine using LangGraph and FAISS; (3) NEXUS AI Fraud Vanguard: a real-time Kafka and ML fraud detection pipeline; (4) Automated AI Data Analyst: natural language exploratory data analysis using Ollama; and (5) Context-Aware Accessibility Linter (CAAL): an AI DOM analysis accessibility compliance tool."
        }
      },
      {
        "@type": "Question",
        "name": "What is Ankith's educational background and career placement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ankith completed his Bachelor of Computer Applications (BCA) with First Class with Distinction from St. Joseph's College (Autonomous), Devagiri, Calicut (2022–2025). He acquired campus placement at Accenture as an Associate Software Engineer in 2025 and is currently pursuing his Master of Computer Applications (MCA)."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact Ankith Pratheesh Menon or download his resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact Ankith via email at ankithpratheesh147@gmail.com or by phone at +91 9495540233. His GitHub profile is github.com/ankith5980 and LinkedIn is linkedin.com/in/ankith-pratheesh-menon-0353662b6/. His resume is downloadable directly at portfolio-ankith.vercel.app/cv/My_Resume.pdf."
        }
      }
    ]
  };
};

// Organization Schema for Professional Context
export const generateOrganizationSchema = () => {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ankith.dev",
    "alternateName": "Ankith Pratheesh Menon Portfolio",
    "url": baseUrl,
    "logo": getFullImageUrl("/images/Ankith.jpg"),
    "image": getFullImageUrl("/images/Ankith.jpg"),
    "description": "Professional portfolio and personal brand of Full Stack Developer Ankith Pratheesh Menon",
    "founder": {
      "@id": `${baseUrl}/#person`
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9495540233",
      "contactType": "Professional",
      "email": "ankithpratheesh147@gmail.com",
      "availableLanguage": ["English", "Malayalam", "Hindi"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kozhikode",
      "addressRegion": "Kerala",
      "addressCountry": "India"
    },
    "areaServed": ["Worldwide", "India"]
  };
};

// BreadcrumbList Schema for Rich Search Result Navigation Paths
export const generateBreadcrumbSchema = (path = '/', pageName = 'Home') => {
  const baseUrl = getBaseUrl();
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    }
  ];

  if (path !== '/' && path !== '') {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": pageName,
      "item": getFullUrl(path)
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
};

// SoftwareSourceCode / Projects Schema for GEO & Generative Citations
export const generateProjectsSchema = (projects = []) => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Projects Portfolio - Ankith Pratheesh Menon",
    "description": "Collection of full-stack web applications, AI research systems, and software engineering projects by Ankith Pratheesh Menon",
    "url": getFullUrl("/projects"),
    "mainEntity": {
      "@type": "ItemList",
      "name": "Portfolio Projects",
      "numberOfItems": projects.length,
      "itemListElement": projects.map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareSourceCode",
          "name": p.title,
          "description": p.description,
          "programmingLanguage": p.tags || [],
          "codeRepository": p.githubUrl,
          "creator": {
            "@id": `${baseUrl}/#person`
          },
          "url": p.liveUrl || p.githubUrl || getFullUrl("/projects")
        }
      }))
    }
  };
};

// EducationalOccupationalCredential Schema for Certificates Page
export const generateCertificatesSchema = (certificates = []) => {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Professional Certifications - Ankith Pratheesh Menon",
    "description": "Verified professional credentials and technical certifications earned by Ankith Pratheesh Menon",
    "url": getFullUrl("/certificates"),
    "mainEntity": {
      "@type": "ItemList",
      "name": "Certifications",
      "numberOfItems": certificates.length,
      "itemListElement": certificates.map((cert, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "EducationalOccupationalCredential",
          "name": cert.title,
          "credentialCategory": "Professional Certification",
          "recognizedBy": {
            "@type": "Organization",
            "name": cert.issuer
          },
          "about": cert.skills || [],
          "validIn": {
            "@type": "Country",
            "name": "India"
          }
        }
      }))
    }
  };
};