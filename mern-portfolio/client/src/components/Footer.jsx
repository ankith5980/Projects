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
      url: 'https://instagram.com/ankith.pm',
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
    { name: 'Certificates', path: '/certificates' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-elev">
      {/* Giant wordmark watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] flex justify-center overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap font-display font-bold uppercase leading-none tracking-tighter text-fg/[0.04]"
          style={{ fontSize: 'clamp(4rem, 18vw, 14rem)' }}
        >
          Ankith
        </span>
      </div>

      <div className="container relative z-10 mx-auto container-padding py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block font-display text-xl font-bold uppercase tracking-tight text-fg"
            >
              Ankith <span className="text-accent">Pratheesh Menon</span>
            </Link>
            <p className="text-sm text-muted">
              Building digital experiences with passion and precision.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-all duration-200 hover:scale-110 hover:border-accent/60 hover:text-accent hover:shadow-glow"
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="eyebrow">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="inline-block text-sm text-muted transition-all duration-200 hover:translate-x-1 hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="eyebrow">Get In Touch</h3>
            <p className="text-sm text-muted">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-glow"
            >
              <FaEnvelope className="h-4 w-4" />
              <span>Contact Me</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex items-center justify-center border-t border-hairline pt-6">
          <p className="text-center text-xs text-muted sm:text-sm">
            © {currentYear} Designed by Ankith Pratheesh Menon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;