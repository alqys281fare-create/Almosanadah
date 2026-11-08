import { useContent } from '../../context/ContentContext.jsx';
import SmartLink from '../common/SmartLink.jsx';
import Icon from '../common/Icons.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import { slotsOf } from '../../Utils/ads.js';


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
