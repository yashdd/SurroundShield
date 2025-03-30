import React, { useState, useRef, useEffect } from 'react';
import '../styles/chat_interface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weatherData, setWeatherData] = useState({
    location: 'New York City',
    region: 'New York, USA',
    temp: '25°C',
    condition: 'Sunny',
    aqi: '35',
    aqiLabel: 'Good',
    uvIndex: '7',
    uvLabel: 'High',
    humidity: '65%',
    windSpeed: '12 km/h',
    hourlyForecast: [
      { time: 'Now', temp: '25°C', condition: 'Sunny' },
      { time: '1PM', temp: '26°C', condition: 'Sunny' },
      { time: '2PM', temp: '27°C', condition: 'Partly Cloudy' },
      { time: '3PM', temp: '26°C', condition: 'Partly Cloudy' },
      { time: '4PM', temp: '25°C', condition: 'Cloudy' },
      { time: '5PM', temp: '24°C', condition: 'Cloudy' },
      { time: '6PM', temp: '23°C', condition: 'Cloudy' },
      { time: '7PM', temp: '22°C', condition: 'Cloudy' }
    ]
  });
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Add theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Loading animation
  const loadingAnimation = {
    id: Date.now(),
    text: '',
    sender: 'bot',
    isLoading: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  // Send message handler
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request at this time.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => prev.filter(msg => !msg.isLoading).concat(botResponse));
    } catch (error) {
      console.error('Error communicating with the server:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm experiencing technical difficulties. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
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

  // Helper function to get weather icon name based on condition
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('thunder')) return '⚡';
    if (conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('wind')) return '💨';
    return '🌤️';
  };

  // Helper function to get AQI color based on value
  const getAQIColor = (aqi) => {
    const value = parseInt(aqi);
    if (value <= 50) return '#16a34a'; // Good
    if (value <= 100) return '#eab308'; // Moderate
    if (value <= 150) return '#f97316'; // Unhealthy for Sensitive Groups
    if (value <= 200) return '#ef4444'; // Unhealthy
    if (value <= 300) return '#7c3aed'; // Very Unhealthy
    return '#dc2626'; // Hazardous
  };

  // Helper function to get UV index color based on value
  const getUVColor = (uv) => {
    const value = parseInt(uv);
    if (value <= 2) return '#16a34a'; // Low
    if (value <= 5) return '#eab308'; // Moderate
    if (value <= 7) return '#f97316'; // High
    if (value <= 10) return '#ef4444'; // Very High
    return '#7c3aed'; // Extreme
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : ''}`}>
      <div className="main-content">
        {/* Weather sidebar */}
        <div className="weather-sidebar">
          <div className="weather-content">
            <div className="weather-location">
              <h3>{weatherData.location}</h3>
              <p>{weatherData.region}</p>
            </div>

            <div className="weather-current">
              <p className="weather-temp">{weatherData.temp}</p>
              <p className="weather-condition">
                {getWeatherIcon(weatherData.condition)} {weatherData.condition}
              </p>
            </div>

            <div className="weather-metrics">
              <div className="weather-metric">
                <div className="metric-icon">🌍</div>
                <p className="metric-value" style={{ color: getAQIColor(weatherData.aqi) }}>
                  {weatherData.aqi}
                </p>
                <p className="metric-label">Air Quality ({weatherData.aqiLabel})</p>
              </div>

              <div className="weather-metric">
                <div className="metric-icon">☂️</div>
                <p className="metric-value" style={{ color: getUVColor(weatherData.uvIndex) }}>
                  {weatherData.uvIndex}
                </p>
                <p className="metric-label">UV Index ({weatherData.uvLabel})</p>
              </div>

              <div className="weather-metric">
                <div className="metric-icon">💧</div>
                <p className="metric-value">{weatherData.humidity}</p>
                <p className="metric-label">Humidity</p>
              </div>

              <div className="weather-metric">
                <div className="metric-icon">💨</div>
                <p className="metric-value">{weatherData.windSpeed}</p>
                <p className="metric-label">Wind Speed</p>
              </div>
            </div>

            <div className="weather-forecast">
              <h3 className="forecast-title">Hourly Forecast</h3>
              <div className="forecast-scroll">
                {weatherData.hourlyForecast.map((hour, index) => (
                  <div key={index} className="forecast-item">
                    <p className="forecast-time">{hour.time}</p>
                    <p className="forecast-temp">{hour.temp}</p>
                    <p className="forecast-condition">{getWeatherIcon(hour.condition)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat container */}
        <div className="chat-container">
          <div className="chat-header">
            <h2>Shield AI</h2>
            <div className="header-controls">
              <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}>
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
                Start a conversation with Shield AI
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                  <div className="message-content">
                    {message.isLoading ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
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
            <button type="submit" disabled={isLoading || !inputMessage.trim()} aria-label="Send message">
              {isLoading ? 'Processing...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 