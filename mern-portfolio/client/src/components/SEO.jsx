import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getBaseUrl, getFullUrl, getFullImageUrl } from '../utils/url';

const SEO = ({
  title = 'Portfolio',
  description = 'Professional portfolio showcasing my skills, projects, and experience as a full-stack developer.',
  keywords = 'portfolio, full-stack developer, React, Node.js, JavaScript, web development, software engineer, Ankith, Ankith Pratheesh Menon',
  author = 'Ankith',
  image = '/images/portfolio_thumbnail_1.png',
  url,
  type = 'website',
  canonicalUrl,
  noindex = false,
  schemaData
}) => {
  const baseUrl = getBaseUrl();
  const fullUrl = getFullUrl(url);
  const fullImageUrl = getFullImageUrl(image);
  
  // Default structured data
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author,
    "url": baseUrl,
    "jobTitle": "Full Stack Developer",
    "description": description,
    "image": fullImageUrl,
    "sameAs": [
      "https://github.com/ankith5980",
      "https://linkedin.com/in/ankith-dev"
    ]
  };

  const schema = schemaData || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | Ankith.dev</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={`${title} | Ankith.dev`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Ankith.dev Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | Ankith.dev`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@ankith_dev" />
      <meta name="twitter:site" content="@ankith_dev" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SEO;