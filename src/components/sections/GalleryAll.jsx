// src/components/sections/GalleryAll.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import SiteFrame from '../layout/SiteFrame.jsx';
import PageBanner from '../pages/PageBanner.jsx';

export default function GalleryAll() {
  const { content } = useContent();
  const { dir } = useLang();
  const g = content.gallery;

  const [tab, setTab] = useState('all');
  const [openIdx, setOpenIdx] = useState(-1);

  const labelOf = useMemo(
    () => Object.fromEntries(g.tabs.map((t) => [t.id, t.label])),
    [g.tabs]
  );

  const list = useMemo(
    () => (tab === 'all' ? g.items : g.items.filter((it) => it.category === tab)),
    [tab, g.items]
  );

  /* start at the top of the page */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  /* closing / changing filter resets the lightbox */
  useEffect(() => setOpenIdx(-1), [tab]);

  /* keyboard + scroll lock while the lightbox is open */
  useEffect(() => {
    if (openIdx < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIdx(-1);
      else if (e.key === 'ArrowRight')
        setOpenIdx((i) => (i + 1) % list.length);
      else if (e.key === 'ArrowLeft')
        setOpenIdx((i) => (i - 1 + list.length) % list.length);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openIdx, list.length]);

  if (!g.items.length) return null;

  const current = openIdx >= 0 ? list[openIdx] : null;
  const backArrow = dir === 'rtl' ? 'arrowRight' : 'arrowLeft';

  return (
    <>
      <Header />

      <SiteFrame>
      <main className="ga" id="gallery-all">
        <PageBanner title={g.title} subtitle={g.subtitle} image={g.banner} />

        <div className="container">
          {/* ---------- filter tabs ---------- */}
          <Reveal direction="up" className="gx-tabs" role="tablist">
            {g.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`gx-tab ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon && <Icon name={t.icon} size={18} />}
                {t.label}
              </button>
            ))}
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'all'}
              className={`gx-tab  ${
                tab === 'all' ? 'is-active' : ''
              }`}
              onClick={() => setTab('all')}
            >
              {g.allLabel}
              <Icon
                name={dir === 'rtl' ? 'arrowLeft' : 'arrowRight'}
                size={18}
              />
            </button>
          </Reveal>

          {/* ---------- grid ---------- */}
          {list.length === 0 ? (
            <p className="empty">{g.empty}</p>
          ) : (
            <div className="ga-grid" key={tab}>
              {list.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  className="ga-card"
                  onClick={() => setOpenIdx(i)}
                  aria-label={it.title}
                >
                  <span className="ga-card__media">
                    {it.image ? (
                      <img src={it.image} alt={it.title} loading="lazy" />
                    ) : (
                      <span className="ga-card__ph" aria-hidden="true">
                        <Icon name="image" size={34} />
                      </span>
                    )}
                  </span>
                  <span className="ga-card__body">
                    <strong>{it.title}</strong>
                    <span className="gx-card__meta">
                      {labelOf[it.category] && (
                        <em>{labelOf[it.category]}</em>
                      )}
                      {labelOf[it.category] && it.date && (
                        <i aria-hidden="true">•</i>
                      )}
                      {it.date && <time>{it.date}</time>}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- lightbox ---------- */}
        {current && (
          <div
            className="ga-lb"
            role="dialog"
            aria-modal="true"
            onClick={(e) =>
              e.target === e.currentTarget && setOpenIdx(-1)
            }
          >
            <div className="ga-lb__bar">
              <span className="ga-lb__counter">
                {openIdx + 1} / {list.length}
              </span>
              <button
                type="button"
                className="ga-lb__btn"
                onClick={() => setOpenIdx(-1)}
                aria-label="Close"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="ga-lb__stage">
              <button
                type="button"
                className="ga-lb__nav ga-lb__nav--prev"
                onClick={() =>
                  setOpenIdx((i) => (i - 1 + list.length) % list.length)
                }
                aria-label="Previous"
              >
                <Icon
                  name={dir === 'rtl' ? 'arrowRight' : 'arrowLeft'}
                  size={22}
                />
              </button>

              {current.image ? (
                <img src={current.image} alt={current.title} />
              ) : (
                <Icon name="image" size={64} />
              )}

              <button
                type="button"
                className="ga-lb__nav ga-lb__nav--next"
                onClick={() => setOpenIdx((i) => (i + 1) % list.length)}
                aria-label="Next"
              >
                <Icon
                  name={dir === 'rtl' ? 'arrowLeft' : 'arrowRight'}
                  size={22}
                />
              </button>
            </div>

            <div className="ga-lb__caption">
              <strong>{current.title}</strong>
              <span>
                {labelOf[current.category]}
                {labelOf[current.category] && current.date ? ' • ' : ''}
                {current.date}
              </span>
            </div>
          </div>
        )}
      </main>
        <Footer />
      </SiteFrame>

    </>
  );
}