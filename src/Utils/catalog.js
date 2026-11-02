/*
 * Catalog helpers — keep «programs» (types) and «courses» consistent.
 *
 * Data model (per language):
 *   content.courses.programs  → the program TYPES  [{ id, label }]   ← single source of truth
 *   content.courses.items     → courses            [{ id, category, program, title, … }]
 *   content.programs.items    → featured programs  [{ id, program, title, … }]
 *   content.programs.tabs     → home-page tabs (rebuilt from the types + the «view all» tab)
 *
 * Content that was saved by an older version has courses WITHOUT a `program` (and featured programs
 * that stored the program id in `category`). Those courses never matched any program filter, so every
 * program tab showed 0 courses. normalizeCatalog() repairs that every time content is read.
 */

export const idKey = (v) => String(v ?? '').trim().toLowerCase();
export const sameId = (a, b) => idKey(a) === idKey(b);

/** Rebuilds the home-page tab list from the program types + the «view all» tab. */
export const buildTabs = (types, allLabel) => [
  ...(types || []).map((p) => ({ id: p.id, label: p.label })),
  { id: 'all', label: allLabel },
];

/** Label of the «view all» tab (kept from the saved tabs, with a safe fallback). */
export const allTabLabel = (content, fallback = 'عرض الكل') =>
  content?.programs?.tabs?.find((t) => idKey(t.id) === 'all')?.label || content?.courses?.allProgramsLabel || fallback;

export function normalizeCatalog(content, defaults) {
  const courses = content?.courses;
  if (!courses) return content;

  const types =
    Array.isArray(courses.programs) && courses.programs.length ? courses.programs : defaults?.courses?.programs || [];
  const find = (id) => types.find((p) => sameId(p.id, id));
  const fallbackType = find('courses') || types[0];
  const fallbackId = fallbackType ? fallbackType.id : '';

  // course title → program, taken from the shipped defaults (helps to place old saved courses sensibly)
  const byTitle = new Map((defaults?.courses?.items || []).map((i) => [String(i.title).trim(), i.program]));

  const items = (Array.isArray(courses.items) ? courses.items : []).map((it) => {
    const own = find(it.program);
    if (own) return own.id === it.program ? it : { ...it, program: own.id };
    const guess = find(byTitle.get(String(it.title).trim()));
    return { ...it, program: (guess || fallbackType || {}).id ?? fallbackId };
  });

  const out = { ...content, courses: { ...courses, programs: types, items } };

  if (content.programs) {
    const featured = (Array.isArray(content.programs.items) ? content.programs.items : []).map((it) => {
      // older data stored the program id in `category`
      const own = find(it.program) || find(it.category);
      return { ...it, program: own ? own.id : fallbackId };
    });
    out.programs = { ...content.programs, items: featured };
  }
  return out;
}
