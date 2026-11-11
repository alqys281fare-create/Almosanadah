/*
 * Home page sections the admin can re-order / hide (dashboard → «ترتيب أقسام الصفحة الرئيسية»).
 *
 *  - `pinned` sections always stay at the top, in this order: the first screen (hero + features) is laid
 *    out to fill exactly one viewport, so it cannot be moved without leaving a gap.
 *  - `bg` is the CSS colour the section paints, so the wave / curve divider at the top of the NEXT
 *    section can blend into it whatever the order is (see SectionFlow in components/common).
 *  - `anchor` is the element id the header links (#about, #contact …) scroll to.
 */
export const PINNED_SECTIONS = ['hero', 'features'];

export const HOME_SECTIONS = {
  hero: { label: { ar: 'القسم الرئيسي', en: 'Hero' }, bg: 'var(--bg)' },
  features: { label: { ar: 'المميزات', en: 'Features' }, bg: 'var(--card)' },
  programs: { label: { ar: 'البرامج والدبلومات', en: 'Programs' }, bg: 'var(--bg)', anchor: 'programs' },
  about: { label: { ar: 'من نحن', en: 'About' }, bg: 'var(--card)', anchor: 'about' },
  stats: { label: { ar: 'الإحصائيات', en: 'Stats' }, bg: 'var(--tone-stats-bottom)', anchor: 'stats' },
  gallery: { label: { ar: 'معرض الصور', en: 'Gallery' }, bg: 'var(--bg)', anchor: 'gallery' },
  branches: { label: { ar: 'اكتشف فروعنا', en: 'Branches banner' }, bg: 'var(--bg)' },
  accreditation: { label: { ar: 'الاعتماد', en: 'Accreditation' }, bg: 'var(--card)', anchor: 'accreditation' },
  testimonials: { label: { ar: 'آراء الطلاب', en: 'Testimonials' }, bg: 'var(--tone-cool)', anchor: 'testimonials' },
  partners: { label: { ar: 'الشركاء', en: 'Partners' }, bg: 'var(--card)', anchor: 'partners' },
  faq: { label: { ar: 'الأسئلة الشائعة', en: 'FAQ' }, bg: 'var(--bg)', anchor: 'faq' },
  contact: { label: { ar: 'تواصل معنا', en: 'Contact' }, bg: 'var(--card)', anchor: 'contact' },
};

/* The order the site shipped with — also the fallback for any missing / unknown id. */
export const DEFAULT_HOME_ORDER = [
  'hero',
  'features',
  'programs',
  'about',
  'stats',
  'gallery',
  'branches',
  'accreditation',
  'testimonials',
  'partners',
  'faq',
  'contact',
];

export const MOVABLE_SECTIONS = DEFAULT_HOME_ORDER.filter((id) => !PINNED_SECTIONS.includes(id));

/*
 * Turns whatever is stored (old saves have nothing) into a safe layout:
 * pinned sections first, then the saved order without duplicates / unknown ids,
 * then any section the saved order does not mention yet (so new sections never disappear).
 */
export function normalizeHomeLayout(layout) {
  const savedOrder = Array.isArray(layout?.order) ? layout.order : [];
  const hidden = new Set((Array.isArray(layout?.hidden) ? layout.hidden : []).filter((id) => MOVABLE_SECTIONS.includes(id)));

  const seen = new Set();
  const movable = [];
  [...savedOrder, ...MOVABLE_SECTIONS].forEach((id) => {
    if (MOVABLE_SECTIONS.includes(id) && !seen.has(id)) {
      seen.add(id);
      movable.push(id);
    }
  });

  return { order: [...PINNED_SECTIONS, ...movable], hidden: [...hidden] };
}
