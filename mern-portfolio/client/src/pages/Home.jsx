import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaDownload,
  FaArrowRight,
  FaFilePdf
} from 'react-icons/fa';
import SEO from '../components/SEO';
import DisplayType from '../components/DisplayType';
import { AccentDot } from '../components/FloatingBadge';
import TiltPortrait from '../components/TiltPortrait';
import { generatePersonSchema } from '../utils/personalSEO';

// Lazy load non-critical sections with retry on chunk load failure
const lazyWithRetryComponent = (componentImport) =>
  lazy(async () => {
    const componentHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('component-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('component-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      console.error('Component chunk failed to load:', error);
      if (!componentHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('component-has-been-force-refreshed', 'true');
        // Reload page to attempt to fetch updated chunks (common after deployments)
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });

const SkillsSection = lazyWithRetryComponent(() => import('../components/SkillsSection'));
const ProjectsSection = lazyWithRetryComponent(() => import('../components/ProjectsSection'));

// Optimized Typing Effect Component with React.memo
const TypingEffect = React.memo(({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(() => {
      const targetText = texts[currentTextIndex];

      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <span>{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        className="ml-0.5"
        aria-hidden="true"
      >
        |
      </motion.span>
    </span>
  );
});

TypingEffect.displayName = 'TypingEffect';

// Technology marquee — recovers the tech motif the old floating icons carried
const MARQUEE_TECH = [
  'React', 'Node.js', 'Python', 'Flutter', 'MongoDB', 'Next.js',
  'Docker', 'FastAPI', 'Tailwind', 'PostgreSQL', 'LangGraph', 'AWS'
];

const Home = () => {
  const aboutData = useMemo(() => ({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'Passionate developer creating amazing digital experiences with modern technologies.',
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      instagram: 'https://www.instagram.com/ankith.pm/'
    }
  }), []);

  const featuredProjects = useMemo(() => [
    {
      _id: 1,
      title: 'AI Multi-Agent Research System',
      description: 'A fully local, decoupled AI system where multiple agents collaborate using a graph-based state machine to autonomously research topics, analyze data via vector stores, and generate comprehensive reports.',
      technologies: ['Python', 'LangGraph', 'FAISS', 'FastAPI'],
      images: [{ url: '/images/MULTI-AGENTRESEARCH.webp' }],
      liveUrl: '',
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/multi-agent-research-system',
      category: 'Artificial Intelligence',
      status: 'completed',
      developers: ['Ankith Pratheesh Menon'],
      lastUpdated: '2025-11-05',
      client: 'Personal Project',
    },
    {
      _id: 2,
      title: 'Automated AI Data Analyst',
      description: 'An AI-powered data analysis and visualization tool that enables users to upload datasets, perform exploratory data analysis, and generate insightful visualizations and reports using natural language queries.',
      technologies: ['Python', 'Next.js', 'Ollama', 'FastAPI', 'LangGraph'],
      images: [{ url: '/images/AIDATAANALYST.webp' }],
      liveUrl: '',
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-data-analysis-system',
      category: 'Data Analysis',
      status: 'completed',
      developers: ['Ankith Pratheesh Menon'],
      lastUpdated: '2025-10-28',
      client: 'Personal Project',
    },
    {
      _id: 3,
      title: 'NEXUS AI Fraud Vanguard',
      description: 'An AI-powered fraud detection system that leverages advanced machine learning algorithms and real-time data analysis to identify and detect fraudulent activities across various transactional domains.',
      technologies: ['Docker', 'Scikit-learn', 'Kafka', 'Redis', 'FastAPI'],
      images: [{ url: '/images/NEXUS-AI.webp' }],
      liveUrl: '',
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-fraud-detection',
      category: 'Machine Learning',
      status: 'completed',
      developers: ['Ankith Pratheesh Menon'],
      lastUpdated: '2025-10-15',
      client: 'Personal Project',
    },
  ], []);

  // Memoized typing texts to avoid re-creation on each render
  const typingTexts = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer',
    'Creative Problem Solver',
    'AI/ML Enthusiast'
  ], []);

  // Longest role reserves the tag's width so it doesn't jitter while typing
  const widestRole = useMemo(
    () => typingTexts.reduce((a, b) => (b.length > a.length ? b : a)),
    [typingTexts]
  );

  // Skills summary for the section below the hero
  const skills = useMemo(() => ({
    frontend: [
      { _id: 'f1', name: 'React' },
      { _id: 'f2', name: 'Next.js' },
      { _id: 'f3', name: 'Tailwind CSS' },
      { _id: 'f4', name: 'JavaScript' },
      { _id: 'f5', name: 'Flutter' },
    ],
    backend: [
      { _id: 'b1', name: 'Node.js' },
      { _id: 'b2', name: 'Express' },
      { _id: 'b3', name: 'FastAPI' },
      { _id: 'b4', name: 'Django' },
      { _id: 'b5', name: 'PHP' },
    ],
    database: [
      { _id: 'd1', name: 'MongoDB' },
      { _id: 'd2', name: 'PostgreSQL' },
      { _id: 'd3', name: 'MySQL' },
      { _id: 'd4', name: 'Supabase' },
      { _id: 'd5', name: 'Redis' },
    ],
    'ai & tools': [
      { _id: 't1', name: 'LangGraph' },
      { _id: 't2', name: 'Ollama' },
      { _id: 't3', name: 'Docker' },
      { _id: 't4', name: 'Git' },
      { _id: 't5', name: 'AWS' },
    ],
  }), []);

  const handleCVDownload = () => {
    // Analytics tracking placeholder
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Ankith Pratheesh Menon - Full Stack Developer Portfolio"
        description="Welcome to Ankith Pratheesh Menon's portfolio - Professional Full Stack Developer from Kerala, India specializing in React, Node.js, Flutter, Next.js, and modern web technologies. Explore my projects, skills, and experience in software development."
        keywords="Ankith Pratheesh Menon, Ankith, full-stack developer, React developer, Node.js, JavaScript, Flutter developer, Next.js, Supabase, TypeScript, portfolio, web development, software engineer, Kerala, India, MERN stack"
        url="/"
        schemaData={generatePersonSchema()}
      />

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-32">
        {/* Layer 0 — giant background typography */}
        {/*
          Sized and boxed so both words fit on screen in full. "FULL-STACK"
          runs about 5.8em wide, so the ramp is capped low enough that it
          always clears the box rather than bleeding past the viewport edge.
        */}
        <DisplayType
          solid="FULL-STACK"
          outlined="DEVELOPER"
          align="right"
          className="left-auto right-4 w-[96%] sm:right-6 lg:w-[72%]"
          fontSize="clamp(2rem, 9vw, 9rem)"
          speed={70}
        />

        <div className="container relative z-10 mx-auto container-padding">
          {/*
            The right column is wider than the left, so the portrait sits left
            of centre and clears the FULL-STACK / DEVELOPER lettering behind it.
            The offset is driven by these fr weights rather than a translate —
            the portrait's wrapper is a motion element whose own transform
            would overwrite one.
          */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.82fr_auto_1.58fr] lg:gap-8"
          >
            {/* ---- Left flank: name ---- */}
            <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative order-1 text-left">
              {/* Rule + eyebrow. Horizontal on mobile, vertical alongside the
                  name from lg up. */}
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <span className="h-px w-8 bg-accent sm:w-10 lg:hidden" />
                <span className="eyebrow">Hi, my name is</span>
              </div>

              {/* Decorative rule (desktop only) */}
              <span className="absolute left-0 top-14 hidden h-32 w-px bg-gradient-to-b from-accent to-transparent lg:block" />

              <h1 className="font-display font-bold uppercase leading-[0.88] tracking-tighter lg:pl-6">
                <span
                  className="text-outline-accent block italic"
                  style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}
                >
                  Ankith
                </span>
                <span
                  className="block text-fg"
                  style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)' }}
                >
                  Pratheesh Menon
                </span>
              </h1>

              <AccentDot className="bottom-[-1.5rem] left-8 hidden lg:block" delay={1.2} />
            </motion.div>

            {/* ---- Centre: portrait ---- */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.94, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 mx-auto flex justify-center"
            >
              <TiltPortrait
                src="/images/Ankith.jpg"
                alt="Ankith Pratheesh Menon"
                width="400"
                height="533"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={{ width: 'clamp(205px, 56vw, 400px)' }}
              />
            </motion.div>

            {/* ---- Right flank: role + CTA ---- */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-3 flex flex-col items-start gap-5 text-left sm:gap-8 lg:items-end lg:text-right"
            >
              {/*
                Role tag with the typed title.

                The hidden sizer — widest role plus the caret — is the ONLY
                in-flow content, so it alone determines the box. The typed text
                is absolutely positioned on top and therefore cannot contribute
                to width or height at any point in the cycle, including the
                frame where the string is empty between two titles.
              */}
              <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-display text-sm font-semibold uppercase tracking-widest text-accent backdrop-blur-md sm:text-base">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="relative block whitespace-nowrap">
                  <span className="invisible" aria-hidden="true">
                    {widestRole}
                    <span className="ml-0.5">|</span>
                  </span>
                  <span className="absolute inset-y-0 left-0 flex items-center">
                    <TypingEffect
                      texts={typingTexts}
                      speed={80}
                      deleteSpeed={40}
                      pauseTime={3000}
                    />
                  </span>
                </span>
              </span>

              <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base lg:max-w-xs">
                {aboutData.bio}
              </p>

              {/*
                Hidden below lg — the "Get In Touch" button in the action row
                already covers this on small screens, and two contact CTAs
                stacked on a phone just pad the scroll.
              */}
              <div className="hidden flex-col items-center gap-2 lg:flex lg:items-end">
                <span className="eyebrow">Get in touch</span>
                <Link
                  to="/contact"
                  className="group flex items-center gap-3"
                >
                  {/*
                    Underline is a pseudo-free child rule: a 2px bar pinned to
                    the baseline that wipes in from the left on hover. Scaling
                    the whole link moved it toward the viewer, which read as a
                    gimmick next to otherwise flat type.
                  */}
                  <span className="relative font-display text-2xl font-bold uppercase tracking-tight text-fg sm:text-3xl">
                    Let&apos;s Talk
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-fg transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    <FaArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- Actions + socials ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-stretch gap-5 sm:mt-16 sm:items-center sm:gap-6"
          >
            {/*
              Two-up grid on phones (CV spans the full width) so the buttons
              read as a deliberate block instead of a ragged wrap.
            */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                to="/projects"
                className="btn-fill btn-fill-soft inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-soft sm:px-6"
              >
                <span>View My Work</span>
                <FaArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to="/contact"
                className="btn-fill btn-fill-accent inline-flex items-center justify-center gap-2 rounded-full border border-accent/50 px-5 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:text-white sm:px-6"
              >
                <span>Get In Touch</span>
              </Link>

              <a
                href="/cv/My_Resume.pdf"
                download="Ankith_Pratheesh_Menon_CV.pdf"
                onClick={handleCVDownload}
                className="btn-fill btn-fill-accent col-span-2 inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-muted transition-all duration-200 hover:border-accent/60 hover:text-white sm:col-span-1 sm:px-6"
              >
                <FaFilePdf className="h-3.5 w-3.5" />
                <span>Download CV</span>
                <FaDownload className="h-3 w-3" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-3">
              {[
                { href: aboutData.socialLinks.github, Icon: FaGithub, label: 'GitHub' },
                { href: aboutData.socialLinks.linkedin, Icon: FaLinkedin, label: 'LinkedIn' },
                { href: aboutData.socialLinks.instagram, Icon: FaInstagram, label: 'Instagram' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="btn-fill btn-fill-accent flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-all duration-200 hover:border-accent/60 hover:text-white hover:shadow-soft"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= TECH MARQUEE ================= */}
      <div className="relative overflow-hidden border-y border-hairline py-4">
        <div className="mask-fade-x flex">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...MARQUEE_TECH, ...MARQUEE_TECH].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="flex shrink-0 items-center gap-10 font-display text-sm font-medium uppercase tracking-[0.2em] text-muted"
              >
                {tech}
                <span className="h-1 w-1 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SKILLS ================= */}
      <Suspense fallback={<div className="section-padding" />}>
        <SkillsSection skills={skills} />
      </Suspense>

      {/* ================= PROJECTS ================= */}
      <Suspense fallback={
        <div className="section-padding flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        </div>
      }>
        <ProjectsSection featuredProjects={featuredProjects} />
      </Suspense>
    </div>
  );
};

export default Home;
