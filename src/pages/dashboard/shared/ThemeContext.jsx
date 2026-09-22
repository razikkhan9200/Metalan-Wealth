/**
 * ThemeContext.jsx — light / dark mode for the /user-admin area.
 *
 * <ThemeProvider> wraps the area in a `.mt-root[data-mt-theme]` element; theme.css
 * re-maps the palette when data-mt-theme="light", so the existing Tailwind classes
 * keep working in both modes. The choice is remembered in localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import "../theme.css";

const KEY = "metalan_theme";
const PAGE_BG = { dark: "#05080d", light: "#eef1f6" };

const ThemeCtx = createContext({ theme: "dark", isDark: true, setTheme: () => {}, toggle: () => {} });

const readStored = () => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch { /* storage unavailable */ }
  return "dark";
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStored);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch { /* ignore */ }
  }, []);
  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  // Keep the area's overscroll / <html> background in step with the theme, restore on leave.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.background;
    html.style.background = PAGE_BG[theme];
    return () => { html.style.background = prev; };
  }, [theme]);

  const value = useMemo(() => ({ theme, isDark: theme === "dark", setTheme, toggle }), [theme, setTheme, toggle]);

  return (
    <ThemeCtx.Provider value={value}>
      <div className="mt-root" data-mt-theme={theme}>{children}</div>
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
