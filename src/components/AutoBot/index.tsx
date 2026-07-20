import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, type IconProp } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
library.add(fas);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_KEYBOARD_DELAY = 300;
const USER_GUIDE_URL = 'https://shafthq.github.io/';
const AUTOBOT_API_URL = 'https://shaft-engine.mohab-mohieeldeen.workers.dev/api/gemini-proxy';

const AutoBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // System instruction for the chatbot
  const systemInstruction = `You are AutoBot, the intelligent technical assistant for SHAFT, the Unified Test Automation Engine. Your objective is to help users by retrieving accurate information from the official SHAFT documentation and GitHub repository that have been provided to you.

SCOPE OF KNOWLEDGE
You have been provided with:
1. The complete SHAFT Engine user guide documentation
2. Information about the official SHAFT GitHub repository (github.com/shafthq/SHAFT_ENGINE)

STRICT OPERATIONAL RULES
1. SOURCE RESTRICTION: Use information ONLY from the documentation and repository information that has been provided to you in your system context. Do NOT use:
   - Your pre-training knowledge
   - Internet searches
   - Previously cached information
   - Any external sources
2. ACCURACY OVER HELPFULNESS: Only answer based on what you can find in the provided documentation. If information is not in the documentation, clearly state this.
3. CODE SNIPPETS: Provide Java code examples only if they are derived from the official documentation or follow standard SHAFT patterns (e.g., fluid syntax starting with SHAFT.).
4. DOCUMENTATION REFERENCES: When providing answers, reference the specific document or section where the information was found.

HANDLING MISSING DATA
If you cannot find the answer in the provided documentation, you must state:
"I could not find verified information about this in the SHAFT documentation provided to me. For more details, please check:
- GitHub Repository: https://github.com/shafthq/SHAFT_ENGINE
- GitHub Issues: https://github.com/shafthq/SHAFT_ENGINE/issues
- GitHub Discussions: https://github.com/shafthq/SHAFT_ENGINE/discussions
- User Guide: ${USER_GUIDE_URL}"

RESPONSE GUIDELINES
When answering questions:
1. Search thoroughly through the provided documentation
2. Be concise and accurate
3. Provide code examples from the documentation when relevant
4. Reference specific documentation sections or files
5. If uncertain, admit it rather than guessing
6. Guide users to the appropriate GitHub resources for advanced topics

Focus on helping users with:
- Getting started with SHAFT
- Configuration and setup
- Writing tests (Web, Mobile, API, CLI, Database)
- Best practices and patterns
- Understanding SHAFT features
- Troubleshooting common issues
`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    
    // Check on mount
    checkMobile();
    
    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout;
    const debouncedCheckMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };
    
    // Check on resize
    window.addEventListener('resize', debouncedCheckMobile);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedCheckMobile);
    };
  }, []);

  // Keep the mobile chat panel pinned above the on-screen keyboard (#869) as a
  // FALLBACK only. The primary fix is the interactive-widget=resizes-content
  // viewport directive (src/theme/Root.tsx): where it is honoured (Chrome/
  // Android), the browser shrinks the layout viewport to the real space above
  // the keyboard, so the panel's 100dvh already fits and window.innerHeight
  // tracks visualViewport.height — this effect then detects the match and does
  // nothing, so it can never over-shift the panel. On engines that don't honour
  // it (iOS Safari), the layout viewport stays full-height while the visual
  // viewport shrinks, so the UA pans the position:fixed panel; there we size the
  // panel to visualViewport.height and offset it by visualViewport.offsetTop to
  // sit exactly over the visible region. Body scroll-lock stops the underlying
  // page from receiving the pan. Scoped to mobile + open; desktop is untouched.
  useEffect(() => {
    if (!isOpen || !isMobile) return;
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    const el = chatWindowRef.current;
    if (!vv || !el) return;

    const clearViewport = () => {
      el.style.height = '';
      el.style.top = '';
      el.style.bottom = '';
    };

    const applyViewport = () => {
      // If the browser already resized the layout viewport to fit the keyboard
      // (interactive-widget=resizes-content), innerHeight tracks the visual
      // viewport and 100dvh already fits — don't second-guess it, or the manual
      // offset double-counts the browser's own adjustment and shifts the panel
      // too far (the "moved too much" regression). Only reposition when the
      // layout viewport stayed full while the visual viewport shrank.
      if (Math.abs(window.innerHeight - vv.height) < 2) {
        clearViewport();
        return;
      }
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
      el.style.bottom = 'auto';
    };

    applyViewport();
    vv.addEventListener('resize', applyViewport);
    vv.addEventListener('scroll', applyViewport);
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      vv.removeEventListener('resize', applyViewport);
      vv.removeEventListener('scroll', applyViewport);
      el.style.height = '';
      el.style.top = '';
      el.style.bottom = '';
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen, isMobile]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }
  }, [input]);

  useEffect(() => {
    // Add welcome message when chat is first opened
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "👋 Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (limit to last 10 messages for performance)
      const recentMessages = messages.slice(-10);
      
      // Filter history to ensure first message is from user (Gemini API requirement)
      // The Gemini API requires conversation history to start with a user message,
      // so we filter out any assistant messages that appear before the first user message
      // (e.g., welcome messages that are shown when the chat first opens)
      const firstUserIndex = recentMessages.findIndex(msg => msg.role === 'user');
      const validMessages = firstUserIndex >= 0 ? recentMessages.slice(firstUserIndex) : [];
      
      const chatHistory = validMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Call the Cloudflare Worker proxy endpoint so GitHub Pages can remain static.
      const response = await fetch(AUTOBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: chatHistory,
          systemInstruction: systemInstruction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Unable to connect to the chatbot service. Please try again.');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
      };

      console.log(`[AutoBot] Successfully used model: ${data.model || 'unknown'}`);
      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('[AutoBot] Error calling Gemini API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: (error as Error).message || `Sorry, I encountered an error. Please try again or check the user guide at ${USER_GUIDE_URL}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isMobile) {
        // On mobile, Enter always creates new line - do nothing, let default behavior happen
        return;
      } else {
        // On desktop, Shift+Enter creates new line, Enter sends
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          handleSend();
        }
      }
    }
  };

  const handleInputFocus = () => {
    // On mobile, scroll to ensure input is visible above keyboard
    if (isMobile && textareaRef.current) {
      const currentRef = textareaRef.current;
      // Small delay to let keyboard appear
      const scrollTimeout = setTimeout(() => {
        // Check if ref is still valid before scrolling
        if (currentRef && currentRef.isConnected) {
          currentRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, MOBILE_KEYBOARD_DELAY);
      
      // Cleanup function would be handled by component unmount
      return () => clearTimeout(scrollTimeout);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className={styles.autoBotContainer}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          type="button"
          className={styles.chatButton}
          onClick={toggleChat}
          aria-label="Open AutoBot Chat"
          title="Chat with AutoBot"
        >
          <img src="/img/autobot-avatar.svg" alt="AutoBot" className={styles.chatButtonIcon} loading="lazy" decoding="async" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow} ref={chatWindowRef} role="dialog" aria-label="AutoBot chat">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <img src="/img/autobot-avatar.svg" alt="AutoBot" className={styles.headerIcon} loading="lazy" decoding="async" />
              <div className={styles.headerText}>
                <h3>AutoBot</h3>
                <span className={styles.statusIndicator}>
                  <span className={styles.statusDot}></span>
                  SHAFT docs assistant
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <FontAwesomeIcon icon={"fa-solid fa-trash" as IconProp} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={toggleChat}
                aria-label="Minimize chat"
                title="Minimize chat"
              >
                <FontAwesomeIcon icon={"fa-solid fa-window-minimize" as IconProp} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages} ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  {message.role === 'assistant' && (
                    <div className={styles.messageAvatar}>
                      <img src="/img/autobot-avatar.svg" alt="AutoBot" className={styles.avatarIcon} loading="lazy" decoding="async" />
                    </div>
                  )}
                  <div className={styles.messageBubble}>
                    {message.role === 'assistant' ? (
                      <div className={styles.markdownContent}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <span className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {message.role === 'user' && (
                    <div className={styles.messageAvatar}>
                      <FontAwesomeIcon icon={"fa-solid fa-user" as IconProp} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.messageAvatar}>
                    <img src="/img/autobot-avatar.svg" alt="AutoBot" className={styles.avatarIcon} loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.messageBubble}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.chatInput}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              aria-label="Ask AutoBot about SHAFT"
              placeholder="Ask about SHAFT docs..."
              className={styles.inputField}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              className={styles.sendButton}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={"fa-solid fa-paper-plane" as IconProp} />
            </button>
          </div>

          {/* Footer */}
          <div className={styles.chatFooter}>
            <small>
              Powered by{' '}
              <a href="https://ai.google.dev/gemini-api" target="_blank" rel="noopener noreferrer">
                Gemini AI
              </a>
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoBot;
