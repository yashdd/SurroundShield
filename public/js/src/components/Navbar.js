import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Menu,
  ChevronRight,
  Shield
} from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.message === 'Logout successful') {
        sessionStorage.removeItem('authSession');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`vertical-navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="nav-header">
        <div className="logo-container">
          <Shield className="logo-icon" size={24} />
          {isExpanded && <span className="logo-text">Shield AI</span>}
        </div>
        <button 
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          title="Home"
        >
          <Home size={20} />
          {isExpanded && <span>Home</span>}
        </Link>

        {!isAuthenticated ? (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              title="Login"
            >
              <LogIn size={20} />
              {isExpanded && <span>Login</span>}
            </Link>
            <Link 
              to="/register" 
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              title="Register"
            >
              <UserPlus size={20} />
              {isExpanded && <span>Register</span>}
            </Link>
          </>
        ) : (
          <Link 
            to="/logout" 
            className="nav-link"
            title="Logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;