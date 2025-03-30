// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/login.js';
import Registration from './components/Registration.js';
import './styles/styles.css';
import Dashboard from './components/Dashboard.js';
import ChatInterface from './components/chat_interface.js';
import Terms from './components/Terms.js';
import Privacy from './components/Privacy.js';
import ForgotPassword from './components/ForgotPassword.js';
import Logout from './components/Logout';

const App = () => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Registration />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } />
            <Route path="/chat" element={
              isAuthenticated ? <ChatInterface /> : <Navigate to="/login" />
            } />
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
