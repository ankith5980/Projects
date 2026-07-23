import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane, FaSpinner, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
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
        <div className="fixed bottom-8 right-8 bg-red-50 text-red-600 border border-red-500 p-4 rounded-xl z-[9999] shadow-2xl max-w-[350px] overflow-auto max-h-[300px] text-xs">
          <h3 className="font-bold text-sm mb-2">ChatWidget React Error</h3>
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

const MAX_MESSAGE_LENGTH = 500;
const MAX_CONVERSATION_LENGTH = 20;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rate limit state
  const [rateLimitInfo, setRateLimitInfo] = useState(null); // { message, retryAfterMs, expiresAt }
  const rateLimitTimerRef = useRef(null);

  // Clear rate limit timer on unmount
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
      // Force re-render for countdown
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

  const sendMessage = async ({ role, content }) => {
    // Check if rate limited
    if (rateLimitInfo && Date.now() < rateLimitInfo.expiresAt) {
      return;
    }

    // Enforce conversation limit
    if (messages.length >= MAX_CONVERSATION_LENGTH * 2) {
      setRateLimitInfo({
        message: 'Conversation limit reached. Please refresh to start a new conversation.',
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

      // Handle rate limiting
      if (res.status === 429) {
        const errorData = await res.json();
        const retryAfterMs = errorData.retryAfterMs || 15 * 60 * 1000;
        setRateLimitInfo({
          message: errorData.message || 'Rate limit exceeded. Please wait before trying again.',
          retryAfterMs,
          expiresAt: Date.now() + retryAfterMs,
        });
        // Remove the user message that wasn't processed
        setMessages(messages);
        setIsLoading(false);
        return;
      }

      if (!res.ok) throw new Error('API Error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
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

  const messagesContainerRef = useRef(null);

  // Scroll to bottom of messages only if user is near the bottom
  const scrollToBottom = (force = false) => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: force ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    // When a new message is added (length changes), force scroll
    scrollToBottom(true);
  }, [messages.length]);

  useEffect(() => {
    // During streaming (content changes), only auto-scroll if already at bottom
    scrollToBottom(false);
  }, [messages]);

  const isRateLimited = rateLimitInfo && Date.now() < rateLimitInfo.expiresAt;

  return (
    <>
      {/* Floating Button */}
      {/*
        Fixed at bottom-right. ScrollToTop now lives at bottom-left, so this no
        longer needs to shift out of its way — and animating `bottom` would have
        cost a layout pass on every scroll.
      */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-soft-lg transition-shadow duration-300"
              style={{
                background: 'linear-gradient(140deg, rgb(var(--accent-soft)), rgb(var(--accent)))',
              }}
              aria-label="Open AI Chat"
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
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-4 sm:right-8 z-50 w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col glass-violet-strong rounded-2xl overflow-hidden"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-accent/10 border-b border-hairline">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-inner">
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-fg">Ask Zyra</h3>
                  <p className="text-xs text-muted">Pleased to help you</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted hover:text-accent rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Rate Limit Alert */}
            <AnimatePresence>
              {isRateLimited && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-start space-x-2">
                    <FaExclamationTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                        {rateLimitInfo.message}
                      </p>
                      {rateLimitInfo.retryAfterMs > 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
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
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 relative custom-scrollbar select-text"
              style={{ overscrollBehavior: 'contain' }}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-muted p-6 absolute inset-0">
                  <FaRobot className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Hi! I'm Zyra, Ankith's AI assistant. How can I help you today?</p>
                </div>
              ) : null}
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-full relative z-10",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm flex gap-3 shadow-sm",
                      message.role === 'user'
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-surface-2 text-fg rounded-bl-sm"
                    )}
                  >
                    {message.role !== 'user' && (
                       <FaRobot className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                    )}
                    <span className="leading-relaxed whitespace-pre-wrap">{message.content}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start w-full relative z-10">
                  <div className="bg-surface-2 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-2 shadow-sm">
                    <FaSpinner className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm text-muted">Zyra is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-hairline bg-surface-2 p-4">
              {/* Character count */}
              {localInput.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <div className={cn(
                  "text-xs mb-1 text-right",
                  localInput.length >= MAX_MESSAGE_LENGTH ? "text-red-500" : "text-amber-500"
                )}>
                  {localInput.length}/{MAX_MESSAGE_LENGTH}
                </div>
              )}
              <form
                onSubmit={handleFormSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  placeholder={isRateLimited ? "Rate limited — please wait..." : "Ask about Ankith's projects, skills..."}
                  className="w-full rounded-full border border-hairline bg-surface py-3 pl-4 pr-12 text-sm text-fg transition-all placeholder:text-muted focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  disabled={isLoading || isRateLimited}
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput || localInput.trim() === '' || isRateLimited}
                  className="absolute right-2 rounded-full bg-accent p-2 text-white shadow-soft transition-all active:scale-95 disabled:opacity-40 disabled:shadow-none"
                >
                  <FaPaperPlane className="w-4 h-4 ml-0.5" />
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
