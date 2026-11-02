import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { fetchSite, saveSite } from '../api.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { darken, hexToRgb, lighten, mix, normalizeHex } from '../Utils/color.js';

/*
 * Site-wide colour theme, editable from the dashboard (قسم "ألوان الموقع").
 * Only the base colours are stored; every derived token (dark / soft / shadows…)
 * is computed here and written to :root as CSS variables, so all existing
 * styles that use var(--red), var(--navy)… follow the theme automatically.
 * The theme is language-independent, so it has its own storage key.
 */

export const DEFAULT_THEME = {
  primary: '#AB1A37', // الأحمر (الأزرار والروابط والشرائط)
  secondary: '#0D3E6D', // الأزرق (العناوين والشريط العلوي)
  dark: '#111c42', // الأزرق الداكن (الخلفيات الداكنة)
  text: '#2a2f45', // لون النص
  background: '#f5f6fa', // خلفية الصفحة
  card: '#ffffff', // خلفية البطاقات
};

export const THEME_PRESETS = [
  { id: 'default', label: 'الافتراضي (أحمر وأزرق)', theme: DEFAULT_THEME },
  { id: 'emerald', label: 'أخضر زمردي', theme: { primary: '#0f8a5f', secondary: '#0b4f6c', dark: '#0a2540', text: '#1f2d3d', background: '#f3f8f6', card: '#ffffff' } },
  { id: 'royal', label: 'أزرق ملكي', theme: { primary: '#2447b8', secondary: '#162a6b', dark: '#0c1745', text: '#232a45', background: '#f4f6fc', card: '#ffffff' } },
  { id: 'gold', label: 'ذهبي وكحلي', theme: { primary: '#b7791f', secondary: '#1a365d', dark: '#0f2140', text: '#2d3142', background: '#faf7f0', card: '#ffffff' } },
  { id: 'purple', label: 'بنفسجي', theme: { primary: '#6b2fa0', secondary: '#2d1b69', dark: '#1a1040', text: '#2b2540', background: '#f7f4fb', card: '#ffffff' } },
];

const KEY = 'almosanadah:theme';

export const sanitizeTheme = (t) => {
  const out = {};
  Object.keys(DEFAULT_THEME).forEach((k) => {
    out[k] = normalizeHex(t?.[k], DEFAULT_THEME[k]);
  });
  return out;
};

/** Writes the theme to :root. Safe to call repeatedly (used for live preview too). */
export function applyTheme(input) {
  const t = sanitizeTheme(input);
  const [r, g, b] = hexToRgb(t.primary);
  const s = document.documentElement.style;
  s.setProperty('--red', t.primary);
  s.setProperty('--red-dark', darken(t.primary, 0.18));
  s.setProperty('--red-soft', lighten(t.primary, 0.9));
  s.setProperty('--red-rgb', `${r}, ${g}, ${b}`);
  s.setProperty('--shadow-red', `0 10px 24px rgba(${r}, ${g}, ${b}, 0.35)`);
  s.setProperty('--navy', t.secondary);
  s.setProperty('--navy-dark', t.dark);
  s.setProperty('--ink', t.text);
  s.setProperty('--muted', mix(t.text, '#ffffff', 0.4));
  s.setProperty('--line', mix(t.text, '#ffffff', 0.9));
  s.setProperty('--bg', t.background);
  s.setProperty('--card', t.card);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t.primary);
}

// Apply the saved theme before the first paint to avoid a colour flash.
try {
  const raw = localStorage.getItem(KEY);
  if (raw) applyTheme(JSON.parse(raw));
} catch {
  /* ignore */
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [saved, setSaved] = useLocalStorage(KEY, DEFAULT_THEME);
  const theme = useMemo(() => sanitizeTheme(saved), [saved]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // the published theme comes from the server so all visitors share it
  useEffect(() => {
    let alive = true;
    fetchSite().then((remote) => {
      if (alive && remote?.theme) setSaved(sanitizeTheme(remote.theme));
    });
    return () => {
      alive = false;
    };
  }, [setSaved]);

  const saveTheme = useCallback(
    (next) => {
      const clean = sanitizeTheme(next);
      setSaved(clean);
      saveSite({ theme: clean });
    },
    [setSaved]
  );
  const resetTheme = useCallback(() => {
    setSaved(DEFAULT_THEME);
    saveSite({ theme: DEFAULT_THEME });
  }, [setSaved]);

  const value = useMemo(() => ({ theme, saveTheme, resetTheme }), [theme, saveTheme, resetTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
