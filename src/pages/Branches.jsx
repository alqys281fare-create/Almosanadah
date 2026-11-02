import { useEffect, useMemo, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';
import PageBanner from '../components/pages/PageBanner.jsx';
import SaudiMap, { project } from '../components/pages/SaudiMap.jsx';
import Icon from '../components/common/Icons.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

function BranchCard({ b, labels, active, onSelect }) {
  return (
    <article className={`branch ${active ? 'is-active' : ''}`} onMouseEnter={onSelect} onFocus={onSelect}>
      <span className="branch__corner" aria-hidden="true" />
      <div className="branch__body">
        <ul className="branch__info">
          <li><Icon name="pin" size={14} /> <span>{b.name}</span></li>
          <li><Icon name="building" size={14} /> <span>{b.address}</span></li>
          {b.phone && <li><Icon name="phone" size={14} /> <span dir="ltr">{b.phone}</span></li>}
          {b.hours && <li><Icon name="clock" size={14} /> <span>{b.hours}</span></li>}
        </ul>
        <span className="branch__logo"><img src={b.logo || '/almosanadah.png'} alt="" /></span>
      </div>
      <div className="branch__btns">
        {b.mapUrl ? (
          <a className="branch__btn branch__btn--primary" href={b.mapUrl} target="_blank" rel="noreferrer noopener">{labels.location}</a>
        ) : (
          <span className="branch__btn branch__btn--primary is-off">{labels.location}</span>
        )}
        {b.videoUrl ? (
          <a className="branch__btn" href={b.videoUrl} target="_blank" rel="noreferrer noopener">{labels.video}</a>
        ) : (
          <span className="branch__btn is-off">{labels.video}</span>
        )}
      </div>
    </article>
  );
}

export default function Branches() {
  const { content } = useContent();
  const { lang } = useLang();
  const b = content.branches;
  const [region, setRegion] = useState('all');
  const [page, setPage] = useState(1);
  const [hover, setHover] = useState(null);

  const filtered = useMemo(() => b.items.filter((x) => region === 'all' || x.region === region), [b.items, region]);
  const perPage = Math.max(1, Number(b.perPage) || 6);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => setPage(1), [region]);
  useEffect(() => { if (page > pages) setPage(pages); }, [page, pages]);

  const tabs = [{ id: 'all', label: b.allLabel }, ...b.regions];

  return (
    <div key={lang} className="lang-fade">
      <Header />
      <SiteFrame>
      <main>
        <PageBanner title={b.title} subtitle={b.description} image={b.banner} variant="side">
          <div className="page-banner__map" aria-hidden="true">
            <SaudiMap points={b.items.map((x) => project(x.lat, x.lng))} mini />
          </div>
        </PageBanner>

        <section className="listing">
          <div className="container">
            <div className="region-tabs" role="tablist">
              {tabs.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={region === t.id} className={`region-tab ${region === t.id ? 'is-active' : ''}`} onClick={() => setRegion(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="branches">
              <div className="branches__list">
                <div className="branches__grid">
                  {visible.map((x) => (
                    <BranchCard
                      key={x.id}
                      b={x}
                      labels={{ location: b.locationLabel, video: b.videoLabel }}
                      active={hover === x.id}
                      onSelect={() => setHover(x.id)}
                    />
                  ))}
                  {visible.length === 0 && <p className="listing__empty">—</p>}
                </div>
                {pages > 1 && (
                  <nav className="pager" aria-label="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                      <button key={n} type="button" className={page === n ? 'is-active' : ''} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n)}>
                        {n}
                      </button>
                    ))}
                  </nav>
                )}
              </div>

              <div className="branches__map">
                <SaudiMap
                  points={filtered.map((x) => ({ ...project(x.lat, x.lng), id: x.id, name: x.name }))}
                  activeId={hover}
                  onHover={setHover}
                  labels
                />
              </div>
            </div>
          </div>
        </section>
      </main>
        <Footer />
      </SiteFrame>
    </div>
  );
}
