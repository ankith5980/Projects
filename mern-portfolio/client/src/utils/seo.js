// SEO utility functions
export const generateProjectSEO = (project) => {
  if (!project) return {};
  
  return {
    title: project.title,
    description: `${project.description} Built with ${project.technologies?.join(', ')}.`,
    keywords: `${project.title}, ${project.technologies?.join(', ')}, web development project, ${project.category}`,
    image: project.images?.[0]?.url || '/images/portfolio_thumbnail_1.png',
    url: `/projects/${project._id}`,
    schemaData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": project.title,
      "description": project.description,
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web Browser",
      "url": project.liveUrl,
      "image": project.images?.[0]?.url,
      "author": {
        "@type": "Person",
        "name": "Ankith"
      },
      "dateCreated": project.createdAt,
      "programmingLanguage": project.technologies,
      "codeRepository": project.githubUrl
    }
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${window.location.origin}${crumb.url}`
    }))
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ankith.dev Portfolio",
    "description": "Professional portfolio of Ankith - Full Stack Developer",
    "url": window.location.origin,
    "author": {
      "@type": "Person",
      "name": "Ankith",
      "jobTitle": "Full Stack Developer"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/projects?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

// Default SEO configurations for each page
export const defaultSEOConfig = {
  home: {
    title: "Home",
    description: "Welcome to Ankith's portfolio - Full Stack Developer specializing in React, Node.js, and modern web technologies. Explore my projects, skills, and experience.",
    keywords: "Ankith, full-stack developer, React developer, Node.js, JavaScript, portfolio, web development"
  },
  about: {
    title: "About",
    description: "Learn more about Ankith - Full Stack Developer with expertise in React, Node.js, Python, and modern web technologies. Discover my background, skills, and passion for creating innovative solutions.",
    keywords: "about Ankith, full-stack developer background, React developer, Node.js expert, software engineer"
  },
  projects: {
    title: "Projects",
    description: "Explore Ankith's portfolio of web applications, mobile apps, and software projects. Full-stack development projects built with React, Node.js, Python, and modern technologies.",
    keywords: "projects, portfolio, web applications, mobile apps, React projects, Node.js projects, full-stack development"
  },
  contact: {
    title: "Contact",
    description: "Get in touch with Ankith - Full Stack Developer. Send a message for project collaborations, job opportunities, or general inquiries.",
    keywords: "contact Ankith, hire full-stack developer, React developer contact, Node.js developer, project collaboration"
  }
};