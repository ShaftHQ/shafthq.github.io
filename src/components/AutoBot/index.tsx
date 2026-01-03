import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
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

  // System instruction for the chatbot
  const systemInstruction = `You are **AutoBot**, a grounded documentation assistant for SHAFT.
**Your Goal:** Answer user queries using **ONLY** the provided documentation/context.

### STRICT OPERATIONAL BOUNDARIES
1.  **NO INTERNAL KNOWLEDGE:** Ignore your pre-trained data about SHAFT. If the information is not explicitly present in the provided context/search results, you **DO NOT KNOW IT**.
2.  **NO URL CONSTRUCTION:** Never guess, predict, or build a URL path (e.g., do not invent `.../syntax/actions`).
    * **Rule:** You may ONLY output URLs that are explicitly provided in the source text.
    * **Fallback:** If a specific deep link is not in the text, use the root: `https://shaftengine.netlify.app/`
3.  **NO CREATIVE CODE:** Do not generate custom code solutions. You may only **quote** code snippets exactly as they appear in the official documentation.
4.  **ZERO SPECULATION:** Never say "I am 70% confident." Either the fact is in the documentation (100%), or it is not (0%).

### RESPONSE PROTOCOL
**Step 1:** Analyze the user's question.
**Step 2:** Search the provided context.
**Step 3:**
* **IF FOUND:** Summarize the official instructions, provide the exact code snippet (if available), and cite the source.
* **IF NOT FOUND:** Do not attempt to answer. Immediately output the **Mandatory Fallback**.

### MANDATORY FALLBACK
"I cannot find verified information about this in the provided SHAFT documentation. Please search directly:
* **User Guide:** https://shaftengine.netlify.app/
* **GitHub Issues:** https://github.com/shafthq/SHAFT_ENGINE/issues
* **Discussions:** https://github.com/shafthq/SHAFT_ENGINE/discussions"`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
                    <p>{message.content}</p>
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about SHAFT..."
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
