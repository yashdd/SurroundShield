// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import Registration from './components/Registration.js';
import './styles/styles.css';
import Dashboard from './components/Dashboard.js';
import ChatInterface from './components/chat_interface.js';
const App = () => {

  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Redirect root to login page */}
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
        {/* </Route> */}
        {/* <Route path="/logout" element={<Logout />} /> */}
          {/* Registration route */}
          <Route path="/register" element={<Registration />} />
          
          {/* Catch all route - redirect to login */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
          <Route path="/chat" element={<ChatInterface />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
