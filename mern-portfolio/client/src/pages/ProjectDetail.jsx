import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { generateProjectSEO } from '../utils/seo';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // This would typically fetch project data based on ID
  const project = {
    _id: id,
    title: "Project Details",
    description: "Detailed project information and showcase",
    technologies: ["React", "Node.js"],
    images: [{ url: "/images/portfolio_thumbnail_1.png" }]
  };
  
  const seoData = generateProjectSEO(project);
  
  return (
    <div className="min-h-screen section-padding pt-32">
      <SEO {...seoData} />
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gradient mb-8">Project Details</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            This page will show detailed information about a specific project,
            including images, description, technologies used, and links.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;