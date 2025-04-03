// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/chat_interface';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import './styles/styles.css';
import cors from "cors"; // Import CORS

// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend URL
//     credentials: true
//   }));
const App = () => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Routes with authentication checks */}
            {/* 
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
            */}
            
            {/* Simple routes without authentication checks */}
            <Route path="/" element={<Login />} />
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
