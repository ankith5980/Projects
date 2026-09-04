import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import DisplayType from '../components/DisplayType';
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal';
import { AccentDot } from '../components/FloatingBadge';
import TiltPortrait from '../components/TiltPortrait';
import { generatePersonSchema } from '../utils/personalSEO';
import { getFullUrl } from '../utils/url';
import { 
  FaCode, 
  FaGraduationCap, 
  FaBriefcase, 
  FaAward, 
  FaHeart,
  FaDownload,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRocket,
  FaCoffee,
  FaMusic,
  FaGamepad,
  FaCamera,
  FaPlane,
  FaBrain,
  FaRobot,
  FaAws,
} from 'react-icons/fa';
import { 
  SiReact, 
  SiNextdotjs,
  SiJavascript, 
  SiFlutter, 
  SiTailwindcss,
  SiExpress,
  SiDjango,
  SiFastapi,
  SiPhp,
  SiMongodb, 
  SiPostgresql,
  SiRedis,
  SiFirebase,
  SiMysql,
  SiSupabase,
  SiPostman,
  SiPowerbi,
  SiDocker,
  SiGit,
  SiFigma,
  SiShopify
} from 'react-icons/si';

const ClaudeIcon = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
  </svg>
);

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
    <span className="relative inline-flex items-center">
      <motion.span
        key={currentTextIndex}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="font-display font-bold text-accent"
      >
        {currentText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="ml-1 font-display text-2xl font-bold text-accent"
      >
        |
      </motion.span>
    </span>
  );
});

TypingEffect.displayName = 'TypingEffect';

// Tech stack with icons
const techStack = [
  { name: 'React', icon: SiReact, color: 'text-blue-500' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'text-fg' },
  { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-500' },
  { name: 'Flutter', icon: SiFlutter, color: 'text-blue-400' },
  { name: 'TailwindCSS', icon: SiTailwindcss, color: 'text-teal-400' },
  { name: 'Express.js', icon: SiExpress, color: 'text-muted' },
  { name: 'Django', icon: SiDjango, color: 'text-green-700' },
  { name: 'FastAPI', icon: SiFastapi, color: 'text-teal-500' },
  { name: 'PHP', icon: SiPhp, color: 'text-indigo-500' },
  { name: 'Machine Learning', icon: FaRobot, color: 'text-purple-500' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-700' },
  { name: 'Redis', icon: SiRedis, color: 'text-red-500' },
  { name: 'Firebase', icon: SiFirebase, color: 'text-amber-500' },
  { name: 'MySQL', icon: SiMysql, color: 'text-orange-500' },
  { name: 'Supabase', icon: SiSupabase, color: 'text-emerald-500' },
  { name: 'AWS', icon: FaAws, color: 'text-orange-500' },
  { name: 'Postman', icon: SiPostman, color: 'text-orange-500' },
  { name: 'PowerBI', icon: SiPowerbi, color: 'text-yellow-600' },
  { name: 'Claude Code', icon: ClaudeIcon, color: 'text-amber-600' },
  { name: 'Shopify', icon: SiShopify, color: 'text-green-500' },
  { name: 'Docker', icon: SiDocker, color: 'text-blue-500' },
  { name: 'Git', icon: SiGit, color: 'text-red-500' },
  { name: 'Figma', icon: SiFigma, color: 'text-purple-500' }
];

// Experience timeline
const timeline = [
  {
    year: '2025',
    title: 'Pursuing Master of Computer Applications',
    company: 'St. Joseph\'s College (Autonomous), Devagiri, Calicut',
    description: 'Pursuing advanced studies in computer applications to deepen my knowledge and skills in software development and related fields.',
    type: 'education'
  },
  {
    year: '2025',
    title: 'Accquired Campus Placement',
    company: 'Accenture',
    description: 'Accquired campus placement at Accenture, a global leader in IT services and consulting.',
    type: 'work'
  },
  {
    year: '2024',
    title: 'Completed Internship on AI/ML',
    company: 'Calicut UL Cyber Park',
    description: 'Gained hands-on experience in AI/ML technologies and their applications in real-world scenarios.',
    type: 'work'
  },
  {
    year: '2022',
    title: 'Bachelor of Computer Applications',
    company: 'St. Joseph\'s College (Autonomous), Devagiri, Calicut',
    description: 'Graduated with First Class with Distinction on 2025',
    type: 'education'
  },
];

// Personal interests
const interests = [
  { name: 'Coding', icon: FaCode, color: 'text-blue-500' },
  { name: 'Tea', icon: FaCoffee, color: 'text-yellow-600' },
  { name: 'Music', icon: FaMusic, color: 'text-purple-500' },
  { name: 'Gaming', icon: FaGamepad, color: 'text-green-500' },
  { name: 'Photography', icon: FaCamera, color: 'text-pink-500' },
  { name: 'Travel', icon: FaPlane, color: 'text-indigo-500' }
];

const About = () => {
  // Memoized typing texts for the title
  const typingTexts = useMemo(() => [
    'Full Stack Developer',
    'Mobile App Developer', 
    'Creative Problem Solver',
    'AI/ML Enthusiast'
  ], []);

  const aboutData = useMemo(() => ({
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    bio: 'I\'m a passionate Full Stack Developer with a strong foundation in modern web and mobile technologies. I enjoy creating elegant, efficient solutions that solve real-world problems.',
    location: 'Kozhikode, Kerala, India',
    email: 'ankithpratheesh147@gmail.com',
    phone: '+91 9495540233',
    experience: '0',
    projects: '10',
    ongoingProjects: '0',
    avatar: { url: '/images/Ankith.jpg' },
    socialLinks: {
      github: 'https://github.com/ankith5980',
      linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
      instagram: 'https://www.instagram.com/ankith.pm/',
    }
  }), []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };



  return (
    <div className="min-h-screen section-padding pt-28 sm:pt-32">
      <SEO 
        title="About Ankith Pratheesh Menon - Professional Background & Skills"
        description="Learn about Ankith Pratheesh Menon - Full Stack Developer and AI Specialist from Kerala, India with expertise in React, Next.js, Node.js, Python, and scalable distributed architectures. Educational background at St. Joseph's College (Autonomous), Devagiri and campus placement at Accenture."
        keywords="about Ankith Pratheesh Menon, Ankith biography, full-stack developer background, React developer Kerala, Node.js expert India, software engineer profile, web development experience, St. Joseph's College Devagiri graduate, Accenture placement, Next.js developer, AI engineer"
        url="/about"
        breadcrumbName="About"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": "About Ankith Pratheesh Menon",
          "description": "Professional background, skills, and career milestones of Ankith Pratheesh Menon - Full Stack Developer",
          "url": getFullUrl("/about"),
          "mainEntity": generatePersonSchema()
        }}
      />
      <div className="container mx-auto container-padding">

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden py-14 lg:py-20">
          <DisplayType solid="ABOUT" align="right" className="opacity-60" speed={50} />

          {/*
            The first column is sized to the portrait rather than a half-width
            track, so the copy starts right after the image instead of at the
            50% line — otherwise the leftover track reads as dead space.

            The left inset buys room for the portrait's corner brackets, which
            hang 12px outside the frame — and swing a little further out than
            that while the frame is tilted. Without it they sat exactly on the
            section's edge and the `overflow-hidden` above (there to contain the
            giant ABOUT lettering) sheared the left pair off.
          */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14 lg:pl-8"
          >
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <TiltPortrait
                src={aboutData.avatar?.url || '/images/Ankith.jpg'}
                alt={aboutData.fullName}
                width="360"
                height="480"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={{ width: 'clamp(230px, 58vw, 400px)' }}
              />
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <span className="eyebrow">Who I am</span>

              <h1 className="mb-4 mt-3 font-display font-bold uppercase leading-[0.9] tracking-tighter">
                <span className="text-outline-accent block italic" style={{ fontSize: 'clamp(2.25rem, 6vw, 4rem)' }}>
                  Ankith
                </span>
                <span className="block text-fg" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)' }}>
                  Pratheesh Menon
                </span>
              </h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mb-8 flex min-h-[3rem] items-center justify-center text-xl lg:justify-start lg:text-2xl"
              >
                <TypingEffect
                  texts={typingTexts}
                  speed={80}
                  deleteSpeed={40}
                  pauseTime={3000}
                />
              </motion.h2>

              {/* Quick Stats */}
              <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                {[
                  { value: aboutData.experience || '3+', label: 'Years Experience' },
                  { value: aboutData.projects || '50+', label: 'Projects Completed' },
                  { value: aboutData.ongoingProjects || '2+', label: 'Ongoing Projects' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-violet flex min-w-[110px] flex-1 flex-col justify-center rounded-2xl px-4 py-4 text-center transition-colors duration-300 hover:border-accent/40 lg:flex-none"
                  >
                    <div className="font-display text-3xl font-bold leading-none text-accent sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mb-8 space-y-3 text-sm lg:text-base">
                {[
                  { Icon: FaMapMarkerAlt, value: aboutData.location || 'Kerala, India' },
                  { Icon: FaEnvelope, value: aboutData.email || 'contact@ankith.dev' },
                  { Icon: FaPhone, value: aboutData.phone || '+91 9876543210' },
                ].map(({ Icon, value }) => (
                  <div key={value} className="flex items-center justify-center gap-3 text-muted lg:justify-start">
                    <Icon className="h-4 w-4 flex-shrink-0 text-accent" />
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  to="/contact"
                  className="btn-fill btn-fill-soft inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-soft"
                >
                  <FaEnvelope className="h-4 w-4" />
                  <span>Get In Touch</span>
                </Link>
                <a
                  href="/cv/My_Resume.pdf"
                  download="Ankith_Pratheesh_Menon_CV.pdf"
                  className="btn-fill btn-fill-accent inline-flex items-center gap-2 rounded-full border border-accent/50 px-6 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:text-white"
                >
                  <FaDownload className="h-4 w-4" />
                  <span>Download CV</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= STORY ================= */}
        <section className="relative overflow-hidden py-16">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Background</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              My <span className="text-accent">Story</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto max-w-4xl">
            <div className="glass-violet relative rounded-3xl p-8 sm:p-10">
              <span className="absolute left-8 top-0 h-px w-24 bg-gradient-to-r from-accent to-transparent" />
              <p className="mb-6 text-base leading-relaxed text-muted sm:text-lg">
                {aboutData.bio || `I'm a passionate full-stack developer with over 3 years of experience creating
                digital solutions that make a difference. My journey began with a curiosity about how websites work,
                and it has evolved into a career dedicated to building scalable, user-friendly applications.`}
              </p>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects,
                or sharing knowledge with the developer community. I believe in continuous learning and staying
                updated with the latest industry trends.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ================= TECH STACK ================= */}
        <section className="relative overflow-hidden py-16">
          <DisplayType solid="STACK" align="left" className="opacity-60" speed={40} slideIn={false} />

          <Reveal className="relative z-10 mb-12 text-center">
            <span className="eyebrow">Toolkit</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {/* <FaCode className="mr-3 inline-block text-accent" /> */}
              Technologies &amp; <span className="text-accent">Skills</span>
            </h2>
          </Reveal>

          <RevealGroup stagger={0.04} className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {techStack.map((tech) => (
              <RevealItem
                key={tech.name}
                className="glass-violet group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-soft sm:p-6"
              >
                <tech.icon className={`mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12 ${tech.color} transition-transform duration-300 group-hover:scale-110`} />
                <h3 className="font-display text-sm font-semibold text-fg sm:text-base">{tech.name}</h3>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ================= TIMELINE ================= */}
        <section className="relative overflow-hidden py-16">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Journey</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {/* <FaBriefcase className="mr-3 inline-block text-accent" /> */}
              Experience &amp; <span className="text-accent">Education</span>
            </h2>
          </Reveal>

          <div className="relative mx-auto max-w-4xl">
            {/* Continuous violet rail */}
            <span className="absolute left-5 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:block" />

            <RevealGroup stagger={0.12} className="space-y-6">
              {timeline.map((item, index) => (
                <RevealItem key={index} className="relative flex items-start gap-5">
                  {/* Node */}
                  <div
                    className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm text-white shadow-soft ${
                      item.type === 'work' ? 'bg-accent' : 'bg-accent/60'
                    }`}
                  >
                    {item.type === 'work' ? <FaBriefcase /> : <FaGraduationCap />}
                  </div>

                  {/* Content */}
                  <div className="glass-violet flex-1 rounded-2xl p-5 transition-colors duration-300 hover:border-accent/40 sm:p-6">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-fg sm:text-xl">{item.title}</h3>
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-display text-xs font-semibold text-accent">
                        {item.year}
                      </span>
                    </div>
                    <h4 className="mb-2 font-semibold text-accent">{item.company}</h4>
                    <p className="text-sm leading-relaxed text-muted sm:text-base">{item.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ================= INTERESTS ================= */}
        <section className="relative overflow-hidden py-16">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Off the clock</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              {/* <FaHeart className="mr-3 inline-block text-red-500" /> */}
              Personal <span className="text-accent">Interests</span>
            </h2>
          </Reveal>

          <RevealGroup stagger={0.06} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {interests.map((interest) => (
              <RevealItem
                key={interest.name}
                className="glass-violet group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-soft sm:p-6"
              >
                <interest.icon className={`mx-auto mb-3 h-8 w-8 ${interest.color} transition-transform duration-300 group-hover:scale-125`} />
                <h3 className="font-display text-sm font-semibold text-fg">{interest.name}</h3>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-accent/30 p-8 text-center lg:p-14">
              {/* Violet field */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'linear-gradient(135deg, rgb(var(--accent) / 0.9), rgb(var(--accent) / 0.55) 45%, rgb(var(--accent-soft) / 0.85))',
                }}
              />
              <div
                className="absolute inset-0 -z-10 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              <AccentDot className="right-8 top-8" size={10} />

              <h2 className="mb-4 font-display text-3xl font-bold uppercase tracking-tight text-white lg:text-5xl">
                Let&apos;s Work Together!
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base text-white/90 lg:text-xl">
                Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="btn-fill btn-fill-accent inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors duration-200 hover:text-white"
                >
                  <FaEnvelope className="h-4 w-4" />
                  <span>Start a Conversation</span>
                </Link>
                <Link
                  to="/projects"
                  className="btn-fill btn-fill-white inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:text-[#0A0A0A]"
                >
                  <FaRocket className="h-4 w-4" />
                  <span>View My Work</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================= SOCIALS ================= */}
        <Reveal className="flex justify-center gap-4 py-8">
          {[
            { href: aboutData.socialLinks?.github, Icon: FaGithub, label: 'GitHub' },
            { href: aboutData.socialLinks?.linkedin, Icon: FaLinkedin, label: 'LinkedIn' },
            { href: aboutData.socialLinks?.instagram, Icon: FaInstagram, label: 'Instagram' },
          ].filter((s) => s.href).map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="btn-fill btn-fill-accent flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface text-muted transition-all duration-200 hover:border-accent/60 hover:text-white hover:shadow-soft"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </Reveal>
      </div>
    </div>
  );
};

export default About;