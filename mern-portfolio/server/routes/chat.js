const express = require('express');
const router = express.Router();
const { streamText } = require('ai');
const { huggingface } = require('@ai-sdk/huggingface');

// Hardcoded Portfolio Data for the AI context since the MongoDB isn't fully populated yet.
const PORTFOLIO_DATA = {
  about: {
    fullName: 'Ankith Pratheesh Menon',
    title: 'Full Stack Developer',
    timeline: [
      { year: '2025', title: 'Pursuing Master of Computer Applications', company: "St. Joseph's College", description: 'Pursuing advanced studies in computer applications.' },
      { year: '2025', title: 'Acquired Campus Placement', company: 'Accenture', description: 'Acquired campus placement at Accenture.' },
      { year: '2024', title: 'Completed Internship on AI/ML', company: 'Calicut UL Cyber Park', description: 'Gained hands-on experience in AI/ML technologies.' },
      { year: '2022', title: 'Bachelor of Computer Applications', company: "St. Joseph's College", description: 'Graduated with First Class with Distinction on 2025.' }
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'JavaScript', 'Python', 'Django', 'Flutter', 'Power BI', 'HTML', 'PHP', 'MySQL', 'NumPy', 'Pandas', 'TensorFlow', 'Scikit-Learn', 'Docker', 'Git', 'Tailwind', 'Express', 'Figma']
  },
  projects: [
    { title: 'Personal Portfolio Website', tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Framer Motion'], desc: 'A modern, responsive portfolio website built with the MERN stack featuring dark mode, animations, and admin dashboard.' },
    { title: 'KOHA Library Management System', tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'], desc: 'Continuous Development of KOHA Library Management System.' },
    { title: 'Club Management System - Rotary Club of Calicut South', tech: ['React', 'MongoDB Atlas', 'Tailwind CSS','Docker'], desc: 'A comprehensive club management system designed to streamline operations, member management, and event planning.' },
    { title: 'ICCIET 2025 Judging Portal', tech: ['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript'], desc: 'A judging portal for the International Conference on Computational Intelligence & Emerging Technologies (ICCIET) 2025. Co-developed by Ayush VP and Ankith Pratheesh Menon.' },
    { title: 'Skill-Swap : A Skill Exchange Platform', tech: ['TypeScript', 'MongoDB', 'Socket.io', 'Express.js'], desc: 'A production-ready full-stack web application for peer-to-peer skill exchange.' },
    { title: 'AI Multi-Agent Research System', tech: ['Next.js', 'Python', 'LangGraph', 'FAISS', 'FastAPI'], desc: 'A fully local, decoupled AI system where multiple agents collaborate using a graph-based state machine to autonomously research topics.' },
    { title: 'NEXUS AI Fraud Vanguard', tech: ['Docker', 'Scikit-learn', 'Kafka', 'Redis', 'FastAPI'], desc: 'An AI-powered fraud detection system that leverages advanced machine learning algorithms and real-time data analysis.' },
    { title: 'Automated AI Data Analyst', tech: ['Python', 'Next.js', 'Ollama', 'FastAPI', 'LangGraph'], desc: 'An AI-powered data analysis and visualization tool that enables users to upload datasets and perform exploratory data analysis.' }
  ],
  certificates: [
    { title: 'Python Programming with Django', issuer: 'RISS Technologies' },
    { title: 'Flutter and Dart Certified Developer Program', issuer: 'Maitexa Info Solutions LLP' },
    { title: 'Figma UI/UX Design Mastery', issuer: 'TECHBYHEART' }
  ]
};

// Initialize the huggingface provider implicitly using process.env.HUGGINGFACE_API_KEY

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Construct text representation of the portfolio data
    const portfolioContext = `PORTFOLIO CONTEXT:

### ABOUT Ankith ###
Name: ${PORTFOLIO_DATA.about.fullName}
Title: ${PORTFOLIO_DATA.about.title}
Skills: ${PORTFOLIO_DATA.about.skills.join(', ')}

### EXPERIENCE & EDUCATION ###
${PORTFOLIO_DATA.about.timeline.map(t => `- ${t.year}: ${t.title} at ${t.company}. ${t.description}`).join('\n')}

### PROJECTS ###
${PORTFOLIO_DATA.projects.map(p => `- ${p.title} (${p.tech.join(', ')}): ${p.desc}`).join('\n')}

### CERTIFICATES ###
${PORTFOLIO_DATA.certificates.map(c => `- ${c.title} by ${c.issuer}`).join('\n')}
`;

    const systemInstruction = `You are Zyra a helpful, professional, and friendly AI assistant named Ankith AI on Ankith's portfolio website. 
Your strict rule is to answer questions ONLY according to the contents, skills, projects, and background presented in the provided PORTFOLIO CONTEXT. 
Always refer to Ankith in the third person (using "he", "him", "his", or "Ankith"). Never use first-person pronouns (like "I" or "my") when discussing Ankith's skills, projects, or background, because you are his AI assistant, not Ankith himself.
Never make up or invent information about Ankith. If a user asks about a project, skill, or certificate not listed in the PORTFOLIO CONTEXT, state clearly that it is not part of Ankith's current portfolio.
If a user asks a general question that is outside the scope of Ankith's portfolio or professional background, politely decline to answer and redirect them to ask about Ankith's work.
Always start your response with a brief polite, friendly, or welcoming statement (e.g., thanking them for their question or welcoming them to the portfolio).
Keep your answers concise, helpful, and engaging.

${portfolioContext}`;

    const result = await streamText({
      model: huggingface('meta-llama/Llama-3.1-8B-Instruct'),
      system: systemInstruction,
      messages,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Removing X-Vercel-AI-Data-Stream since we will parse it manually
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
