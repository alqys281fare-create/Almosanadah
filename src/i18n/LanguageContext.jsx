import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ui } from './ui.js';

const LanguageContext = createContext(null);
const KEY = 'almosanadah:lang';

const readInitial = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  return 'ar';
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitial);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // keep <html lang dir> in sync so CSS logical properties flip automatically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

  const t = useCallback((key) => ui[lang][key] ?? key, [lang]);
  const toggle = useCallback(() => setLang((l) => (l === 'ar' ? 'en' : 'ar')), []);

  const value = useMemo(() => ({ lang, dir, setLang, toggle, t }), [lang, dir, toggle, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
};
