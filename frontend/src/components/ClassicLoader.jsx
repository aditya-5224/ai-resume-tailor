import React from 'react';
import './ClassicLoader.css';

export function ClassicLoader({ size = 'medium', text = 'Processing...', variant = 'ring' }) {
  const sizeClasses = {
    small: 'classic-loader-small',
    medium: 'classic-loader-medium',
    large: 'classic-loader-large'
  };

  return (
    <div className="classic-loader-container">
      <div className={`classic-loader ${sizeClasses[size]}`}>
        {variant === 'dots' ? (
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        ) : (
          <>
            <div className="loader-ring"></div>
            <div className="loader-center-pattern">
              {/* Classic formal center effects */}
              <div className="classic-core">
                <div className="center-orb"></div>
                <div className="elegant-ring ring-outer"></div>
                <div className="elegant-ring ring-inner"></div>
                <div className="formal-dots">
                  <div className="formal-dot dot-1"></div>
                  <div className="formal-dot dot-2"></div>
                  <div className="formal-dot dot-3"></div>
                  <div className="formal-dot dot-4"></div>
                </div>
                <div className="classic-symbol">
                  <div className="symbol-cross"></div>
                  <div className="symbol-center"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {text && <p className="classic-loader-text">{text}</p>}
    </div>
  );
}
