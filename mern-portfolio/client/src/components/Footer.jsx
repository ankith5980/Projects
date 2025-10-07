import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaEnvelope, 
  FaHeart 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/ankith5980',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/ankith5980',
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: 'mailto:ankithpratheesh147@gmail.com',
    },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-dark-200 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto container-padding section-padding">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-2xl font-bold text-gradient inline-block"
            >
              Ankith Pratheesh Menon
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              Building digital experiences with passion and precision.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 hover:scale-110"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Get In Touch
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              <FaEnvelope className="w-4 h-4" />
              <span>Contact Me</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © {currentYear} Ankith. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-1">
            <span>Made with</span>
            <FaHeart className="w-4 h-4 text-red-500" />
            <span>using MERN Stack</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;