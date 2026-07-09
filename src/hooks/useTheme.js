import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const favicon = window.document.querySelector("link[rel='icon']");
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (favicon) {
        favicon.setAttribute('href', '/favicon.png');
      }
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (favicon) {
        favicon.setAttribute('href', '/favicon.ico');
      }
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return [theme, toggleTheme];
}
