import React, { useState, useRef, useEffect } from 'react';
import '../styles/chat_interface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting message when component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm Shield AI, your personal health assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Add theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Add this inside the ChatInterface component, after the existing styles
  const loadingAnimation = {
    id: Date.now(),
    text: '',
    sender: 'bot',
    isLoading: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage, loadingAnimation]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // API call to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request at this time.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Update messages to remove loading animation and add bot response
      setMessages((prev) => prev.filter(msg => !msg.isLoading).concat(botResponse));
    } catch (error) {
      console.error('Error communicating with the server:', error);
      
      // Provide user-friendly error message
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm experiencing technical difficulties. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      // Update messages to remove loading animation and add error response
      setMessages((prev) => prev.filter(msg => !msg.isLoading).concat(errorResponse));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className={`chat-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <div className="chat-header">
        <h2>Shield AI</h2>
        <div className="header-controls">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <span className={`status-indicator ${isLoading ? 'typing' : 'online'}`}>
            {isLoading ? 'Thinking...' : 'Online'}
          </span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat-message">
            <p>Start a conversation with Shield AI</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                {message.isLoading ? (
                  <div className="loading-animation">
                    <div className="bounce-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{message.text}</p>
                    <span className="timestamp">{message.timestamp}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="thinking-process">
                <p>Processing your request...</p>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="loader-container">
                  <div className="loader-circle"></div>
                  <div className="loader-text">Analyzing data</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isLoading}
          aria-label="Message input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputMessage.trim()}
          aria-label="Send message"
        >
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;