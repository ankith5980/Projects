import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import SEO from '../components/SEO';
import DisplayType from '../components/DisplayType';
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
      emailjs.init({ publicKey });
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
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
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
            { publicKey }
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
      url: 'https://www.instagram.com/ankith.pm/',
      color: 'hover:text-pink-600'
    },
  ];

  return (
    <div className="min-h-screen section-padding pt-40 md:pt-44 lg:pt-48 overflow-x-hidden">
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
              "https://www.instagram.com/ankith.pm/"
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
      <div className="relative container mx-auto container-padding">
        {/* Giant watermark */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
          <DisplayType solid="CONTACT" align="center" className="opacity-70" speed={40} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-16 px-4 text-center"
        >
          <span className="eyebrow">Say hello</span>
          <h1 className="mb-6 mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Get In <span className="text-accent">Touch</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted sm:text-lg">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Send me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-violet rounded-3xl p-6 sm:p-8"
          >
            <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-fg">
              Send Message
            </h2>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-green-500/40 bg-green-500/10 p-4"
              >
                <div className="flex items-center space-x-2 text-green-400">
                  <FaCheckCircle className="h-5 w-5" />
                  <span className="font-medium">Success!</span>
                </div>
                <p className="mt-1 text-sm text-green-400/90">
                  {submitMessage || 'Thank you for reaching out. I\'ll get back to you soon.'}
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4"
              >
                <div className="flex items-center space-x-2 text-red-400">
                  <FaExclamationTriangle className="h-5 w-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-1 text-sm text-red-400/90">
                  {submitMessage || 'Please try again or contact me directly via email.'}
                </p>
              </motion.div>
            )}

            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-accent/40 bg-accent/10 p-4"
              >
                <div className="flex items-center space-x-2 text-accent">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
                  <span className="font-medium">Sending message...</span>
                </div>
                {submitMessage && (
                  <p className="mt-1 text-sm text-accent/90">
                    {submitMessage}
                  </p>
                )}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="mb-2 block font-display text-xs font-semibold uppercase tracking-widest text-muted">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`w-full rounded-xl border bg-surface-2 px-4 py-3 text-fg outline-none backdrop-blur-md transition-all duration-200 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30 ${
                      errors.name ? 'border-red-500' : 'border-hairline'
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="mb-2 block font-display text-xs font-semibold uppercase tracking-widest text-muted">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className={`w-full rounded-xl border bg-surface-2 px-4 py-3 text-fg outline-none backdrop-blur-md transition-all duration-200 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30 ${
                      errors.email ? 'border-red-500' : 'border-hairline'
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
                <label htmlFor="subject" className="mb-2 block font-display text-xs font-semibold uppercase tracking-widest text-muted">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  autoComplete="off"
                  className={`w-full rounded-xl border bg-surface-2 px-4 py-3 text-fg outline-none backdrop-blur-md transition-all duration-200 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30 ${
                    errors.subject ? 'border-red-500' : 'border-hairline'
                  }`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block font-display text-xs font-semibold uppercase tracking-widest text-muted">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  autoComplete="off"
                  rows="5"
                  className={`w-full resize-y rounded-xl border bg-surface-2 px-4 py-3 text-fg outline-none backdrop-blur-md transition-all duration-200 placeholder:text-muted focus:border-accent/60 focus:ring-2 focus:ring-accent/30 ${
                    errors.message ? 'border-red-500' : 'border-hairline'
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
                className="flex w-full items-center justify-center space-x-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
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
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-fg">
                Contact Information
              </h2>

              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                const content = (
                  <div className="glass-violet flex items-center space-x-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/15">
                      <IconComponent className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-muted">
                        {info.label}
                      </h3>
                      <p className="mt-0.5 truncate text-fg">
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
            <div className="glass-violet rounded-2xl p-6">
              <h3 className="mb-4 font-display text-lg font-bold uppercase tracking-tight text-fg">
                Follow Me
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-muted transition-all duration-200 hover:scale-110 hover:border-accent/60 hover:text-accent hover:shadow-glow"
                      title={social.label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 p-6">
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'linear-gradient(135deg, rgb(var(--accent) / 0.9), rgb(var(--accent-soft) / 0.7))',
                }}
              />
              <h3 className="mb-2 font-display text-lg font-bold text-white">
                Let's Build Something Amazing Together!
              </h3>
              <p className="text-sm text-white/90">
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