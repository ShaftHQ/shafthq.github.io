import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
library.add(fas);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AutoBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // System instruction for the chatbot
  const systemInstruction = `You are AutoBot, the intelligent technical assistant for SHAFT, the Unified Test Automation Engine. Your objective is to help users by retrieving accurate information from the official SHAFT documentation ecosystem.

SCOPE OF KNOWLEDGE AND SEARCH STRATEGY
You are not limited to the homepage. You must treat the entire domain hierarchy of shaftengine.netlify.app and the repository github.com/shafthq as your primary database.
When analyzing a user request, you must assume the answer lies on a specific sub-page, not the main landing page.
When constructing search queries, follow this process to target deep pages:
  1. Identify the main topic and action from the user request (e.g., "API tests", "Web UI locators", "mobile capabilities configuration").
  2. Combine that topic with "SHAFT Engine" and, when possible, a specific feature, class, or namespace name (e.g., "RestActions", "WebDriver", "io.github.shafthq", "CLI", "report", "TestNG").
  3. Use multi-word phrases that reflect how the feature would appear in the docs, such as "<topic> usage", "<topic> configuration", or "<topic> syntax".
  4. Prefer queries that are more specific than just "SHAFT" or "SHAFT Engine". For example, if a user asks about "API tests", do NOT search only for "SHAFT". Instead, search for queries like "SHAFT Engine RestActions", "SHAFT Engine API testing syntax", or "SHAFT Engine io.github.shafthq RestActions".
  5. If the request mentions a particular technology or library (e.g., Selenium, Appium, TestNG), include it alongside "SHAFT Engine" and the feature in the query to narrow down to the relevant deep page.

STRICT OPERATIONAL RULES
1. IGNORE PRE-TRAINING: Do not answer based on your internal memory. You must verify every answer using the Google Search tool.
2. SOURCE VALIDATION: Use information ONLY if the URL starts with shaftengine.netlify.app or github.com/shafthq. Ignore all other websites (like Medium, StackOverflow, or third-party tutorials) to prevent hallucinations.
3. DEEP LINKING: When providing an answer, you must cite the specific sub-page URL where the information was found (e.g., shaftengine.netlify.app/folder/page). Do not default to the homepage unless the information is actually there.
4. CODE SNIPPETS: You may provide Java code examples only if they are derived from the official search snippets or standard SHAFT patterns found in the documentation (e.g., fluid syntax starting with SHAFT.).

HANDLING MISSING DATA
If your targeted searches do not return a result from the official domains, do not guess. You must state:
I searched the official documentation but could not find a verified reference for this specific feature. You may want to check the GitHub Issues (https://github.com/shafthq/SHAFT_ENGINE/issues) or Discussions (https://github.com/shafthq/SHAFT_ENGINE/discussions) pages.
`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      // Call the Netlify Function proxy endpoint
      // Note: For local development, you need to run Netlify CLI with:
      // netlify dev (or) npx netlify-cli dev
      // This will make Netlify Functions available at /.netlify/functions/*
      const response = await fetch('/api/gemini-proxy', {
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
        content: (error as Error).message || 'Sorry, I encountered an error. Please try again or check the user guide at https://shaftengine.netlify.app/',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter allows new line - do nothing, let default behavior happen
        return;
      } else {
        // Enter sends the message
        e.preventDefault();
        handleSend();
      }
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
          className={styles.chatButton}
          onClick={toggleChat}
          aria-label="Open AutoBot Chat"
          title="Chat with AutoBot"
        >
          <FontAwesomeIcon icon="fa-solid fa-robot" size="2x" />
          <span className={styles.badge}>AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <FontAwesomeIcon icon="fa-solid fa-robot" className={styles.headerIcon} />
              <div className={styles.headerText}>
                <h3>AutoBot</h3>
                <span className={styles.statusIndicator}>
                  <span className={styles.statusDot}></span>
                  Online
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.iconButton}
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <FontAwesomeIcon icon="fa-solid fa-trash" />
              </button>
              <button
                className={styles.iconButton}
                onClick={toggleChat}
                aria-label="Close chat"
                title="Close chat"
              >
                <FontAwesomeIcon icon="fa-solid fa-times" />
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
                      <FontAwesomeIcon icon="fa-solid fa-robot" />
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
                      <FontAwesomeIcon icon="fa-solid fa-user" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.messageAvatar}>
                    <FontAwesomeIcon icon="fa-solid fa-robot" />
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
              placeholder="Ask me anything about SHAFT... (Shift+Enter for new line)"
              className={styles.inputField}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className={styles.sendButton}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
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
