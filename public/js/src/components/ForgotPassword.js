import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import '../styles/forgot-password.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Failed to process your request');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <Link to="/login" className="back-to-login">
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        {!isSuccess ? (
          <>
            <div className="forgot-password-header">
              <h1>Reset Password</h1>
              <p className="subtitle">
                Enter your email address and we'll send you instructions to reset your
                password.
              </p>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} className="icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="reset-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="spinner" size={18} />
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h2>Check Your Email</h2>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="note">
              If you don't see the email, please check your spam folder.
            </p>
            <button
              className="resend-button"
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;