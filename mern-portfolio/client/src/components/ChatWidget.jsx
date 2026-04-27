import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane, FaSpinner, FaRobot } from 'react-icons/fa';
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

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async ({ role, content }) => {
    const newMessages = [...messages, { id: Date.now().toString(), role, content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

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
    const currentInput = localInput;
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

  // Listen to scroll to adjust position when scroll-to-top button appears
  useEffect(() => {
    const toggleScrollState = () => {
      setIsScrolled(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleScrollState);
    // initial check
    toggleScrollState();
    return () => window.removeEventListener('scroll', toggleScrollState);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed right-8 z-50 flex flex-col items-end"
        initial={false}
        animate={{
          bottom: isOpen ? "2rem" : isScrolled ? "6rem" : "2rem",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl border border-primary-500/30 transition-colors duration-300 flex items-center justify-center"
              aria-label="Open AI Chat"
            >
              <FaCommentDots className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-4 sm:right-8 z-50 w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary-600/10 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-inner">
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Ask Zyra</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pleased to help you</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 relative custom-scrollbar select-text"
              style={{ overscrollBehavior: 'contain' }}
            >
              {messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-500 dark:text-gray-400 p-6 absolute inset-0">
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
                        ? "bg-primary-600 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
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
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-2 shadow-sm">
                    <FaSpinner className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Zyra is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
              <form
                onSubmit={handleFormSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Ask about Ankith's projects, skills..."
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm border border-transparent focus:border-primary-500/30"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput || localInput.trim() === ''}
                  className="absolute right-2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all shadow-md active:scale-95"
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
