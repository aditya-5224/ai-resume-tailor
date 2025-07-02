import React from 'react';
import { ClassicLoader } from './ClassicLoader';
import './LoadingOverlay.css';

export function LoadingOverlay({ isVisible, text = 'Processing...', size = 'large' }) {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-backdrop" />
      <div className="loading-overlay-content">
        <ClassicLoader size={size} text={text} />
      </div>
    </div>
  );
}
