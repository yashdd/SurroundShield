// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/chat_interface';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import './styles/styles.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Simple routes without authentication checks */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
