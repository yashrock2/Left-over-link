import React, { useState, useEffect } from 'react';

const themes = [
  { name: 'light', label: 'Light ☀️' },
  { name: 'dark', label: 'Dark 🌙' },
  { name: 'eye', label: 'Eye-Care 👓' },
];

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-eye');
    root.classList.add(`theme-${currentTheme}`);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex].name);
  };

  const currentLabel = themes.find(t => t.name === currentTheme)?.label || 'Theme';

  return (
    <button
      onClick={cycleTheme}
      className="border rounded-md py-1 px-3 text-sm"
      aria-label={`Current theme: ${currentLabel}. Click to change.`}
    >
      {currentLabel}
    </button>
  );
};

export default ThemeToggle;