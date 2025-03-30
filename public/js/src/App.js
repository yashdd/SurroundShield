// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.js';
import Registration from './components/Registration.js';
import './styles/styles.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Redirect root to login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Registration route */}
          <Route path="/register" element={<Registration />} />
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
