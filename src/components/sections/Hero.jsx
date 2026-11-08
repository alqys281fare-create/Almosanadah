import { useContent } from "../../context/ContentContext.jsx";
import { useLang } from "../../i18n/LanguageContext.jsx";
import Icon from "../common/Icons.jsx";
import SmartLink from "../common/SmartLink.jsx";
import { Link } from "react-router-dom";

/* Default actions — mirrors Header.jsx.
   Index 1 (register) is the button we render here in the Hero. */
const DEFAULT_ACTIONS = [
  {
    id: "services",
    label: "خدماتى التعليمية",
    href: "#services",
    variant: "ghost",
  },
  {
    id: "register",
    label: "سجل الان",
    href: "#register",
    variant: "primary",
  },
];

export default function Hero() {
  const { content } = useContent();
  const { t, dir } = useLang();
  const { hero, site } = content;

  /* Pull the same action list the header used to render,
     then take the SECOND button (Register). */
  const allActions =
    Array.isArray(site?.actions) && site.actions.length
      ? site.actions
      : DEFAULT_ACTIONS;

  const registerAction = allActions[1];

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
          <h1
            className="hero__title hero__rise"
            style={{ "--d": "0.35s" }}
          >
            {hero.title}
          </h1>

          <h2
            className="hero__highlight hero__rise"
            style={{ "--d": "0.5s" }}
          >
            {hero.highlight}
          </h2>

          <p
            className="hero__desc hero__rise"
            style={{ "--d": "0.65s" }}
          >
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

          {/* ===== CTA row: Courses + Register (moved from header) ===== */}
          <div
            className="hero__actions hero__rise"
            style={{
              "--d": "1.2s",
              display: "flex",
              flexWrap: "wrap",
              width:"100%",
              justifyContent:"center",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <Link
              to="/courses"
              className="btn btn--primary btn--lg hero__cta"
            >
              <span>{hero.cta}</span>
              <Icon
                name={dir === "rtl" ? "arrowLeft" : "arrowRight"}
                size={18}
              />
            </Link>

            {registerAction && (
              <SmartLink
                href={registerAction.href}
                className={`btn btn--lg hero__cta ${
                  registerAction.variant === "primary"
                    ? "btn--primary"
                    : "btn--outline"
                }`}
              >
               
                <span>{registerAction.label}</span>
                 {registerAction.icon && (
                  <Icon name={registerAction.icon} size={18} />
                )}
              </SmartLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}