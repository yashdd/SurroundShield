import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail');
  

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the session on the server
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'GET',
        credentials: 'include', // Include cookies for the request
      });

      const data = await response.json();
      console.log(data)
      if (data.message === 'Logout successful') {
        // Clear the session storage
        sessionStorage.removeItem('authSession');
        sessionStorage.removeItem('user');
        
        // Redirect to the login page
        navigate('/login');
      } else {
        console.error('Logout failed:', data.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="simple-dashboard">
      <h1>Welcome, {userEmail}</h1>
      <p>You're now logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
