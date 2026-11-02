import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { fetchSite, saveSite } from '../api.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { defaultContents } from '../data/defaultContent.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { normalizeCatalog } from '../Utils/catalog.js';
import { normalizeAds } from '../Utils/ads.js';

/*
 * Content is stored separately per language ('ar' / 'en').
 * useContent() returns the content of the current site language, unless a
 * <ContentLangScope lang="en"> is above it (the dashboard uses this so you can
 * edit English while the interface stays Arabic).
 */

const ContentContext = createContext(null);
const ScopeContext = createContext(null);

// 'ar' keeps the original key so content saved before translation support is preserved.
const STORAGE_KEYS = { ar: 'almosanadah:content', en: 'almosanadah:content:en' };

// Shallow-merge saved content over defaults so new default keys never break old saves.
const withDefaults = (lang, saved) => {
  const base = defaultContents[lang];
  const out = { ...base };
  Object.keys(saved || {}).forEach((k) => {
    const d = base[k];
    const s = saved[k];
    out[k] = d && !Array.isArray(d) && typeof d === 'object' ? { ...d, ...s } : s;
  });
  // advertisements: four positions per language (older saves had one poster per side)
  // (only the SAVED slots count here: the default slots must not hide an old leftImage / rightImage that still has to be migrated)
  const savedAds = saved?.ads;
  out.ads = normalizeAds(savedAds ? { ...base.ads, ...savedAds, slots: savedAds.slots } : base.ads, base.ads);
  // repair old saves: every course / featured program must belong to an existing program type
  return normalizeCatalog(out, base);
};

export function ContentProvider({ children }) {
  const [savedAr, setSavedAr] = useLocalStorage(STORAGE_KEYS.ar, defaultContents.ar);
  const [savedEn, setSavedEn] = useLocalStorage(STORAGE_KEYS.en, defaultContents.en);

  /*
   * The server (server/api.js) holds the published content so every visitor and every
   * browser sees the admin's latest changes. localStorage is only a fast cache.
   * `pending` marks edits made by the admin in this browser, which are then pushed to the server.
   */
  const pending = useRef({ ar: false, en: false });

  useEffect(() => {
    let alive = true;
    fetchSite().then((remote) => {
      if (!alive || !remote) return;
      // never overwrite an edit the admin made while this (slow, image-heavy) request was in flight
      if (remote.ar && !pending.current.ar) setSavedAr(remote.ar);
      if (remote.en && !pending.current.en) setSavedEn(remote.en);
    });
    return () => {
      alive = false;
    };
  }, [setSavedAr, setSavedEn]);

  useEffect(() => {
    if (pending.current.ar) {
      pending.current.ar = false;
      saveSite({ ar: savedAr });
    }
  }, [savedAr]);
  useEffect(() => {
    if (pending.current.en) {
      pending.current.en = false;
      saveSite({ en: savedEn });
    }
  }, [savedEn]);

  const contents = useMemo(
    () => ({ ar: withDefaults('ar', savedAr), en: withDefaults('en', savedEn) }),
    [savedAr, savedEn]
  );

  const updateSection = useCallback(
    (lang, key, value) => {
      pending.current[lang === 'en' ? 'en' : 'ar'] = true;
      const setSaved = lang === 'en' ? setSavedEn : setSavedAr;
      setSaved((prev) => {
        const all = withDefaults(lang, prev);
        const current = all[key];
        const next =
          Array.isArray(current) || typeof value !== 'object' || Array.isArray(value)
            ? value
            : { ...current, ...value };
        return { ...all, [key]: next };
      });
    },
    [setSavedAr, setSavedEn]
  );

  /* Same change in BOTH languages — for things that are not text (e.g. the hero poster),
     so the admin does not have to upload it twice. */
  const updateShared = useCallback(
    (key, patch) => {
      ['ar', 'en'].forEach((l) => {
        pending.current[l] = true;
        (l === 'en' ? setSavedEn : setSavedAr)((prev) => {
          const all = withDefaults(l, prev);
          return { ...all, [key]: { ...all[key], ...patch } };
        });
      });
    },
    [setSavedAr, setSavedEn]
  );

  const replaceAll = useCallback(
    (lang, next) => {
      pending.current[lang === 'en' ? 'en' : 'ar'] = true;
      (lang === 'en' ? setSavedEn : setSavedAr)(withDefaults(lang, next));
    },
    [setSavedAr, setSavedEn]
  );

  const reset = useCallback(
    (lang) => {
      pending.current[lang === 'en' ? 'en' : 'ar'] = true;
      (lang === 'en' ? setSavedEn : setSavedAr)(defaultContents[lang]);
    },
    [setSavedAr, setSavedEn]
  );

  const value = useMemo(
    () => ({ contents, updateSection, updateShared, replaceAll, reset }),
    [contents, updateSection, updateShared, replaceAll, reset]
  );
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function ContentLangScope({ lang, children }) {
  return <ScopeContext.Provider value={lang}>{children}</ScopeContext.Provider>;
}

export const useContent = () => {
  const ctx = useContext(ContentContext);
  const { lang: siteLang } = useLang();
  const scope = useContext(ScopeContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  const lang = scope || siteLang;

  return useMemo(
    () => ({
      lang,
      allContents: ctx.contents,
      content: ctx.contents[lang],
      updateSection: (key, value) => ctx.updateSection(lang, key, value),
      updateShared: ctx.updateShared,
      // write a section of a SPECIFIC language (the dashboard uses it where one screen edits both languages)
      updateLang: ctx.updateSection,
      replaceAll: (next) => ctx.replaceAll(lang, next),
      reset: () => ctx.reset(lang),
    }),
    [ctx, lang]
  );
};
