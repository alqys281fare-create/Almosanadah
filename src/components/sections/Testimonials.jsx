import { useCallback, useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';

const AUTOPLAY_MS = 3500;

const initials = (name = '') =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function Stars({ value }) {
  const n = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  return (
    <span className="tx-stars" role="img" aria-label={`${n} / 5`}>
      {'★'.repeat(n)}
      <span className="tx-stars__off">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

/* Arrow is PHYSICAL only.
   'next' always points right  → sits on the right
   'prev' always points left   → sits on the left
   Same in LTR and RTL. No dir-awareness, no inversion. */
function Arrow({ direction = 'next' }) {
  const pointsRight = direction === 'next';
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={pointsRight ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M9.6 7.2c-2.2 1-3.6 3-3.6 5.4 0 2.4 1.5 4.2 3.6 4.2 1.8 0 3.1-1.2 3.1-2.9 0-1.6-1.1-2.7-2.6-2.7-.2 0-.4 0-.6.1.3-1.3 1.3-2.4 2.6-3.1l-2.5-1zm8.4 0c-2.2 1-3.6 3-3.6 5.4 0 2.4 1.5 4.2 3.6 4.2 1.8 0 3.1-1.2 3.1-2.9 0-1.6-1.1-2.7-2.6-2.7-.2 0-.4 0-.6.1.3-1.3 1.3-2.4 2.6-3.1l-2.5-1z" />
    </svg>
  );
}

export default function Testimonials() {
  const { content } = useContent();
  const tt = content.testimonials;
  const items = tt.items;
  const count = items.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 700 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goTo = useCallback(
    (next) => setIndex(count ? ((next % count) + count) % count : 0),
    [count]
  );

  useEffect(() => {
    if (paused || count <= perView) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count, perView]);

  if (!count) return null;

  const visible = Array.from({ length: perView }, (_, i) => ({
    item: items[(index + i) % count],
    slot: i,
  }));

  const showNav = count > 1;

  const prevLabel = tt.prevLabel || tt.previousLabel || 'Previous testimonial';
  const nextLabel = tt.nextLabel || 'Next testimonial';

  return (
    /* NOTE: no dir attribute here — inherits the page dir naturally.
       The section itself must NOT flip the slider layout. */
    <section className="tx" id="testimonials" aria-labelledby="testimonials-title">
      <SectionDivider from="var(--card)" variant="tilt" flip />
      <div className="container">
        <Reveal direction="up" className="section-head">
          <h2 className="section-title" id="testimonials-title">
            <span className="section-title__line" />
            {tt.title}
            <span className="section-title__line" />
          </h2>
        </Reveal>

        <div
          className="tx-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label={tt.title}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
         

          <div className="tx-track" key={index} style={{ '--per-view': perView }}>
            {visible.map(({ item: it, slot }) => (
              <figure
                className="tx-card"
                key={`${slot}-${it.id ?? it.name}`}
                style={{ animationDelay: `${slot * 110}ms` }}
              >
                <span className="tx-card__glow" aria-hidden="true" />

                <div className="tx-card__top">
                  <span className="tx-avatar">
                    {it.image ? (
                      <img src={it.image} alt={it.name} loading="lazy" />
                    ) : (
                      <b aria-hidden="true">{initials(it.name)}</b>
                    )}
                  </span>
                  <div className="tx-card__who">
                    <strong>{it.name}</strong>
                    {it.meta && <small dir="auto">{it.meta}</small>}
                  </div>
                  <span className="tx-quote">
                    <QuoteIcon />
                  </span>
                </div>

                <div className="tx-card__rating">
                  <Stars value={it.rating} />
                </div>

                <blockquote className="tx-card__text">{it.text}</blockquote>

                <span className="tx-card__accent" aria-hidden="true" />
              </figure>
            ))}
          </div>

          
        </div>
      </div>
    </section>
  );
}