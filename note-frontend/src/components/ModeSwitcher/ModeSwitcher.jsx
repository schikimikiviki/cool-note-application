import React, { useState } from 'react';
import './ModeSwitcher.css';

const ModeSwitcher = ({ onSwitch, fontSize }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    onSwitch(isDarkMode);
  };

  return (
    <button
      className={`toggle-button ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      onClick={toggleMode}
      style={{ fontSize: fontSize }}
    >
      {isDarkMode ? '🌙 Switch to Light Mode' : '☀️ Switch to Dark Mode'}
    </button>
  );
};

export default ModeSwitcher;
