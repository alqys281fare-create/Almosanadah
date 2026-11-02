
import { useMemo, useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import useSlider from '../../hooks/useSlider.js';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';

export default function Accreditation() {
  const { content } = useContent();
  const { dir } = useLang();
  const a = content.accreditation;

  // Hide tabs that have no items
  const tabs = useMemo(
    () =>
      a.tabs.filter((t) =>
        a.items.some((it) => it.category === t.id)
      ),
    [a.tabs, a.items]
  );

  const [tab, setTab] = useState(() => tabs[0]?.id ?? 'all');

  const active =
    tab === 'all' || tabs.some((t) => t.id === tab)
      ? tab
      : tabs[0]?.id ?? 'all';

  // Filter items according to selected tab
  const list = useMemo(
    () =>
      active === 'all'
        ? a.items
        : a.items.filter((it) => it.category === active),
    [active, a.items]
  );

  // Continuous one-item slider
  const {
    page,
    pages,
    perView,
    setPage,
    start,
    end,
    hover,
  } = useSlider(list.length, {
    views: [
      [520, 2],
      [800, 3],
      [1100, 4],
      [Infinity, 5],
    ],
    autoplay: 5000,
    step: 1,
  });

  if (!a.items.length) return null;

  // Change category and reset slider
  const choose = (id) => {
    setTab(id);
    setPage(0);
  };

  return (
    <section
      className="ax"
      id="accreditation"
      aria-labelledby="accreditation-title"
    >
      <SectionDivider from="var(--bg)" variant="curve" />

      <div className="container">

        {/* Section heading */}
        <Reveal direction="up" className="section-head">
          <h2 className="section-title">
            <span className="section-title__line" />
            {a.title}
            <span className="section-title__line" />
          </h2>
        </Reveal>

        {/* Category tabs */}
        {tabs.length > 1 && (
          <Reveal
            direction="up"
            className="gx-tabs"
            role="tablist"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === t.id}
                className={`gx-tab ${
                  active === t.id ? 'is-active' : ''
                }`}
                onClick={() => choose(t.id)}
              >
                {t.icon && (
                  <Icon name={t.icon} size={18} />
                )}
                {t.label}
              </button>
            ))}

            <button
              type="button"
              role="tab"
              aria-selected={active === 'all'}
              className={`gx-tab gx-tab--all ${
                active === 'all' ? 'is-active' : ''
              }`}
              onClick={() => choose('all')}
            >
              {a.allLabel}

              <Icon
                name={dir === 'rtl' ? 'arrowLeft' : 'arrowRight'}
                size={18}
              />
            </button>
          </Reveal>
        )}

        {/* Slider */}
        <div
          className="ax-slider"
          {...hover}
          role="region"
          aria-roledescription="carousel"
          aria-label={a.title}
        >
          <ul
            className="ax-track"
            key={`${active}-${page}-${perView}`}
            style={{ '--per-view': perView }}
          >
            {list.slice(start, end).map((it, i) => (
              <li
                className="ax-card"
                key={it.id}
                style={{
                  animationDelay: `${i * 110}ms`,
                }}
              >
                <span className="ax-card__logo">
                  {it.logo ? (
                    <img
                      src={it.logo}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <Icon
                      name="cert"
                      size={44}
                      stroke={1.4}
                    />
                  )}
                </span>

                <span className="ax-card__name">
                  {it.name}
                </span>
              </li>
            ))}
          </ul>

          {/* Pagination indicators */}
          {pages > 1 && (
            <div
              className="dots"
              role="tablist"
              aria-label={a.title}
            >
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`${i + 1} / ${pages}`}
                  className={`dots__dot ${
                    i === page ? 'is-active' : ''
                  }`}
                  onClick={() => setPage(i)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
