import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from './ThemeIcons';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (event) => {
    if (!prefersReducedMotion) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.5,
    duration: 0.35
  };

  return (
    <motion.div
      className="theme-toggle-wrapper"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`
      }}
    >
      <button
        className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
        onClick={onToggle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        role="switch"
        aria-checked={isDark}
      >
        <div className="toggle-track">
          <div className="toggle-icons">
            <span className={`icon-wrapper ${!isDark ? 'active' : ''}`}>
              <SunIcon className="theme-icon sun" />
            </span>
            <span className={`icon-wrapper ${isDark ? 'active' : ''}`}>
              <MoonIcon className="theme-icon moon" />
            </span>
          </div>
          
          <AnimatePresence>
            <motion.div
              className="toggle-handle"
              layout
              initial={false}
              animate={{
                x: isDark ? 'calc(100% - var(--handle-size) - var(--handle-margin) * 2)' : 0,
                rotate: isDark ? 360 : 0
              }}
              transition={prefersReducedMotion ? { duration: 0 } : springTransition}
            >
              <div className="handle-glass-effect">
                <div className="handle-shine"></div>
                <div className="handle-reflection"></div>
                <div className="handle-gradient"></div>
              </div>
              <motion.div 
                className="handle-icon"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: isDark ? [0, 180, 360] : [360, 180, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="track-glass-effect"></div>
        </div>
      </button>
    </motion.div>
  );
};

export default ThemeToggle;
