import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  LogIn, 
  UserPlus, 
  LogOut,
  Shield
} from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'GET', // You can also use POST if needed
        credentials: 'include', // Ensures the session or cookies are sent
      });

      const data = await response.json();
      if (data.message === 'Logout successful') {
        sessionStorage.removeItem('session');
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="horizontal-navbar">
      <div className="nav-brand">
        <Shield className="logo-icon" />
        <span className="logo-text">ShieldSurround
        </span>
      </div>

      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          title="Home"
          onClick={handleHomeClick}
        >
          <div className="icon-container">
            <Home />
          </div>
          <span>Home</span>
        </Link>

        {!isAuthenticated ? (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              title="Login"
            >
              <div className="icon-container">
                <LogIn />
              </div>
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="register-btn"
              title="Register"
            >
              <div className="icon-container">
                <UserPlus />
              </div>
              <span>Register</span>
            </Link>
          </>
        ) : (
          <button 
            onClick={handleLogout}
            className="nav-link logout-btn"
            title="Logout"
          >
            <div className="icon-container">
              <LogOut />
            </div>
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;