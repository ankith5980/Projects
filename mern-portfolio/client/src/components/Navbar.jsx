import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSun,
  FaMoon,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaArrowRight,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const GITHUB_URL = 'https://github.com/ankith5980';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/certificates', label: 'Certificates' },
  { path: '/contact', label: 'Contact' },
];

const socials = [
  { href: GITHUB_URL, Icon: FaGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/', Icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'https://www.instagram.com/ankith.pm/', Icon: FaInstagram, label: 'Instagram' },
];

const ThemeToggle = ({ isDark, toggleTheme, className = '' }) => (
  <button
    onClick={toggleTheme}
    aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    className={`btn-fill btn-fill-accent relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-colors duration-300 hover:border-accent/60 hover:text-white ${className}`}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {isDark ? <FaMoon className="h-3.5 w-3.5" /> : <FaSun className="h-3.5 w-3.5" />}
      </motion.span>
    </AnimatePresence>
  </button>
);

/** Two bars that morph into an X — no icon swap, so nothing reflows. */
const MenuIcon = ({ open }) => (
  <span className="relative block h-4 w-5" aria-hidden="true">
    <span
      className={`absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]'
      }`}
    />
    <span
      className={`absolute left-0 block h-[1.5px] rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'top-[11px] w-3/5'
      }`}
    />
  </span>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shouldAnimate] = useState(() => {
    // Only animate on true first load (not on HMR or reloads)
    const hasLoaded = sessionStorage.getItem('navbarLoaded');
    if (!hasLoaded) {
      sessionStorage.setItem('navbarLoaded', 'true');
      return true;
    }
    return false;
  });
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle scroll effect - Throttled for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActiveLink = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <motion.header
        initial={shouldAnimate ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-[60] flex justify-center px-4 sm:top-5"
      >
        {/*
          Geometry is fixed at every scroll position — padding and the avatar
          used to shrink past 40px, which resized the pill mid-scroll. Only the
          shadow and border strength react now, neither of which affects layout.
        */}
        <nav
          className={`glass-violet flex items-center gap-1 rounded-full px-2.5 py-2 transition-shadow duration-300 sm:px-3 ${
            scrolled ? 'shadow-soft-lg' : ''
          }`}
        >
          {/* Avatar */}
          <Link to="/" aria-label="Home" className="shrink-0 transition-transform duration-200 hover:scale-105">
            <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/70">
              <img
                src="/images/Ankith.jpg"
                alt="Ankith Pratheesh Menon"
                className="h-full w-full object-cover"
                width="36"
                height="36"
                loading="eager"
                decoding="async"
              />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="ml-1 hidden items-center md:flex">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`relative z-10 block rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 lg:px-4 ${
                    isActiveLink(item.path) ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {item.label}
                </Link>

                {isActiveLink(item.path) && (
                  <motion.div
                    layoutId="active-pill-slider"
                    className="absolute inset-0 rounded-full border border-accent/40 bg-accent/15"
                    style={{ zIndex: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile wordmark */}
          <Link
            to="/"
            className="ml-1.5 mr-1 font-display text-base font-bold tracking-tight text-fg md:hidden"
          >
            Ankith<span className="text-accent">.dev</span>
          </Link>

          <span className="mx-1 hidden h-6 w-px bg-hairline md:block" />

          {/* GitHub CTA */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fill btn-fill-soft hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white md:flex"
          >
            <FaGithub className="h-4 w-4" />
            <span className="hidden lg:inline">GitHub</span>
          </a>

          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} className="ml-1 hidden md:flex" />

          {/* Mobile trigger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="btn-fill btn-fill-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-fg transition-colors hover:border-accent/60 hover:text-white md:hidden"
          >
            <MenuIcon open={isOpen} />
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Violet wash + grid so the sheet reads as part of the design */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 90% 55% at 80% 8%, rgb(var(--accent) / 0.14), transparent 70%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />

            {/* Oversized watermark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -left-3 select-none font-display text-[5.5rem] font-bold uppercase leading-none tracking-tighter text-fg/[0.04]"
            >
              Menu
            </span>

            <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-28">
              {/* Links */}
              <nav>
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
                  className="flex flex-col"
                >
                  {navItems.map((item, i) => {
                    const active = isActiveLink(item.path);
                    return (
                      <motion.li
                        key={item.path}
                        variants={{
                          hidden: { opacity: 0, y: 22 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                        className="border-b border-hairline last:border-b-0"
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-baseline gap-4 py-4"
                        >
                          <span
                            className={`font-display text-[11px] font-medium tabular-nums tracking-[0.2em] transition-colors ${
                              active ? 'text-accent' : 'text-muted'
                            }`}
                          >
                            0{i + 1}
                          </span>
                          <span
                            className={`font-display text-3xl font-bold uppercase tracking-tight transition-colors ${
                              active ? 'text-accent' : 'text-fg'
                            }`}
                          >
                            {item.label}
                          </span>
                          {active && (
                            <span className="ml-auto self-center text-accent">
                              <FaArrowRight className="h-4 w-4 -rotate-45" />
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fill btn-fill-soft flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-display text-sm font-semibold uppercase tracking-widest text-white shadow-soft"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>GitHub</span>
                </a>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {socials.map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="btn-fill btn-fill-accent flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-colors hover:border-accent/60 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                  <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} className="h-11 w-11" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
