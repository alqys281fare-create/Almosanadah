
import { useEffect, useMemo, useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';

const AUTOPLAY_MS = 3000;

const BREAKPOINTS = [
  [480, 2],
  [700, 3],
  [1000, 4],
  [Infinity, 5],
];

function getPerView() {
  const width = typeof window === 'undefined'
    ? 1200
    : window.innerWidth;

  return (
    BREAKPOINTS.find(([max]) => width <= max) ||
    BREAKPOINTS[BREAKPOINTS.length - 1]
  )[1];
}

export default function Partners() {
  const { content } = useContent();
  const p = content.partners;

  const items = p?.items || [];
  const total = items.length;

  const [perView, setPerView] = useState(getPerView);
  const [index, setIndex] = useState(0);

  // Pause independently for mouse and keyboard interaction.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const paused = hovered || focused;

  /* Responsive layout */
  useEffect(() => {
    const onResize = () => {
      setPerView(getPerView());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /* Reset position when layout or content changes */
  useEffect(() => {
    setIndex(0);
  }, [perView, total]);

  const canLoop = total > perView;

  /* Move one item every 3 seconds */
  useEffect(() => {
    if (!canLoop || paused) return undefined;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [canLoop, paused, total]);

  /* Visible rolling window */
  const visible = useMemo(() => {
    if (!total) return [];

    const count = Math.min(perView, total);

    return Array.from({ length: count }, (_, slot) => ({
      item: items[(index + slot) % total],
      slot,
    }));
  }, [items, index, perView, total]);

  /* Navigate to a specific position */
  const goTo = (target) => {
    if (!canLoop) return;

    setIndex(((target % total) + total) % total);
  };

  if (!total) return null;

  return (
    <section
      className="pt"
      id="partners"
      aria-labelledby="partners-title"
    >
      <SectionDivider
        from="var(--tone-cool)"
        variant="curve"
      />

      <div className="container">

        {/* Heading */}
        <Reveal direction="up" className="section-head">
          <h2 className="section-title" id="partners-title">
            <span className="section-title__line" />
            {p.title}
            <span className="section-title__line" />
          </h2>

          {p.subtitle && (
            <p className="section-desc">
              {p.subtitle}
            </p>
          )}
        </Reveal>

        {/* Partners slider */}
        <Reveal direction="up" delay={120}>
          <div
            className="pt-slider"
            role="region"
            aria-roledescription="carousel"
            aria-label={p.title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setFocused(false);
              }
            }}
          >
            <div className="pt-viewport">

              <ul
                className={`pt-track ${
                  !canLoop ? 'pt-track--centered' : ''
                }`}
                key={index}
                style={{ '--per-view': perView }}
              >
                {visible.map(({ item: it, slot }) => {
                  const logo = (
                    <span className="pt-logo">
                      {it.logo ? (
                        <img
                          src={it.logo}
                          alt={it.name || ''}
                          loading="lazy"
                        />
                      ) : (
                        <b aria-hidden="true">
                          {(it.name || '?').trim().charAt(0)}
                        </b>
                      )}
                    </span>
                  );

                  return (
                    <li
                      className="pt-item"
                      key={`${slot}-${it.id ?? it.name}`}
                      style={{
                        animationDelay: `${slot * 110}ms`,
                      }}
                      title={it.name}
                    >
                      {it.href ? (
                        <a
                          href={it.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={it.name}
                        >
                          {logo}
                        </a>
                      ) : (
                        logo
                      )}
                    </li>
                  );
                })}
              </ul>

            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
