import { useContent } from '../../context/ContentContext.jsx';
import SmartLink from '../common/SmartLink.jsx';
import Icon from '../common/Icons.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import { slotsOf } from '../../Utils/ads.js';

/*
 * Advertisements. Content comes from content.ads (dashboard → الإعلانات) and is stored PER LANGUAGE,
 * so the Arabic site only ever shows the Arabic posters and the English site only the English ones
 * (useContent() always returns the content of the current site language).
 *
 * Four positions: left-1, left-2 (left of the page) and right-1, right-2 (right of the page).
 * Each slot: { image, href, title, text }. `side` is the PHYSICAL side of the screen, whatever the
 * page direction. A slot with no image shows the built-in animated banner; a slot with no image
 * and no text is not rendered at all.
 *
 *  - <AdRail side>  two stacked posters in the empty strip beside the page (>= 1600px, see design.css)
 *  - <AdStrip />    the same four posters in a responsive grid above the footer (< 1600px)
 */
export function AdCard({ slot, ads, variant = 'rail' }) {
  const { dir } = useLang();
  const { image, href, title, text } = slot;
  const arrow = dir === 'rtl' ? 'arrowLeft' : 'arrowRight';
  const label = title || text || ads.label;

  const body = image ? (
    <>
      {/* in the strip the poster is never cropped: it is shown whole over a blurred copy of itself */}
      {variant === 'strip' && <img className="ad-card__bg" src={image} alt="" aria-hidden="true" loading="lazy" />}
      <img className="ad-card__img" src={image} alt={title || ads.label} loading="lazy" />
    </>
  ) : (
    <div className="ad-card__art">
      <i className="ad-card__orb ad-card__orb--1" />
      <i className="ad-card__orb ad-card__orb--2" />
      <img className="ad-card__logo" src="/logo.png" alt="" />
      <strong className="ad-card__title">{title}</strong>
      <span className="ad-card__text">{text}</span>
      <span className="ad-card__cta">
        <Icon name={arrow} size={18} />
      </span>
    </div>
  );

  return href ? (
    <SmartLink href={href} className="ad-card" aria-label={label}>
      {body}
    </SmartLink>
  ) : (
    <div className="ad-card">{body}</div>
  );
}

const visible = (s) => s.image || s.title || s.text;

export default function AdRail({ side }) {
  const { content } = useContent();
  const ads = content.ads;
  if (!ads || ads.enabled === false) return <div className="ad-rail ad-rail--empty" aria-hidden="true" />;

  const slots = slotsOf(ads, side).filter(visible);
  if (!slots.length) return <div className="ad-rail ad-rail--empty" aria-hidden="true" />;

  return (
    <aside className={`ad-rail ad-rail--${side}`} aria-label={ads.label}>
      {slots.map((slot) => (
        <div className="ad-slot" key={slot.id}>
          <span className="ad-rail__tag">{ads.label}</span>
          <AdCard slot={slot} ads={ads} />
        </div>
      ))}
    </aside>
  );
}

export function AdStrip() {
  const { content } = useContent();
  const ads = content.ads;
  if (!ads || ads.enabled === false) return null;
  const slots = (ads.slots || []).filter(visible);
  if (!slots.length) return null;

  return (
    <aside className="ad-strip" aria-label={ads.label}>
      <div className="container ad-strip__grid">
        {slots.map((slot) => (
          <div className="ad-slot" key={slot.id}>
            <span className="ad-rail__tag">{ads.label}</span>
            <AdCard slot={slot} ads={ads} variant="strip" />
          </div>
        ))}
      </div>
    </aside>
  );
}
