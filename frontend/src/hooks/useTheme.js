import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

/** Sync theme to document and expose toggle helpers. */
export function useTheme() {
  const { theme, setTheme, compactMode, toggleCompactMode } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('compact-mode', compactMode);
  }, [theme, compactMode]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggleTheme, compactMode, toggleCompactMode };
}

export default useTheme;
