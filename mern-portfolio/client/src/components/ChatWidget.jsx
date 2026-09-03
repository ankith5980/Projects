import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCommentDots, 
  FaTimes, 
  FaPaperPlane, 
  FaSpinner, 
  FaRobot, 
  FaExclamationTriangle,
  FaRedoAlt
} from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-8 right-8 z-[9999] max-h-[300px] max-w-[350px] overflow-auto rounded-xl border border-red-500 bg-red-50 p-4 text-xs text-red-600 shadow-2xl">
          <h3 className="mb-2 text-sm font-bold">Chat Error</h3>
          <pre className="whitespace-pre-wrap">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Lightweight Markdown & Contact Hyperlink Formatter
const parseInlineFormatting = (text) => {
  if (!text) return null;
  // Match markdown links [Label](url), bold **bold**, code `code`, resume paths, raw URLs, emails, and phone numbers
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\/cv\/My_Resume\.pdf|https?:\/\/[^\s)\]]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\+91[\s-]?[0-9]{10})/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    // 1. Markdown link [Label](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const label = match[1];
        const href = match[2];
        const isDownload = href.endsWith('.pdf') || href.includes('/cv/');
        const isMailOrTel = href.startsWith('mailto:') || href.startsWith('tel:');

        return (
          <a
            key={i}
            href={href}
            download={isDownload ? "Ankith_Pratheesh_Menon_Resume.pdf" : undefined}
            target={isMailOrTel ? undefined : "_blank"}
            rel={isMailOrTel ? undefined : "noopener noreferrer"}
            className="inline-flex items-center font-semibold text-accent underline underline-offset-2 transition-colors hover:text-white"
            title={isDownload ? "Click to download resume" : undefined}
          >
            {label}
          </a>
        );
      }
    }

    // 2. Bold **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[11px] text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 4. Raw resume download link /cv/My_Resume.pdf
    if (part === '/cv/My_Resume.pdf') {
      return (
        <a
          key={i}
          href="/cv/My_Resume.pdf"
          download="Ankith_Pratheesh_Menon_Resume.pdf"
          className="inline-flex items-center font-semibold text-accent underline underline-offset-2 transition-colors hover:text-white"
          title="Click to download resume"
        >
          Download Resume
        </a>
      );
    }

    // 5. Raw Email address
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="inline-flex items-center font-semibold text-accent underline underline-offset-2 transition-colors hover:text-white"
          title="Click to send email"
        >
          {part}
        </a>
      );
    }

    // 6. Raw Phone number (+91 ...)
    if (/^\+91[\s-]?[0-9]{5}[\s-]?[0-9]{5}$|^\+91[\s-]?[0-9]{10}$/.test(part)) {
      const cleanPhone = part.replace(/\s+/g, '');
      return (
        <a
          key={i}
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center font-semibold text-accent underline underline-offset-2 transition-colors hover:text-white"
          title="Click to call"
        >
          {part}
        </a>
      );
    }

    // 7. Raw URLs (GitHub, LinkedIn, Instagram, or Web)
    if (/^https?:\/\//.test(part)) {
      let label = part;
      if (part.includes('linkedin.com')) label = 'LinkedIn Profile';
      else if (part.includes('github.com')) label = 'GitHub Profile';
      else if (part.includes('instagram.com')) label = 'Instagram Profile';

      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-semibold text-accent underline underline-offset-2 transition-colors hover:text-white"
        >
          {label}
        </a>
      );
    }

    return part;
  });
};

const FormattedMessage = ({ content }) => {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point lines
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="flex-1">{parseInlineFormatting(bulletText)}</span>
            </div>
          );
        }

        return <p key={idx}>{parseInlineFormatting(line)}</p>;
      })}
    </div>
  );
};

const MAX_MESSAGE_LENGTH = 500;
const MAX_CONVERSATION_LENGTH = 20;

// Suggestion topics (Text only, clean styling)
const SUGGESTION_CHIPS = [
  { label: 'Featured Projects', query: "What are Ankith's featured projects?" },
  { label: 'Tech Stack & Skills', query: 'What technical skills and tools does Ankith specialize in?' },
  { label: 'Experience', query: "Tell me about Ankith's professional experience and education." },
  { label: 'Contact & Resume', query: 'How can I contact Ankith or download his resume?' },
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rate limit state
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const rateLimitTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rateLimitTimerRef.current) clearInterval(rateLimitTimerRef.current);
    };
  }, []);

  // Countdown timer for rate limit
  useEffect(() => {
    if (!rateLimitInfo) return;

    const tick = () => {
      const remaining = rateLimitInfo.expiresAt - Date.now();
      if (remaining <= 0) {
        setRateLimitInfo(null);
        if (rateLimitTimerRef.current) clearInterval(rateLimitTimerRef.current);
        return;
      }
      setRateLimitInfo(prev => prev ? { ...prev } : null);
    };

    rateLimitTimerRef.current = setInterval(tick, 1000);
    return () => {
      if (rateLimitTimerRef.current) clearInterval(rateLimitTimerRef.current);
    };
  }, [rateLimitInfo?.expiresAt]);

  const formatTimeRemaining = useCallback(() => {
    if (!rateLimitInfo) return '';
    const remaining = Math.max(0, rateLimitInfo.expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [rateLimitInfo]);

  // Scroll to bottom
  const scrollToBottom = (force = false) => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 120;
    
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: force ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  const sendMessage = async ({ role, content }) => {
    if (rateLimitInfo && Date.now() < rateLimitInfo.expiresAt) return;

    if (messages.length >= MAX_CONVERSATION_LENGTH * 2) {
      setRateLimitInfo({
        message: 'Conversation limit reached. Please reset to start a new chat.',
        retryAfterMs: 0,
        expiresAt: Date.now(),
      });
      return;
    }

    const newMessages = [...messages, { id: Date.now().toString(), role, content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.status === 429) {
        const errorData = await res.json();
        const retryAfterMs = errorData.retryAfterMs || 15 * 60 * 1000;
        setRateLimitInfo({
          message: errorData.message || 'Rate limit reached. Please wait before asking more questions.',
          retryAfterMs,
          expiresAt: Date.now() + retryAfterMs,
        });
        setMessages(messages);
        setIsLoading(false);
        return;
      }

      if (!res.ok) throw new Error('API Error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessageId ? { ...m, content: assistantContent } : m
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!localInput || localInput.trim() === '') return;
    if (rateLimitInfo && Date.now() < rateLimitInfo.expiresAt) return;
    const currentInput = localInput.slice(0, MAX_MESSAGE_LENGTH);
    setLocalInput('');
    sendMessage({ role: 'user', content: currentInput });
  };

  const handleClearChat = () => {
    setMessages([]);
    setLocalInput('');
    setRateLimitInfo(null);
  };

  const isRateLimited = rateLimitInfo && Date.now() < rateLimitInfo.expiresAt;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="btn-fill btn-fill-soft flex h-14 w-14 items-center justify-center rounded-full text-white shadow-soft-lg transition-shadow duration-300"
              style={{
                background: 'linear-gradient(140deg, rgb(var(--accent-soft)), rgb(var(--accent)))',
              }}
              aria-label="Open Zyra AI Assistant"
            >
              <FaCommentDots className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex h-[560px] max-h-[82vh] w-[92vw] sm:w-[420px] flex-col overflow-hidden rounded-2xl glass-violet-strong shadow-2xl border border-hairline"
            data-lenis-prevent="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface/70 px-4 py-3.5 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-soft">
                  <FaRobot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-fg">Zyra</h3>
                  <p className="text-[11px] text-muted">Portfolio AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                    className="btn-fill btn-fill-accent flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-white"
                  >
                    <FaRedoAlt className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="btn-fill btn-fill-accent flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:text-white"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Rate Limit Alert */}
            <AnimatePresence>
              {isRateLimited && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5"
                >
                  <div className="flex items-start space-x-2">
                    <FaExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-amber-400">
                        {rateLimitInfo.message}
                      </p>
                      {rateLimitInfo.retryAfterMs > 0 && (
                        <p className="mt-0.5 text-[11px] text-amber-300/80">
                          Try again in <span className="font-mono font-bold">{formatTimeRemaining()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="relative flex-1 min-h-0 overflow-y-auto p-4 space-y-4 select-text"
              style={{ overscrollBehavior: 'contain' }}
              data-lenis-prevent="true"
            >
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-hairline bg-accent/15 text-accent shadow-soft">
                    <FaRobot className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-semibold text-fg">Hi! I&apos;m Zyra</h4>
                  <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-muted">
                    I&apos;m Ankith&apos;s AI assistant. Ask me anything about his projects, skills, background, or contact details.
                  </p>

                  {/* Suggestion Chips */}
                  <div className="mt-6 flex w-full flex-col gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
                      Suggested Topics
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTION_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => sendMessage({ role: 'user', content: chip.query })}
                          className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:border-accent/50 hover:bg-accent/10 hover:text-fg active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full relative z-10",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'user' ? (
                    <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white shadow-sm leading-relaxed">
                      {message.content}
                    </div>
                  ) : (
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-hairline bg-surface px-4 py-3 text-sm text-fg shadow-sm flex gap-2.5 items-start">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        <FaRobot className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <FormattedMessage content={message.content} />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start w-full relative z-10">
                  <div className="border border-hairline bg-surface rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-2 shadow-sm">
                    <FaSpinner className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-xs text-muted">Zyra is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-hairline bg-surface/80 p-3.5 backdrop-blur-md">
              {localInput.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <div className={cn(
                  "text-[10px] mb-1 text-right font-mono",
                  localInput.length >= MAX_MESSAGE_LENGTH ? "text-red-500" : "text-amber-500"
                )}>
                  {localInput.length}/{MAX_MESSAGE_LENGTH}
                </div>
              )}
              <form
                onSubmit={handleFormSubmit}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  placeholder={isRateLimited ? "Rate limit reached — please wait..." : "Ask about Ankith's projects, skills..."}
                  className="min-w-0 flex-1 rounded-full border border-hairline bg-surface py-2.5 px-4 text-sm text-fg transition-all placeholder:text-muted focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  disabled={isLoading || isRateLimited}
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput || localInput.trim() === '' || isRateLimited}
                  aria-label="Send message"
                  className="btn-fill btn-fill-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-soft transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
                >
                  <FaPaperPlane className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function SafeChatWidget(props) {
  return (
    <ChatErrorBoundary>
      <ChatWidget {...props} />
    </ChatErrorBoundary>
  );
}
