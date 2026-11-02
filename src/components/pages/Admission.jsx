import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';
import PageBanner from '../components/pages/PageBanner.jsx';
import SectionDivider from '../components/common/SectionDivider.jsx';
import SmartLink from '../components/common/SmartLink.jsx';
import Reveal from '../components/common/Reveal.jsx';
import Icon from '../components/common/Icons.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { getAdmission } from '../data/admissionContent.js';

/* Shared heading used by every block of this page (same look as the home sections). */
function Head({ title, id }) {
  return (
    <Reveal direction="up" className="section-head">
      <h2 className="section-title" id={id}>
        <span className="section-title__line" />
        {title}
        <span className="section-title__line" />
      </h2>
    </Reveal>
  );
}

export default function Admission() {
  const { content } = useContent();
  const { lang, dir } = useLang();
  const a = getAdmission(lang, content.admission);
  const arrow = dir === 'rtl' ? 'arrowLeft' : 'arrowRight';

  return (
    <div key={lang} className="lang-fade">
      <Header />
      <SiteFrame>
        <main className="adm">
          <PageBanner title={a.title} subtitle={a.subtitle} image={a.banner} />

          {/* ---------- intro + registration steps ---------- */}
          <section className="adm-sec adm-steps" aria-labelledby="adm-steps-title">
            <div className="container">
              {a.introTitle && (
                <Reveal direction="up" className="adm-intro">
                  <h2>{a.introTitle}</h2>
                  <p>{a.intro}</p>
                </Reveal>
              )}

              {a.steps.length > 0 && (
                <>
                  <Head title={a.stepsTitle} id="adm-steps-title" />
                  <Reveal direction="up" delay={100}>
                    <ol className="adm-steps__list" style={{ '--n': a.steps.length }}>
                      {a.steps.map((s, i) => (
                        <li className="adm-step" key={s.id} style={{ '--i': i }}>
                          <span className="adm-step__badge">
                            <Icon name={s.icon || 'check'} size={26} />
                            <b>{i + 1}</b>
                          </span>
                          <h3>{s.title}</h3>
                          <p>{s.text}</p>
                        </li>
                      ))}
                    </ol>
                  </Reveal>
                </>
              )}
            </div>
          </section>

          {/* ---------- conditions + documents + notes ---------- */}
          <section className="adm-sec adm-req" aria-labelledby="adm-req-title">
            <SectionDivider from="var(--card)" variant="wave" />
            <div className="container">
              <Head title={a.conditionsTitle} id="adm-req-title" />
              <div className="adm-req__grid">
                <Reveal direction="up" className="adm-card adm-cond">
                  <ul>
                    {a.conditions.map((c, i) => (
                      <li key={c.id} style={{ '--i': i }}>
                        <span className="adm-cond__tick"><Icon name="check" size={16} stroke={3} /></span>
                        <span>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <div className="adm-docs">
                  <Reveal direction="up" delay={80}>
                    <h3 className="adm-docs__title">{a.documentsTitle}</h3>
                  </Reveal>
                  <div className="adm-docs__grid">
                    {a.documents.map((d, i) => (
                      <Reveal key={d.id} direction="zoom" delay={120 + i * 80} className="adm-doc">
                        <span className="adm-doc__icon"><Icon name={d.icon || 'cert'} size={24} /></span>
                        <div>
                          <strong>{d.title}</strong>
                          {d.text && <p>{d.text}</p>}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>

              {a.notes.length > 0 && (
                <Reveal direction="up" className="adm-notes">
                  <h3>{a.notesTitle}</h3>
                  <ul>
                    {a.notes.map((n) => (
                      <li key={n.id}>{n.text}</li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>
          </section>

          {/* ---------- call to action ---------- */}
          <section className="adm-sec adm-cta">
            <SectionDivider from="var(--bg)" variant="tilt" />
            <div className="container">
              <Reveal direction="up" className="adm-cta__box">
                <h2>{a.ctaTitle}</h2>
                <p>{a.ctaText}</p>
                <div className="adm-cta__btns">
                  {a.ctaButton && (
                    <SmartLink href={a.ctaHref || '#contact'} className="adm-btn adm-btn--solid">
                      {a.ctaButton}
                      <Icon name={arrow} size={18} />
                    </SmartLink>
                  )}
                  {a.ctaSecondary && (
                    <SmartLink href={a.ctaSecondaryHref || '/courses'} className="adm-btn adm-btn--line">
                      {a.ctaSecondary}
                    </SmartLink>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        </main>
        <Footer divider="var(--tone-stats-bottom)" />
      </SiteFrame>
    </div>
  );
}
