/*
 * Stylised map of Saudi Arabia (equirectangular, 1° = 10 units) with pins.
 * Branches are placed by latitude / longitude, so the admin only has to paste
 * the coordinates from Google Maps.
 *   x = (lng - 34) * 10      y = (33 - lat) * 10      viewBox 220 × 170
 */
const W = 220;
const H = 170;

export const project = (lat, lng) => ({
  x: Math.min(100, Math.max(0, ((Number(lng) - 34) / (W / 10)) * 100)),
  y: Math.min(100, Math.max(0, ((33 - Number(lat)) / (H / 10)) * 100)),
});

const OUTLINE = [
  [34.95, 29.35], [35.7, 27.4], [36.6, 26.2], [37.3, 25.0], [38.0, 24.1], [39.0, 22.0], [39.5, 21.0], [40.5, 19.5],
  [41.2, 18.2], [42.6, 16.9], [43.2, 17.3], [44.2, 17.4], [46.3, 17.2], [47.0, 16.95], [48.2, 18.2], [49.1, 18.6],
  [52.0, 19.0], [54.9, 20.0], [55.65, 21.1], [55.2, 22.7], [52.6, 22.9], [51.6, 24.25], [50.8, 24.75], [50.85, 25.8],
  [50.1, 26.5], [49.65, 27.1], [48.9, 27.8], [48.4, 28.5], [47.7, 28.55], [46.6, 29.1], [44.7, 29.2], [42.0, 31.1],
  [39.2, 32.1], [37.0, 31.5], [36.7, 29.9],
];
const d = `M${OUTLINE.map(([lng, lat]) => `${((lng - 34) * 10).toFixed(1)},${((33 - lat) * 10).toFixed(1)}`).join(' L')}Z`;

function Pin({ x, y, active, name, id, onHover, label }) {
  return (
    <button
      type="button"
      className={`map-pin ${active ? 'is-active' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => onHover?.(id)}
      onFocus={() => onHover?.(id)}
      aria-label={name}
    >
      <svg viewBox="0 0 24 30" width="100%" height="100%" aria-hidden="true">
        <path d="M12 29S2 18.5 2 11.5A10 10 0 0122 11.5C22 18.5 12 29 12 29z" fill="currentColor" />
        <circle cx="12" cy="11.5" r="3.6" fill="#fff" />
      </svg>
      {label && <span className="map-pin__label">{name}</span>}
    </button>
  );
}

export default function SaudiMap({ points = [], activeId, onHover, labels = false, mini = false }) {
  return (
    <div className={`saudi-map ${mini ? 'saudi-map--mini' : ''}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="saudi-map__svg" role="img" aria-label="Saudi Arabia">
        <path d={d} className="saudi-map__land" />
      </svg>
      {points.map((p, i) => (
        <Pin key={p.id ?? i} {...p} active={activeId != null && activeId === p.id} onHover={onHover} label={labels} />
      ))}
    </div>
  );
}
