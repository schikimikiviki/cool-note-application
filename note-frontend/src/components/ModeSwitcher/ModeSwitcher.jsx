import React, { useState, useEffect } from 'react';
import './ModeSwitcher.css';

const ModeSwitcher = ({ onSwitch, fontSize, isDarkThemeSet }) => {
  const [isDarkMode, setIsDarkMode] = useState(isDarkThemeSet);

  useEffect(() => {
    setIsDarkMode(isDarkThemeSet);
  }, [isDarkThemeSet]);

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    onSwitch(isDarkMode);
  };

  return (
    <button
      className={`toggle-button ${isDarkMode ? 'light-mode' : 'dark-mode'}`}
      onClick={toggleMode}
      style={{ fontSize: fontSize }}
    >
      {isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
    </button>
  );
};

export default ModeSwitcher;
