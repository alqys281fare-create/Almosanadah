/* Red/blue hero banner shared by the Courses and Branches pages (matches the Figma frames). */
export default function PageBanner({ title, subtitle, image, variant = 'center', children }) {
  return (
    <section className={`page-banner page-banner--${variant}`}>
      {image ? <img className="page-banner__img" src={image} alt="" /> : <div className="page-banner__bg" aria-hidden="true" />}
      <span className="page-banner__corner page-banner__corner--tl" aria-hidden="true" />
      <span className="page-banner__corner page-banner__corner--br" aria-hidden="true" />
      <div className="container page-banner__inner">
        <div className="page-banner__text">
          <h1 className="page-banner__title">
            <i aria-hidden="true" />
            <span>{title}</span>
            <i aria-hidden="true" />
          </h1>
          {subtitle && <p className="page-banner__sub">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
