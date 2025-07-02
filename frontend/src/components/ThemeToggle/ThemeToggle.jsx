import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <div className="container">
      <label className="switch">
        <input 
          type="checkbox" 
          id="toggle"
          checked={isDark}
          onChange={onToggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        />
        <span className="slider">
          <span className="slider-icon">
            {isDark ? (
              <svg className="moon-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className="sun-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </span>
          
          {/* Background decorations */}
          <div className="slider-decorations">
            {isDark ? (
              // Stars for dark mode
              <>
                <span className="star star-1">★</span>
                <span className="star star-2">✦</span>
                <span className="star star-3">✧</span>
                <span className="star star-4">⋆</span>
              </>
            ) : (
              // Clouds for light mode
              <>
                <span className="cloud cloud-1">☁️</span>
                <span className="cloud cloud-2">☁️</span>
                <span className="cloud cloud-3">☁️</span>
              </>
            )}
          </div>
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;