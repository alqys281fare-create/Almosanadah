import { useContent } from "../../context/ContentContext.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import Icon from "../common/Icons.jsx";
import { Link } from "react-router-dom";

export default function Hero() {
  const { content } = useContent();
  const { t, dir } = useLang();
  const { hero } = content;

  return (
    <section className="hero" id="home">
      {/* ===== Cinematic background ===== */}
      <div className="hero__bg">
     
          <img
            src={hero.image}
            alt={hero.title}
            className="hero__bg-img"
            fetchpriority="high"
            decoding="async"
          />
       
        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>

      {/* ===== Content ===== */}
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__bar" aria-hidden="true" />

          <h1 className="hero__title hero__rise" style={{ "--d": "0.35s" }}>
            {hero.title}
          </h1>

          <h2 className="hero__highlight hero__rise" style={{ "--d": "0.5s" }}>
            {hero.highlight}
          </h2>

          <p className="hero__desc hero__rise" style={{ "--d": "0.65s" }}>
            {hero.description}
          </p>

          <ul className="hero__badges">
            {hero.badges.map((b, i) => (
              <li
                key={b.id}
                className="hero__rise"
                style={{ "--d": `${0.8 + i * 0.12}s` }}
              >
                <span className="hero__badge-icon">
                  <Icon name={b.icon} size={26} />
                </span>
                <span className="hero__badge-text">{b.text}</span>
              </li>
            ))}
          </ul>

          <div className="hero__rise" style={{ "--d": "1.2s" }}>
            <Link to="/courses" className="btn btn--primary btn--lg hero__cta">
              <span>{hero.cta}</span>
              <Icon
                name={dir === "rtl" ? "arrowLeft" : "arrowRight"}
                size={18}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}