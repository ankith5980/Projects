const express = require('express');
const router = express.Router();
const { streamText } = require('ai');
const { huggingface } = require('@ai-sdk/huggingface');
const rateLimit = require('express-rate-limit');

// Chat-specific rate limiter: 15 requests per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfter = res.getHeader('Retry-After');
    const retryAfterMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 15 * 60 * 1000;
    res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'You have reached the limit of chat queries for now. Please wait before asking more.',
      retryAfterMs: retryAfterMs,
    });
  },
});

// Simple HTML sanitizer — strips all HTML tags
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
};

// Input validation middleware
const validateChatInput = (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array is required.' });
  }

  if (messages.length > 25) {
    return res.status(400).json({ error: 'Conversation limit reached. Please start a fresh conversation.' });
  }

  // Validate and sanitize each message
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg.role || !msg.content) {
      return res.status(400).json({ error: `Invalid message at index ${i}: role and content are required.` });
    }
    if (typeof msg.content !== 'string') {
      return res.status(400).json({ error: `Invalid message at index ${i}: content must be a string.` });
    }
    if (msg.role === 'user' && msg.content.length > 600) {
      return res.status(400).json({ error: `User message at index ${i} exceeds maximum allowed length.` });
    }
    messages[i].content = sanitizeInput(msg.content);
  }

  next();
};

// Complete and Structured Portfolio Knowledge Base for Zyra
const PORTFOLIO_DATA = {
  about: {
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer & AI Specialist',
    location: 'Kozhikode, Kerala, India',
    email: 'ankithpratheesh147@gmail.com',
    phone: '+91 9495540233',
    github: 'https://github.com/ankith5980',
    linkedin: 'https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/',
    instagram: 'https://www.instagram.com/ankith.pm/',
    resumeUrl: '/cv/My_Resume.pdf',
    summary: 'Ankith is a passionate Full Stack Developer and AI enthusiast specializing in modern scalable web systems, agentic AI workflows, and cross-platform mobile apps.',
    educationAndCareer: [
      {
        year: '2025 – Present',
        title: 'Master of Computer Applications (MCA)',
        institution: "St. Joseph's College (Autonomous), Devagiri, Calicut",
        details: 'Pursuing advanced studies in computer applications, distributed systems, and modern software architectures.'
      },
      {
        year: '2025',
        title: 'Campus Placement Acquired at Accenture',
        institution: 'Accenture',
        details: 'Successfully secured campus placement at Accenture as an Associate Software Engineer.'
      },
      {
        year: '2024',
        title: 'Internship on AI/ML',
        institution: 'Calicut UL Cyber Park',
        details: 'Hands-on practical development with machine learning algorithms, model evaluation, and dataset feature engineering.'
      },
      {
        year: '2022 – 2025',
        title: 'Bachelor of Computer Applications (BCA)',
        institution: "St. Joseph's College (Autonomous), Devagiri, Calicut",
        details: 'Graduated with First Class with Distinction.'
      }
    ],
    skills: {
      frontend: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'Flutter', 'HTML5', 'CSS3'],
      backend: ['Node.js', 'Express.js', 'FastAPI', 'Django', 'PHP', 'Socket.io', 'RESTful APIs'],
      databases: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase', 'MySQL', 'Supabase'],
      aiAndTools: ['LangGraph', 'Ollama', 'Claude Code', 'Docker', 'Git', 'AWS', 'PowerBI', 'Figma', 'Postman', 'Playwright', 'Scikit-learn', 'FAISS']
    }
  },
  projects: [
    {
      name: 'Personal Portfolio Website',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion'],
      liveUrl: 'https://portfolio-ankith.vercel.app',
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/mern-portfolio',
      description: 'A modern, responsive personal portfolio with a refined dark violet aesthetic, interactive hero type animation, showcase of achievements, and Zyra AI conversational integration.'
    },
    {
      name: 'Skill-Swap : A Skill Exchange Platform',
      technologies: ['TypeScript', 'MongoDB', 'Socket.io', 'Express.js'],
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/skill-exchange',
      description: 'A production-ready peer-to-peer skill exchange platform allowing users to share skills, earn points, and learn from others with real-time WebSocket communications.'
    },
    {
      name: 'AI Multi-Agent Research System',
      technologies: ['Python', 'LangGraph', 'FAISS', 'FastAPI', 'Next.js'],
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/multi-agent-research-system',
      description: 'A fully local, decoupled AI multi-agent architecture where agents collaborate via a graph-based state machine to autonomously conduct deep topic research, query vector databases, and synthesize structured research reports.'
    },
    {
      name: 'NEXUS AI Fraud Vanguard',
      technologies: ['Docker', 'Scikit-learn', 'Kafka', 'Redis', 'FastAPI'],
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-fraud-detection',
      description: 'A real-time financial fraud detection pipeline using high-throughput Kafka streaming, Redis in-memory feature caching, and machine learning classification to flag suspicious activity.'
    },
    {
      name: 'Automated AI Data Analyst',
      technologies: ['Python', 'Next.js', 'Ollama', 'FastAPI', 'LangGraph'],
      githubUrl: 'https://github.com/ankith5980/Projects/tree/main/ai-data-analysis-system',
      description: 'An AI-powered data exploration engine enabling users to upload datasets and automatically perform exploratory data analysis (EDA), generate data visual charts, and answer queries in natural language.'
    },
    {
      name: 'Context-Aware Accessibility Linter (CAAL)',
      technologies: ['Node.js', 'Playwright', 'Browser Extension API', 'AI DOM Analysis', 'React', 'LLM API'],
      githubUrl: 'https://github.com/ankith5980/Mini_Project/tree/main/DTP_CAAL',
      description: 'An AI-augmented developer tool and CI/CD integration designed to evaluate live DOM context to detect and automatically remediate accessibility (a11y) defects across web applications.'
    }
  ],
  certificates: [
    { title: 'Python Programming with Django', issuer: 'RISS Technologies' },
    { title: 'Flutter and Dart Certified Developer Program', issuer: 'Maitexa Info Solutions LLP' },
    { title: 'Figma UI/UX Design Mastery', issuer: 'TECHBYHEART' },
    { title: 'Python for Data Science and Machine Learning', issuer: 'Maitexa Info Solutions LLP' }
  ]
};

router.post('/', chatLimiter, validateChatInput, async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Format structured knowledge for system prompt with markdown hyperlinks
    const portfolioContext = `PORTFOLIO CONTEXT:

### ABOUT ANKITH & DIRECT CONTACT CHANNELS ###
Name: ${PORTFOLIO_DATA.about.fullName}
Role: ${PORTFOLIO_DATA.about.title}
Location: ${PORTFOLIO_DATA.about.location}
Resume Link: [Download Resume](/cv/My_Resume.pdf)
Email: [ankithpratheesh147@gmail.com](mailto:ankithpratheesh147@gmail.com)
Phone: [+91 9495540233](tel:+919495540233)
LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/)
GitHub: [GitHub Profile](https://github.com/ankith5980)
Instagram: [Instagram Profile](https://www.instagram.com/ankith.pm/)
Summary: ${PORTFOLIO_DATA.about.summary}

### EDUCATION & CAREER ###
${PORTFOLIO_DATA.about.educationAndCareer.map(item => `- ${item.year}: ${item.title} at ${item.institution}. ${item.details}`).join('\n')}

### TECHNICAL SKILLS ###
- Frontend: ${PORTFOLIO_DATA.about.skills.frontend.join(', ')}
- Backend: ${PORTFOLIO_DATA.about.skills.backend.join(', ')}
- Databases: ${PORTFOLIO_DATA.about.skills.databases.join(', ')}
- AI & Tools: ${PORTFOLIO_DATA.about.skills.aiAndTools.join(', ')}

### ACTIVE PROJECTS ###
${PORTFOLIO_DATA.projects.map(p => `- ${p.name} (${p.technologies.join(', ')}): ${p.description} [[GitHub Repository](${p.githubUrl})]${p.liveUrl ? ` [[Live Demo](${p.liveUrl})]` : ''}`).join('\n')}

### CERTIFICATES ###
${PORTFOLIO_DATA.certificates.map(c => `- ${c.title} issued by ${c.issuer}`).join('\n')}
`;

    const systemInstruction = `You are Zyra, an intelligent, professional, and courteous AI assistant representing Ankith Pratheesh Menon on his personal portfolio website.

CORE ROLE:
Your task is to answer inquiries about Ankith's background, technical skills, projects, career experience, education, and professional contact details accurately and concisely using ONLY the provided PORTFOLIO CONTEXT.

STRICT BOUNDARIES & GUARDRAILS:
1. STRICTLY NO CODE GENERATION & NO PROGRAMMING TUTORIALS:
   You are strictly forbidden from writing code, generating code snippets, explaining generic programming algorithms, solving coding problems, or providing code solutions. If a user asks for code, programming assistance, or coding questions, you MUST respond:
   "I cannot generate code or solve programming tasks. I am here solely to share information about Ankith's portfolio, projects, and professional background."
   Never output any code, pseudo-code, or programming tutorials.
2. NO OFF-TOPIC OR UNNECESSARY CONVERSATIONS:
   Do not engage in casual chitchat, debate opinions, discuss politics/news, or answer general trivia. If asked about an unrelated topic, decline politely:
   "I am dedicated solely to discussing Ankith's work and professional background. Feel free to ask about his projects, skills, or experience!"
3. THIRD-PERSON PERSPECTIVE:
   Always speak about Ankith in the third person ("he", "him", "his", "Ankith"). You are his assistant, not Ankith.
4. NO REPETITIVE GREETINGS:
   Do NOT start every message with "Thank you for asking" or "Welcome to the portfolio". Jump directly into the answer.
5. MANDATORY HYPERLINK FORMATTING FOR CONTACT & RESUME (VERY IMPORTANT):
   Whenever you mention contact information, social links, or his resume, you MUST format them as functional markdown hyperlinks with descriptive anchor text. NEVER output plain URLs or file paths:
   - For Resume: ALWAYS format as [Download Resume](/cv/My_Resume.pdf) — NEVER write raw "/cv/My_Resume.pdf" or "Resume URL:".
   - For Email: ALWAYS format as [ankithpratheesh147@gmail.com](mailto:ankithpratheesh147@gmail.com).
   - For Phone: ALWAYS format as [+91 9495540233](tel:+919495540233).
   - For LinkedIn: ALWAYS format as [LinkedIn Profile](https://www.linkedin.com/in/ankith-pratheesh-menon-0353662b6/).
   - For GitHub: ALWAYS format as [GitHub Profile](https://github.com/ankith5980).
   - For Instagram: ALWAYS format as [Instagram Profile](https://www.instagram.com/ankith.pm/).

${portfolioContext}`;

    // Token & Latency Optimization: prune conversation history to last 8 messages
    const trimmedMessages = messages.slice(-8);

    // Call primary model (Llama-3.1-8B-Instruct on Hugging Face)
    let result;
    try {
      result = await streamText({
        model: huggingface('meta-llama/Llama-3.1-8B-Instruct'),
        system: systemInstruction,
        messages: trimmedMessages,
        temperature: 0.5,
      });
    } catch (primaryErr) {
      console.warn('Primary model failed, attempting fallback Llama-3.2-3B:', primaryErr.message);
      // Fallback model in case of primary model queue or cold start
      result = await streamText({
        model: huggingface('meta-llama/Llama-3.2-3B-Instruct'),
        system: systemInstruction,
        messages: trimmedMessages,
        temperature: 0.5,
      });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    for await (const textPart of result.textStream) {
      if (textPart) {
        res.write(textPart);
      }
    }
    res.end();
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

module.exports = router;
