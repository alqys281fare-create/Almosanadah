/*
 * Advertisement helpers.
 *
 * content.ads (stored separately per language, so Arabic and English never share an image):
 *   enabled  boolean
 *   label    small «Ad» tag above every poster
 *   slots    exactly four positions, in this order:
 *            left-1, left-2 (left side)  ·  right-1, right-2 (right side)
 *            each: { id, side, image, href, title, text }
 *
 * `side` is the PHYSICAL side of the screen ('left' | 'right'), regardless of the page language.
 * Older saves used leftImage / leftHref / leftTitle / leftText (and the same for right):
 * normalizeAds() maps them onto the first slot of that side so nothing uploaded before is lost.
 */

export const AD_SLOT_DEFS = [
  { id: 'left-1', side: 'left' },
  { id: 'left-2', side: 'left' },
  { id: 'right-1', side: 'right' },
  { id: 'right-2', side: 'right' },
];

const FIELDS = ['image', 'href', 'title', 'text'];

export function normalizeAds(ads, defaults) {
  if (!ads || typeof ads !== 'object') return ads;
  const saved = Array.isArray(ads.slots) ? ads.slots : [];
  const base = Array.isArray(defaults?.slots) ? defaults.slots : [];

  const slots = AD_SLOT_DEFS.map((def) => {
    const own = saved.find((s) => s && s.id === def.id);
    const dflt = base.find((s) => s && s.id === def.id) || {};
    const out = { ...dflt, ...(own || {}), id: def.id, side: def.side };
    // legacy single poster per side → first slot of that side
    if (!own && def.id.endsWith('-1')) {
      FIELDS.forEach((f) => {
        const legacy = ads[`${def.side}${f[0].toUpperCase()}${f.slice(1)}`];
        if (legacy) out[f] = legacy;
      });
    }
    FIELDS.forEach((f) => {
      if (typeof out[f] !== 'string') out[f] = '';
    });
    return out;
  });

  return { ...ads, slots };
}

export const slotsOf = (ads, side) => (ads?.slots || []).filter((s) => s.side === side);
