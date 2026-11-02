
const wave = (amp, base = 64) => {
  let d = `M0 ${base}`;
  for (let i = 0; i < 4; i += 1) {
    const x = i * 720;
    d += ` C${x + 180} ${base - amp} ${x + 540} ${base + amp} ${x + 720} ${base}`;
  }
  return `${d} L2880 0 L0 0 Z`;
};
const FRONT = wave(34);
const BACK = wave(46, 58);

export default function SectionDivider({ from = 'var(--card)', variant = 'wave', flip = false }) {
  return (
    <div className={`sd sd--${variant} ${flip ? 'sd--flip' : ''}`} style={{ '--sd-fill': from }} aria-hidden="true">
      {variant === 'wave' && (
        <>
          <svg className="sd__layer sd__layer--back" viewBox="0 0 2880 120" preserveAspectRatio="none">
            <path d={BACK} />
          </svg>
          <svg className="sd__layer sd__layer--front" viewBox="0 0 2880 120" preserveAspectRatio="none">
            <path d={FRONT} />
          </svg>
        </>
      )}
      {variant === 'curve' && (
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0 0H1440V26C1120 112 320 112 0 26Z" />
        </svg>
      )}
      {variant === 'tilt' && (
        <>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path className="sd__echo" d="M0 0H1440V70L0 118Z" />
            <path d="M0 0H1440V30L0 92Z" />
          </svg>
        </>
      )}
    </div>
  );
}
