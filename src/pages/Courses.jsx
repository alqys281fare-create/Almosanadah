import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';
import PageBanner from '../components/pages/PageBanner.jsx';
import SmartLink from '../components/common/SmartLink.jsx';
import Icon from '../components/common/Icons.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { idKey, sameId } from '../Utils/catalog.js';

// Arabic-friendly text normalisation for search.
const norm = (v = '') =>
  String(v)
    .toLowerCase()
    .replace(/[\u064B-\u0670\u061F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

// Id comparison that survives number/string/case mismatches
// (e.g. the dashboard saving category "1" while defaults use 1).

export default function Courses() {
  const { content } = useContent();
  const { lang } = useLang();
  const location = useLocation();
  const c = content.courses;
  const programOptions = c.programs || [];
  const categories = c.categories || [];
  const items = Array.isArray(c.items) ? c.items : [];

  // Resolve a requested id against a list of options; falls back to 'all'.
  const resolve = (requested, options) => {
    if (requested == null || idKey(requested) === 'all') return 'all';
    const found = options.find((o) => sameId(o.id, requested));
    return found ? found.id : 'all';
  };

  // Default is "all" (previously it defaulted to the first category, which hid
  // every course outside that category and made the program filter look broken).
  const [category, setCategory] = useState(() => resolve(location.state?.category, categories));
  const [program, setProgram] = useState(() => resolve(location.state?.program, programOptions));

  const [query, setQuery] = useState('');
  const [applied, setApplied] = useState('');

  // Landing on /courses again with new navigation state → re-sync filters.
  useEffect(() => {
    const st = location.state;
    if (!st) return;
    setCategory(resolve(st.category, categories));
    setProgram(resolve(st.program, programOptions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // If the stored selection no longer exists (e.g. edited in the dashboard), reset it.
  useEffect(() => {
    if (category !== 'all' && !categories.some((x) => sameId(x.id, category))) setCategory('all');
    if (program !== 'all' && !programOptions.some((x) => sameId(x.id, program))) setProgram('all');
  }, [categories, programOptions, category, program]);

  const list = useMemo(() => {
    const q = norm(applied);
    return items.filter(
      (it) =>
        (category === 'all' || sameId(it.category, category)) &&
        (program === 'all' || sameId(it.program, program)) &&
        (!q || norm(it.title).includes(q))
    );
  }, [items, category, program, applied]);

  // Counts shown next to filters (respect the *other* active filter).
  const programCount = (pid) =>
    items.filter(
      (it) =>
        (pid === 'all' || sameId(it.program, pid)) &&
        (category === 'all' || sameId(it.category, category))
    ).length;
  const categoryCount = (cid) =>
    items.filter(
      (it) =>
        (cid === 'all' || sameId(it.category, cid)) &&
        (program === 'all' || sameId(it.program, program))
    ).length;

  const submit = (e) => {
    e.preventDefault();
    setApplied(query);
    // Searching looks across all categories AND all programs.
    if (query.trim()) {
      setCategory('all');
      setProgram('all');
    }
  };

  return (
    <div key={lang} className="lang-fade">
      <Header />
      <SiteFrame>
        <main>
          <PageBanner title={c.title} subtitle={c.subtitle} image={c.banner} />

          <section className="listing">
            <div className="container">
              <form className="searchbar" onSubmit={submit} role="search">
                <button type="submit" className="searchbar__btn">
                  {c.searchButton}
                </button>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!e.target.value) setApplied('');
                  }}
                  placeholder={c.searchPlaceholder}
                  aria-label={c.searchButton}
                />
                <Icon name="search" size={20} className="searchbar__icon" />
              </form>

              {/* Program filter — Academic / Professional / Courses */}
              <div className="tabs" role="tablist" aria-label={c.programsTitle || 'Program type'}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={program === 'all'}
                  className={`tab ${program === 'all' ? 'is-active' : ''}`}
                  onClick={() => setProgram('all')}
                >
                  <Icon name="layers" size={16} />
                  {c.allProgramsLabel || 'All programs'} ({programCount('all')})
                </button>
                {programOptions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={sameId(program, p.id)}
                    className={`tab ${sameId(program, p.id) ? 'is-active' : ''}`}
                    onClick={() => setProgram(p.id)}
                  >
                    {p.label} ({programCount(p.id)})
                  </button>
                ))}
              </div>

              <div className="courses">
                <aside className="cats" aria-label={c.categoriesTitle}>
                  <h2>{c.categoriesTitle}</h2>
                  <button
                    type="button"
                    className={`cat ${category === 'all' ? 'is-active' : ''}`}
                    onClick={() => setCategory('all')}
                  >
                    <Icon name="layers" size={18} />
                    <span>
                      {c.allLabel} ({categoryCount('all')})
                    </span>
                    <Icon name="chevron" size={16} className="cat__arrow" />
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat ${sameId(category, cat.id) ? 'is-active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      {cat.icon && <Icon name={cat.icon} size={18} />}
                      <span>
                        {cat.label} ({categoryCount(cat.id)})
                      </span>
                      <Icon name="chevron" size={16} className="cat__arrow" />
                    </button>
                  ))}
                </aside>

                <div className="courses__grid-wrap">
                  {list.length === 0 ? (
                    <p className="listing__empty">{c.empty}</p>
                  ) : (
                    <div className="courses__grid">
                      {list.map((it) => {
                        const Tag = it.href ? SmartLink : 'div';
                        return (
                          <Tag
                            key={it.id}
                            className="course-card"
                            {...(it.href ? { href: it.href } : {})}
                          >
                            {it.image ? (
                              <img className="course-card__img" src={it.image} alt="" />
                            ) : (
                              <span className="course-card__icon">
                                <Icon name={it.icon || 'book'} size={40} stroke={1.5} />
                              </span>
                            )}
                            <strong>{it.title}</strong>
                            <i aria-hidden="true" />
                          </Tag>
                        );
                      })}
                    </div>
                  )}
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