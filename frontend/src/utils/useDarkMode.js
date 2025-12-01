import { useEffect, useState } from 'react';

/**
 * useDarkMode hook
 * - stores theme in localStorage under key "theme"
 * - sets <html data-theme="dark"> or "light"
 * - returns [darkBoolean, setDark]
 */
export default function useDarkMode() {
  // read stored theme; default to "dark" for app (you can change default to 'light')
  const initialTheme = (() => {
    try {
      const t = localStorage.getItem('theme');
      if (t === 'dark') return true;
      if (t === 'light') return false;
    } catch (e) { /* ignore */ }
    return true; // default: dark
  })();

  const [dark, setDark] = useState(initialTheme);

  useEffect(() => {
    const themeName = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('theme', themeName);
    } catch (e) { /* ignore */ }
  }, [dark]);

  return [dark, setDark];
}
