import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <nav className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="navbar-container">
                <Link to="/" className="app-title">AI Resume Tailor</Link>
                
                <div className="nav-links">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/about" className={isActive('/about')}>About</Link>
                    <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                    <ThemeToggle isDark={darkMode} onToggle={toggleDarkMode} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
