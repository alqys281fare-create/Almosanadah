import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';

export default function TabSlider({
  tabs,
  active,
  onChange,
  items,
  renderItem,
  labels,
  idPrefix = 'ts',
}) {
  const { dir } = useLang();
  const rtl = dir === 'rtl';

  /* ---------- tabs ---------- */
  const tabRefs = useRef({});
  const barRef = useRef(null);
  const firstRun = useRef(true);

  // Keep the selected tab visible inside the tab bar. Only the bar itself is scrolled — never the page
  // (scrollIntoView would also scroll every ancestor, which made the whole layout jump sideways).
  useLayoutEffect(() => {
    const bar = barRef.current;
    const el = tabRefs.current[active];
    if (!bar || !el) return;
    if (bar.scrollWidth <= bar.clientWidth + 1) return;
    const b = bar.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    const delta = t.left + t.width / 2 - (b.left + b.width / 2); // physical → correct in RTL and LTR
    bar.scrollBy({ left: delta, behavior: firstRun.current ? 'auto' : 'smooth' });
    firstRun.current = false;
  }, [active, tabs.length]);

  const onTabKey = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    let n = i;
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) n = (i + 1) % tabs.length;
    else if (e.key === backward) n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].id);
    tabRefs.current[tabs[n].id]?.focus();
  };

  /* ---------- slider ---------- */
  const track = useRef(null);
  const [state, setState] = useState({ prev: false, next: false, progress: 0, thumb: 1, scrollable: false });
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });
  const [dragging, setDragging] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    setState({
      scrollable: max > 4,
      prev: pos > 4,
      next: pos < max - 4,
      progress: max > 0 ? Math.min(1, pos / max) : 0,
      thumb: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
    });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return undefined;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [update, active, items.length]);

  const step = (dirSign) => {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const w = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const count = Math.max(1, Math.floor(el.clientWidth / w));
    el.scrollBy({ left: dirSign * (rtl ? -1 : 1) * w * count, behavior: 'smooth' });
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(rtl ? -1 : 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(rtl ? 1 : -1);
    }
  };

  /* mouse drag (touch already scrolls natively) */
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = track.current;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      track.current.setPointerCapture?.(e.pointerId);
    }
    if (d.moved) track.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved) {
      setDragging(false);
      // swallow the click that follows a drag so a card is not opened by accident
      setTimeout(() => {
        d.moved = false;
      }, 0);
    }
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const panelId = `${idPrefix}-panel`;

  return (
    <div className="ts">
      <div className="ts-tabs" role="tablist" aria-label={labels.tabsLabel} onKeyDown={onTabKey}>
        <div className="ts-tabs__inner" ref={barRef}>
          {tabs.map((t) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`${idPrefix}-tab-${t.id}`}
                aria-selected={on}
                aria-controls={panelId}
                tabIndex={on ? 0 : -1}
                className={`ts-tab ${on ? 'is-active' : ''}`}
                onClick={() => onChange(t.id)}
              >
                <span className="ts-tab__label">{t.label}</span>
                {t.count != null && <span className="ts-tab__count">{t.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ts-panel" key={active} id={panelId} role="tabpanel" aria-labelledby={`${idPrefix}-tab-${active}`}>
        {items.length === 0 ? (
          <p className="ts-empty">{labels.emptyTab}</p>
        ) : (
          <div className="ts-stage">
            <button
              type="button"
              className="ts-btn ts-btn--prev"
              onClick={() => step(-1)}
              disabled={!state.prev}
              aria-label={labels.prev}
              hidden={!state.scrollable}
            >
              <Icon name="chevron" size={22} />
            </button>

            <div
              ref={track}
              className={`ts-track ${dragging ? 'is-dragging' : ''}`}
              role="group"
              aria-roledescription="carousel"
              aria-label={labels.sliderLabel}
              tabIndex={0}
              onScroll={update}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              onClickCapture={onClickCapture}
            >
              {items.map((it, i) => (
                <div className="ts-slide" key={it.id ?? i} style={{ '--i': Math.min(i, 8) }}>
                  {renderItem(it, i)}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="ts-btn ts-btn--next"
              onClick={() => step(1)}
              disabled={!state.next}
              aria-label={labels.next}
              hidden={!state.scrollable}
            >
              <Icon name="chevron" size={22} />
            </button>
          </div>
        )}

        {items.length > 0 && state.scrollable && (
          <div className="ts-progress" aria-hidden="true">
            <span style={{ width: `${state.thumb * 100}%`, marginInlineStart: `${state.progress * (1 - state.thumb) * 100}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}