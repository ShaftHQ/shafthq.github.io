import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styles from './styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
library.add(fas);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AutoBot: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini AI
  const initializeAI = () => {
    // Access environment variable from Docusaurus customFields
    const apiKey = (siteConfig.customFields?.GEMINI_API_KEY as string) || '';
    
    if (!apiKey || !apiKey.trim()) {
      console.error('[AutoBot] Gemini API key not configured.');
      console.error('[AutoBot] For local development: Set GEMINI_API_KEY in .env file');
      console.error('[AutoBot] For production: Add GEMINI_API_KEY to GitHub Secrets');
      return null;
    }
    
    console.log('[AutoBot] API key configured successfully');
    return new GoogleGenerativeAI(apiKey);
  };

  // System instruction for the chatbot
  const systemInstruction = `You are AutoBot, an intelligent assistant for SHAFT - the Unified Test Automation Engine. 
Your role is to help users understand and use SHAFT effectively.

SHAFT is an award-winning, all-in-one test automation framework that:
- Drives Web, Mobile, API, CLI, and Database test automation with a single unified engine
- Has zero boilerplate code requirements
- Provides automatic synchronization, screenshots, logging & reporting
- Is a proud member of the Selenium ecosystem (one of 17 official frameworks)
- Winner of the Google Open Source Peer Bonus award
- Uses an intuitive wizard-like syntax (just type SHAFT. to discover all capabilities)
- Is powered by WebDriver, W3C standard compliant, and WebDriver BiDi enabled
- Has 40,000+ active users worldwide

When answering questions:
1. Be concise and helpful
2. Provide code examples when relevant (use proper Java syntax)
3. Reference the official documentation at https://shafthq.github.io
4. Suggest checking the GitHub repository at https://github.com/ShaftHQ/SHAFT_ENGINE for source code
5. Be friendly and encouraging
6. If you don't know something specific, admit it and suggest checking the documentation or GitHub issues

Focus on helping users with:
- Getting started with SHAFT
- Configuration and setup (properties, Maven archetype)
- Writing tests (Web, Mobile, API, CLI, Database)
- Best practices and design patterns
- Troubleshooting common issues
- Understanding SHAFT features and capabilities
- Differences between SHAFT and native Selenium/Appium`;

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

    // List of models to try in order of preference (newest to oldest)
    const modelsToTry = [
      'gemini-3-flash',
      'gemini-2.5-flash'
    ];

    let lastError: Error | null = null;

    try {
      const genAI = initializeAI();
      
      if (!genAI) {
        throw new Error('Gemini API key not configured. Please contact the site administrator to set up the API key in GitHub Secrets.');
      }

      // Build conversation history (limit to last 10 messages for performance)
      const recentMessages = messages.slice(-10);
      
      // Filter history to ensure first message is from user (Gemini API requirement)
      // Find the index of the first user message
      const firstUserIndex = recentMessages.findIndex(msg => msg.role === 'user');
      const validMessages = firstUserIndex >= 0 ? recentMessages.slice(firstUserIndex) : [];
      
      const chatHistory = validMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Try each model in order until one works
      for (const modelName of modelsToTry) {
        try {
          console.log(`[AutoBot] Trying model: ${modelName}`);
          
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction,
          });

          const chat = model.startChat({
            history: chatHistory,
          });

          const result = await chat.sendMessage(trimmedInput);
          const response = await result.response;
          const text = response.text();

          const assistantMessage: Message = {
            role: 'assistant',
            content: text,
            timestamp: new Date(),
          };

          console.log(`[AutoBot] Successfully used model: ${modelName}`);
          setMessages((prev) => [...prev, assistantMessage]);
          return; // Success! Exit the function
        } catch (modelError) {
          console.warn(`[AutoBot] Model ${modelName} failed:`, modelError);
          lastError = modelError as Error;
          // Continue to the next model
        }
      }

      // If we get here, all models failed
      throw new Error(lastError?.message || 'All available models failed. Please try again later.');
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: (error as Error).message || 'Sorry, I encountered an error. Please try again or check the documentation at https://shafthq.github.io',
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
