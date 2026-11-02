/* Original FAQ illustration: a clay-style figure leaning on a big question mark (drawn as inline SVG,
   uses the theme colour var(--red) so it follows the dashboard colours). */
export default function FaqIllustration() {
  return (
    <svg className="fq-art" viewBox="0 0 460 480" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fqRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--red)' }} />
          <stop offset="1" style={{ stopColor: 'var(--red-dark)' }} />
        </linearGradient>
        <linearGradient id="fqGray" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbfbfc" />
          <stop offset="1" stopColor="#c4c4cc" />
        </linearGradient>
        <radialGradient id="fqHead" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9b9c3" />
        </radialGradient>
      </defs>

      <ellipse className="fq-art__shadow" cx="236" cy="456" rx="176" ry="15" />

      {/* question mark */}
      <g className="fq-art__q">
        <path d="M262 172C262 94 392 90 396 174C399 234 322 244 322 308" fill="none" stroke="url(#fqRed)" strokeWidth="54" strokeLinecap="round" />
        <path d="M262 172C262 94 392 90 396 174C399 234 322 244 322 308" fill="none" stroke="#fff" strokeOpacity=".26" strokeWidth="11" strokeLinecap="round" transform="translate(-9 -9)" />
        <circle cx="322" cy="394" r="33" fill="url(#fqRed)" />
        <circle cx="311" cy="383" r="9" fill="#fff" fillOpacity=".3" />
      </g>

      {/* figure */}
      <g className="fq-art__p">
        <path d="M108 300L103 424" stroke="url(#fqGray)" strokeWidth="40" strokeLinecap="round" fill="none" />
        <path d="M156 300L164 424" stroke="url(#fqGray)" strokeWidth="40" strokeLinecap="round" fill="none" />
        <ellipse cx="98" cy="442" rx="31" ry="12" fill="#b5b5bf" />
        <ellipse cx="172" cy="442" rx="33" ry="12" fill="#b5b5bf" />
        <path d="M84 198C84 168 180 168 180 198L176 314C152 328 112 328 88 314Z" fill="url(#fqGray)" />
        <path d="M96 214C118 206 146 206 168 214" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="8" strokeLinecap="round" />
        <path d="M88 207C62 242 58 284 72 322" stroke="url(#fqGray)" strokeWidth="25" strokeLinecap="round" fill="none" />
        <path d="M174 210C206 232 234 238 264 216" stroke="url(#fqGray)" strokeWidth="25" strokeLinecap="round" fill="none" />
        <circle cx="268" cy="214" r="15" fill="url(#fqGray)" />
        <rect x="118" y="160" width="26" height="26" rx="11" fill="#cfcfd6" />
        <circle cx="131" cy="128" r="41" fill="url(#fqHead)" />
      </g>

      {/* sparkles */}
      <g className="fq-art__spark">
        <circle cx="410" cy="76" r="7" style={{ fill: 'var(--red)' }} />
        <circle cx="224" cy="62" r="5" style={{ fill: 'var(--navy)' }} />
        <circle cx="436" cy="268" r="6" style={{ fill: 'var(--navy)' }} />
        <circle cx="48" cy="86" r="6" style={{ fill: 'var(--red)' }} />
      </g>
    </svg>
  );
}
