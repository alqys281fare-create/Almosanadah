import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';

const AUTOPLAY_MS = 5000;

export default function Gallery() {
  const { content } = useContent();
  const { dir } = useLang();
  const g = content.gallery;
  const isRtl = dir === 'rtl';

  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef(null);

  const tab = selected ?? g.tabs[0]?.id ?? 'all';

  const labelOf = useMemo(
    () => Object.fromEntries(g.tabs.map((t) => [t.id, t.label])),
    [g.tabs]
  );

  const list = useMemo(
    () => (tab === 'all' ? g.items : g.items.filter((it) => it.category === tab)),
    [tab, g.items]
  );

  const total = list.length;
  const safeIndex = total === 0 ? 0 : Math.min(index, total - 1);

  const selectTab = (id) => {
    setSelected(id);
    setIndex(0);
  };

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [paused, total, safeIndex, tab]);

  /* Custom scroll logic that handles both RTL and LTR flawlessly */
  const scrollToItem = (el, behavior = 'smooth') => {
    const box = listRef.current;
    if (!box || !el) return;

    const b = box.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    const cs = getComputedStyle(box);
    const isRow = cs.flexDirection.startsWith('row');

    if (isRow) {
      // Horizontal scrolling (Mobile)
      const delta = e.left + e.width / 2 - (b.left + b.width / 2);
      if (Math.abs(delta) > 1) {
        box.scrollBy({ left: delta, behavior });
      }
    } else {
      // Vertical scrolling (Desktop)
      const delta = e.top + e.height / 2 - (b.top + b.height / 2);
      if (Math.abs(delta) > 1) {
        box.scrollBy({ top: delta, behavior });
      }
    }
  };

  /* When tab changes, instantly snap to the first item to prevent janky animations */
  useLayoutEffect(() => {
    const box = listRef.current;
    if (!box) return;
    const el = box.children[0];
    if (el) {
      box.style.scrollBehavior = 'auto';
      scrollToItem(el, 'auto');
      box.style.scrollBehavior = '';
    }
  }, [tab]);

  /* When active slide changes, smoothly center it */
  useEffect(() => {
    const box = listRef.current;
    const el = box?.children[safeIndex];
    if (!box || !el) return;
    scrollToItem(el, 'smooth');
  }, [safeIndex]);

  if (!g.items.length) return null;

  const go = (i) => {
    if (total === 0) return;
    setIndex(((i % total) + total) % total);
  };

  const pad = (n) => String(n).padStart(2, '0');

  const prevIcon = isRtl ? 'arrowRight' : 'arrowLeft';
  const nextIcon = isRtl ? 'arrowLeft' : 'arrowRight';
  const upNext = g.upNext ?? (isRtl ? 'التالي' : 'Up next');

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(safeIndex + (isRtl ? -1 : 1));
    if (e.key === 'ArrowLeft') go(safeIndex + (isRtl ? 1 : -1));
  };

  return (
    <section className="tv" id="gallery" aria-labelledby="gallery-title">
      <SectionDivider from="var(--tone-stats-bottom)" variant="wave" flip />

      <div className="tv__wrap">
        <Reveal direction="up" className="section-head tv__head">
          <h2 className="section-title tv__title" id="gallery-title">
            <span className="section-title__line" />
            {g.title}
            <span className="section-title__line" />
          </h2>
        </Reveal>

        <Reveal direction="up" className="tv__tabs" role="tablist">
          {g.tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`tv__tab ${active ? 'is-active' : ''}`}
                onClick={() => selectTab(t.id)}
              >
                <span className="tv__tab-dot" aria-hidden="true" />
                {t.icon && <Icon name={t.icon} size={18} />}
                {t.label}
              </button>
            );
          })}
          <Link to="/gallery" className="tv__tab tv__tab--all">
            {g.allLabel}
            <Icon name={isRtl ? 'arrowLeft' : 'arrowRight'} size={18} />
          </Link>
        </Reveal>

        {total === 0 ? (
          <p className="tv__empty">{g.empty}</p>
        ) : (
          <div className="tv__stage">
            <div className="tv__frame">
              <div
                className="tv__screen"
                tabIndex={0}
                onKeyDown={onKey}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              >
                {list.map((it, i) => {
                  const active = i === safeIndex;
                  const cat = labelOf[it.category];
                  return (
                    <article
                      key={it.id}
                      className={`tv__slide ${active ? 'is-active' : ''}`}
                      aria-hidden={!active}
                    >
                      {it.image ? (
                        <img
                          className="tv__img"
                          src={it.image}
                          alt={it.title}
                          loading={i < 2 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        <span className="tv__ph" aria-hidden="true">
                          <Icon name="image" size={64} />
                        </span>
                      )}

                      <div className="tv__caption">
                        {cat && <span className="tv__cat">{cat}</span>}
                        <h3>{it.title}</h3>
                        {it.date && <time>{it.date}</time>}
                      </div>
                    </article>
                  );
                })}

                <div className="tv__count" aria-hidden="true">
                  {pad(safeIndex + 1)}
                  <span>/</span>
                  {pad(total)}
                </div>

                {total > 1 && (
                  <>
                    <button
                      type="button"
                      className="tv__arrow tv__arrow--prev"
                      onClick={() => go(safeIndex - 1)}
                      aria-label="Previous"
                    >
                      <Icon name={prevIcon} size={22} />
                    </button>
                    <button
                      type="button"
                      className="tv__arrow tv__arrow--next"
                      onClick={() => go(safeIndex + 1)}
                      aria-label="Next"
                    >
                      <Icon name={nextIcon} size={22} />
                    </button>

                    <div className={`tv__bar ${paused ? 'is-paused' : ''}`}>
                      <span key={`${tab}-${safeIndex}`} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <aside className="tv__side" aria-label={upNext}>
              <div className="tv__side-in">
                <h4 className="tv__side-title">
                  <i /> {upNext}
                </h4>
                <div className="tv__list" ref={listRef}>
                  {list.map((it, i) => (
                    <button
                      key={it.id}
                      type="button"
                      className={`tv__item ${i === safeIndex ? 'is-active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-label={it.title}
                      aria-current={i === safeIndex}
                    >
                      <span className="tv__thumb">
                        {it.image ? (
                          <img src={it.image} alt="" loading="lazy" />
                        ) : (
                          <Icon name="image" size={26} />
                        )}
                        <em>{pad(i + 1)}</em>
                      </span>
                      <span className="tv__item-text">
                        <strong>{it.title}</strong>
                        <small>
                          {labelOf[it.category]}
                          {labelOf[it.category] && it.date ? ' • ' : ''}
                          {it.date}
                        </small>
                      </span>
                      {i === safeIndex && total > 1 && (
                        <span
                          key={`${tab}-${safeIndex}`}
                          className={`tv__item-bar ${paused ? 'is-paused' : ''}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}