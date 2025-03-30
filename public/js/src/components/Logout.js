import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader } from 'lucide-react';
import '../styles/logout.css';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/logout', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        
        // Clear session storage regardless of response
        sessionStorage.removeItem('authSession');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isAuthenticated');

        // Short delay for visual feedback
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Error during logout:', error);
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <LogOut size={32} className="logout-icon" />
        <h2>Signing Out</h2>
        <p>Please wait while we log you out securely...</p>
        <Loader size={24} className="loading-spinner" />
      </div>
    </div>
  );
};

export default Logout; 