import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import SEO from '../components/SEO';
import { getFullUrl, getFullImageUrl } from '../utils/url';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with fallback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Use EmailJS as primary method
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_27jmx62';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_49nj4oq';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '3d4ntCXQj5ZNHkKyv';
      
      if (serviceId && templateId && publicKey) {
        try {
          // Prepare template parameters
          const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Ankith Pratheesh Menon',
            reply_to: formData.email,
          };

          console.log('Sending via EmailJS fallback...');
          
          // Send email using EmailJS
          const response = await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
          );

          setSubmitStatus('success');
          setSubmitMessage('Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.');
          setFormData({ name: '', email: '', subject: '', message: '' });
          return;
        } catch (emailJSError) {
          throw new Error(`Failed to send message. Please try contacting me directly at ankithpratheesh147@gmail.com`);
        }
      } else {
        throw new Error('Contact service temporarily unavailable. Please email me directly at ankithpratheesh147@gmail.com');
      }

      // This section is now handled above as primary method
      
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      setSubmitMessage(`Failed to send message: ${error.message}. Please try contacting me directly at ankithpratheesh147@gmail.com`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'ankithpratheesh147@gmail.com',
      link: 'mailto:ankithpratheesh147@gmail.com'
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+91 9495540233',
      link: 'tel:+919495540233'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'Kozhikode, Kerala, India',
      link: null
    }
  ];

  // Social media links
  const socialLinks = [
    {
      icon: FaGithub,
      label: 'GitHub',
      url: 'https://github.com/ankith5980',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      color: 'hover:text-blue-600'
    },
    {
      icon: FaInstagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/ankith5980/',
      color: 'hover:text-pink-600'
    },
  ];

  return (
    <div className="min-h-screen section-padding pt-40 md:pt-44 lg:pt-48">
      <SEO 
        title="Contact Ankith Pratheesh Menon - Full Stack Developer | Get In Touch"
        description="Contact Ankith Pratheesh Menon for web development projects, collaborations, and job opportunities. Full Stack Developer specializing in React, Node.js, and modern web technologies. Based in Kozhikode, Kerala, India. Email: ankithpratheesh147@gmail.com | Phone: +91 9495540233"
        keywords="contact Ankith Pratheesh Menon, hire Ankith Pratheesh Menon, Ankith Pratheesh Menon email, Ankith Pratheesh Menon phone, Ankith full-stack developer contact, React developer Kozhikode contact, Node.js developer Kerala, web development services India, contact full-stack developer, Ankith developer Kozhikode, hire React developer India, full stack developer contact Kerala"
        url="/contact"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Ankith Pratheesh Menon",
          "description": "Get in touch with Ankith Pratheesh Menon for project collaborations, job opportunities, and web development inquiries",
          "url": getFullUrl("/contact"),
          "mainEntity": {
            "@type": "Person",
            "@id": getFullUrl("/#person"),
            "name": "Ankith Pratheesh Menon",
            "alternateName": ["Ankith", "Ankith Menon", "Ankith Pratheesh"],
            "jobTitle": "Full Stack Developer",
            "description": "Full Stack Developer specializing in React, Node.js, and modern web technologies",
            "email": "ankithpratheesh147@gmail.com",
            "telephone": "+919495540233",
            "url": getFullUrl("/"),
            "image": getFullImageUrl("/images/Ankith.jpg"),
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kozhikode",
              "addressRegion": "Kerala",
              "addressCountry": "India"
            },
            "sameAs": [
              "https://github.com/ankith5980",
              "https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/",
              "https://www.instagram.com/ankith5980/"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+919495540233",
              "contactType": "professional",
              "email": "ankithpratheesh147@gmail.com",
              "availableLanguage": ["English", "Malayalam", "Hindi"]
            }
          }
        }}
      />
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gradient mb-6 tracking-tight">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you. 
            Send me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Send Message
            </h2>
            
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <FaCheckCircle className="w-5 h-5" />
                  <span className="font-medium">Success!</span>
                </div>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  {submitMessage || 'Thank you for reaching out. I\'ll get back to you soon.'}
                </p>
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <FaExclamationTriangle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {submitMessage || 'Please try again or contact me directly via email.'}
                </p>
              </motion.div>
            )}
            
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="font-medium">Sending message...</span>
                </div>
                {submitMessage && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                    {submitMessage}
                  </p>
                )}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/10 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-white/20 dark:border-white/10'
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/10 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-white/20 dark:border-white/10'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/10 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white ${
                    errors.subject ? 'border-red-500' : 'border-white/20 dark:border-white/10'
                  }`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/10 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white resize-vertical ${
                    errors.message ? 'border-red-500' : 'border-white/20 dark:border-white/10'
                  }`}
                  placeholder="Tell me about your project or just say hello..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600/20 backdrop-blur-md border border-primary-600/40 hover:bg-primary-600/30 disabled:bg-gray-400/20 text-primary-700 dark:text-primary-300 disabled:text-gray-500 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Contact Information
              </h2>
              
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                const content = (
                  <div className="flex items-center space-x-4 p-6 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {info.label}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {info.value}
                      </p>
                    </div>
                  </div>
                );
                
                return info.link ? (
                  <a key={index} href={info.link} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>
                    {content}
                  </div>
                );
              })}
            </div>

            {/* Social Media Links */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Follow Me
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-400/20 backdrop-blur-md border border-gray-400/40 hover:bg-gray-400/30 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-200 hover:scale-110 ${social.color}`}
                      title={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
              <h3 className="text-lg font-bold mb-2 text-primary-900 dark:text-primary-100">
                Let's Build Something Amazing Together!
              </h3>
              <p className="text-primary-700 dark:text-primary-300 text-sm">
                I'm always excited to work on new projects and collaborate with amazing people. 
                Whether it's a web app, mobile application, or an innovative AI solution, 
                let's turn your ideas into reality!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;