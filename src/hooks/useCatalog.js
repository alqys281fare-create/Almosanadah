import { useMemo } from 'react';
import { useContent } from '../context/ContentContext.jsx';
import { getCatalog } from '../data/Programscatalog.js';

/*
 * The programs catalog (groups → diplomas/types → courses → modules → topics) as the public pages use it.
 * Interface labels (`ui`) stay in data/Programscatalog.js; the hierarchy itself is content.catalog.groups,
 * which the dashboard edits (one copy per language) and which defaults to the shipped catalog.
 */
export default function useCatalog() {
  const { content, lang } = useContent();
  const groups = content?.catalog?.groups;
  const uiOverride = content?.catalog?.ui;
  return useMemo(() => {
    const base = getCatalog(lang);
    return { ...base, ui: { ...base.ui, ...(uiOverride || {}) }, groups: Array.isArray(groups) ? groups : base.groups };
  }, [lang, groups, uiOverride]);
}
