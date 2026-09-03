import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getBaseUrl, getFullUrl, getFullImageUrl } from '../utils/url';
import { 
  generatePersonSchema, 
  generatePortfolioSchema,
  generateBreadcrumbSchema,
  generateFAQSchema 
} from '../utils/personalSEO';

const SEO = ({
  title = 'Portfolio',
  description = 'Professional portfolio of Ankith Pratheesh Menon - Full Stack Developer and AI Specialist from Kerala, India specializing in React, Next.js, Node.js, Python, Flutter, and modern web architectures.',
  keywords = 'Ankith Pratheesh Menon, Ankith, full-stack developer, React, Next.js, Node.js, JavaScript, Python, FastAPI, Flutter, LangGraph, AI developer, Kozhikode, Kerala, India, Accenture',
  author = 'Ankith Pratheesh Menon',
  image = '/images/Ankith.jpg',
  url = '',
  type = 'website',
  canonicalUrl,
  noindex = false,
  breadcrumbName,
  includeFAQ = false,
  schemaData
}) => {
  const baseUrl = getBaseUrl();
  const fullUrl = getFullUrl(url);
  const fullImageUrl = getFullImageUrl(image);
  const canonical = canonicalUrl || fullUrl;
  
  // Structured data schemas for Google E-E-A-T, GEO & AEO
  const defaultPersonSchema = generatePersonSchema();
  const portfolioSchema = generatePortfolioSchema();
  const primarySchema = schemaData || defaultPersonSchema;
  
  // Breadcrumb schema for search result navigation hierarchy
  const pageLabel = breadcrumbName || (url === '/' || url === '' ? 'Home' : url.replace('/', '').charAt(0).toUpperCase() + url.slice(2));
  const breadcrumbSchema = generateBreadcrumbSchema(url, pageLabel);

  // Optional FAQ schema for AEO & zero-click snippet extraction
  const faqSchema = includeFAQ ? generateFAQSchema() : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title.includes('Ankith') ? title : `${title} | Ankith.dev`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* GEO Location Meta Tags (Generative Engine Optimization) */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kozhikode, Kerala, India" />
      <meta name="geo.position" content="11.2588;75.7804" />
      <meta name="ICBM" content="11.2588, 75.7804" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title.includes('Ankith') ? title : `${title} | Ankith.dev`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="800" />
      <meta property="og:image:alt" content="Ankith Pratheesh Menon - Full Stack Developer Portfolio" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Ankith.dev Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title.includes('Ankith') ? title : `${title} | Ankith.dev`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Ankith Pratheesh Menon - Full Stack Developer" />
      <meta name="twitter:creator" content="@ankith_dev" />
      <meta name="twitter:site" content="@ankith_dev" />
      
      {/* Theme Color (Harmonized with Violet Brand System) */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      
      {/* Primary Schema (Person / Page-specific) */}
      <script type="application/ld+json">
        {JSON.stringify(primarySchema)}
      </script>
      
      {/* Portfolio WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify(portfolioSchema)}
      </script>

      {/* AEO BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* AEO FAQ Schema (when active) */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;