// Small colour helpers used by the theme system.

export const isHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v || '').trim());

export const normalizeHex = (v, fallback = '#000000') => {
  if (!isHex(v)) return fallback;
  let h = v.trim().slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return `#${h.toLowerCase()}`;
};

export const hexToRgb = (hex) => {
  const h = normalizeHex(hex).slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
export const rgbToHex = ([r, g, b]) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

// amount 0..1 → blend toward black / white
export const darken = (hex, amount) => rgbToHex(hexToRgb(hex).map((c) => c * (1 - amount)));
export const mix = (hex, other, amount) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(other);
  return rgbToHex(a.map((c, i) => c * (1 - amount) + b[i] * amount));
};
export const lighten = (hex, amount) => mix(hex, '#ffffff', amount);

// WCAG relative luminance / contrast ratio
const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
