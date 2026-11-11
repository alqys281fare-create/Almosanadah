
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import '../../styles/Branchescta.css';

const DEFAULT_IMAGE = 'image.png';

const DEFAULTS = {
  ar: {
    title: 'اكتشف فروعنا ...',
    text: 'نحرص على أن نكون قريبين منك في جميع مناطق المملكة، تعرّف على أقرب فرع إليك وعناوين الفروع ومواعيد العمل، ويسعدنا استقبالك وخدمتك في أقرب وقت ممكن.',
    button: 'اكتشف فروعنا',
    href: '/branches',
    image: DEFAULT_IMAGE,
  },
  en: {
    title: 'Discover our branches ...',
    text: 'We make sure to be close to you in every region of the Kingdom. Find your nearest branch, its address and working hours — we look forward to welcoming and serving you as soon as possible.',
    button: 'Discover our branches',
    href: '/branches',
    image: DEFAULT_IMAGE,
  },
};

export default function BranchesCta() {
  const { content } = useContent();
  const { lang } = useLang();
  const [imgFailed, setImgFailed] = useState(false);

  const base = DEFAULTS[lang === 'en' ? 'en' : 'ar'];
  const cfg = { ...base, ...(content?.branchesCta || {}) };

  const isExternal = /^https?:\/\//i.test(cfg.href || '');
  const showImage = Boolean(cfg.image) && !imgFailed;

  const button = (
    <>
      {cfg.button}
      <Icon name="chevron" size={16} className="bcta__arrow" />
    </>
  );

  return (
    <section className="bcta" id="branches-cta">
      <div className="container">
        <Reveal direction="up">
          <div className="bcta__box">
            <div className="bcta__text">
              <h2>{cfg.title}</h2>
              <p className="bcta__desc">{cfg.text}</p>

              {isExternal ? (
                <a
                  className="bcta__btn"
                  href={cfg.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {button}
                </a>
              ) : (
                <Link className="bcta__btn" to={cfg.href}>
                  {button}
                </Link>
              )}
            </div>

            <div className="bcta__media" aria-hidden="true">
              {showImage ? (
                <img
                  className="bcta__img"
                  src={cfg.image}
                  alt=""
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <span className="bcta__ghost">
                  <Icon name="building" size={140} stroke={1.2} />
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
