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
                <div className="center-diamond"></div>
                <div className="rotating-elements">
                  <div className="element element-1"></div>
                  <div className="element element-2"></div>
                  <div className="element element-3"></div>
                  <div className="element element-4"></div>
                </div>
                <div className="pulsing-ring"></div>
                <div className="center-star">
                  <div className="star-beam beam-1"></div>
                  <div className="star-beam beam-2"></div>
                  <div className="star-center"></div>
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
