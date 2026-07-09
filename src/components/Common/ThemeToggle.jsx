import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ className = "" }) {
  const [theme, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800/50 transition duration-200 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
    </button>
  );
}
