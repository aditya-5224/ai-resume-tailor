import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          AI Resume Tailor
        </Link>
        
        <div className="navbar-items">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;