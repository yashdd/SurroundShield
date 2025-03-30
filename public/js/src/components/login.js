import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Simple validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Mock API call - replace with your actual login endpoint
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <div className="card registration-card">
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="card-title">SurroundShield Login</h2>
          </div>
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <div>{error}</div>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label">
                <div className="d-flex align-items-center">
                  <Mail size={18} className="me-2" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label">
                <div className="d-flex align-items-center">
                  <Lock size={18} className="me-2" />
                  Password
                </div>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;