import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';
import PageBanner from '../components/pages/PageBanner.jsx';
import Icon from '../components/common/Icons.jsx';
import TabSlider from '../components/common/TabSlider.jsx';
import DetailsModal from '../components/common/DetailsModal.jsx';
import { OfferCard, OfferDetails } from '../components/common/Offer.jsx';
import { Block, Bullets, Tags, uniq } from '../components/common/DetailParts.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { getSliderLabels } from '../data/sliderLabels.js';
import { branchesFor, isAllBranches } from '../Utils/branches.js';

// 🔥 Use the SAME catalog hook as ProgramTabs.jsx
import useCatalog from '../hooks/useCatalog.js';

// Arabic-friendly text normalisation for search.
const norm = (v = '') =>
  String(v)
    .toLowerCase()
    .replace(/[\u064B-\u0670\u061F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

const ALL = 'all';

/* 
 * Reusing the exact same details structure from ProgramTabs 
 * so the modal is identical everywhere.
 */
function TypeDetails({ group, type, labels, base, branches, regions }) {
  const courses = type.courses || [];

  const pick = (key, max = 8) =>
    type[key]?.length
      ? type[key]
      : uniq(courses.flatMap((c) => c[key] || [])).slice(0, max);

  const objectives = pick('objectives');
  const outcomes = pick('outcomes');
  const skills = pick('skills', 12);
  const practical = pick('practical', 4);
  const prerequisites = pick('prerequisites', 4);

  const where = branchesFor(type, branches);

  const hours =
    Number(type.hours) ||
    courses.reduce((n, c) => n + (Number(c.hours) || 0), 0);

  return (
    <OfferDetails
      icon={type.icon}
      image={type.image}
      tag={group.title}
      title={type.title}
      desc={type.desc}
      meta={[
        {
          icon: 'calendar',
          text: type.duration && `${labels.duration}: ${type.duration}`,
        },
        {
          icon: 'clock',
          text: hours ? `${hours} ${labels.hours}` : '',
        },
        {
          icon: 'layers',
          text: courses.length ? `${courses.length} ${labels.courses}` : '',
        },
      ]}
      branchData={{
        branches: where,
        total: branches.length,
        all: isAllBranches(type),
      }}
      regions={regions}
      labels={labels}
      pageHref={`${base}/${group.id}/${type.id}`}
    >
      {courses.length > 0 && (
        <Block icon="layers" title={labels.includedCourses}>
          <ul className="dp-courses">
            {courses.map((c, i) => (
              <li key={c.id}>
                <span className="dp-courses__n">{i + 1}</span>
                <div>
                  <Link to={`${base}/${group.id}/${type.id}/${c.id}`}>
                    {c.title}
                  </Link>
                  <small>
                    {[c.duration, c.hours ? `${c.hours} ${labels.hours}` : '']
                      .filter(Boolean)
                      .join(' · ')}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <div className="dp-cols">
        {objectives.length > 0 && (
          <Block icon="eye" title={labels.objectives}>
            <Bullets items={objectives} />
          </Block>
        )}
        {outcomes.length > 0 && (
          <Block icon="cap" title={labels.outcomes}>
            <Bullets items={outcomes} />
          </Block>
        )}
      </div>

      {skills.length > 0 && (
        <Block icon="trainer" title={labels.skills}>
          <Tags items={skills} />
        </Block>
      )}

      <div className="dp-cols">
        {practical.length > 0 && (
          <Block icon="screen" title={labels.practical}>
            <Bullets items={practical} />
          </Block>
        )}
        {prerequisites.length > 0 && (
          <Block icon="cert" title={labels.requirements}>
            <Bullets items={prerequisites} />
          </Block>
        )}
      </div>
    </OfferDetails>
  );
}

export default function Courses() {
  const { content } = useContent();
  const { lang } = useLang();
  const location = useLocation();
  const c = content.courses;
  const labels = getSliderLabels(lang, c.labels);

  // 🔥 Read from the exact same source as ProgramTabs
  const cat = useCatalog();
  const groups = cat.groups || [];

  const branches = content.branches?.items || [];
  const regions = content.branches?.regions || [];

  const [activeId, setActiveId] = useState(ALL);
  const [query, setQuery] = useState('');
  const [applied, setApplied] = useState('');
  const [open, setOpen] = useState(null); // { gid, tid }

  // Sync with routing state if coming from another page
  useEffect(() => {
    const st = location.state;
    if (!st) return;
    if (st.program && groups.some((g) => g.id === st.program)) {
      setActiveId(st.program);
    }
  }, [location.state, groups]);

  const q = norm(applied);

  // Build tabs identically to ProgramTabs, but with "All" first as in your screenshot
  const tabs = useMemo(() => {
    const countFor = (gid) => {
      const itemsToCount =
        gid === ALL
          ? groups.flatMap((g) => g.types || [])
          : groups.find((g) => g.id === gid)?.types || [];
      if (!q) return itemsToCount.length;
      return itemsToCount.filter(
        (it) => norm(it.title).includes(q) || norm(it.desc).includes(q)
      ).length;
    };

    return [
      {
        id: ALL,
        label: c.allProgramsLabel || (lang === 'ar' ? 'عرض الكل' : 'Show All'),
        icon: 'grid',
        count: countFor(ALL),
      },
      ...groups.map((g) => ({
        id: g.id,
        label: g.title,
        icon: g.icon,
        count: countFor(g.id),
      })),
    ];
  }, [groups, lang, q, c.allProgramsLabel]);

  const isAll = activeId === ALL;

  // Extract the items for the selected tab
  const baseItems = useMemo(() => {
    if (isAll) {
      return groups.flatMap((g) =>
        (g.types || []).map((t) => ({ ...t, _group: g }))
      );
    }
    const selectedGroup = groups.find((g) => g.id === activeId);
    return (selectedGroup?.types || []).map((t) => ({
      ...t,
      _group: selectedGroup,
    }));
  }, [groups, activeId, isAll]);

  // Apply search filter
  const list = useMemo(() => {
    if (!q) return baseItems;
    return baseItems.filter(
      (it) => norm(it.title).includes(q) || norm(it.desc).includes(q)
    );
  }, [baseItems, q]);

  const close = useCallback(() => setOpen(null), []);

  const submit = (e) => {
    e.preventDefault();
    setApplied(query);
    // When searching, jump back to "All" so the search covers everything
    if (query.trim()) {
      setActiveId(ALL);
    }
  };

  const openGroup = open ? groups.find((g) => g.id === open.gid) : null;
  const openType = openGroup?.types?.find((t) => t.id === open?.tid);

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

              <TabSlider
                idPrefix="courses"
                tabs={tabs}
                active={activeId}
                onChange={setActiveId}
                items={list}
                labels={{
                  ...labels,
                  emptyTab: c.empty || labels.emptyTab,
                  tabsLabel: c.programsTitle || labels.tabsLabel,
                }}
                renderItem={(t) => {
                  const hours =
                    Number(t.hours) ||
                    (t.courses || []).reduce(
                      (n, course) => n + (Number(course.hours) || 0),
                      0
                    );
                  const n = branchesFor(t, branches).length;

                  return (
                    <OfferCard
                      icon={t.icon}
                      image={t.image}
                      tag={t._group.title}
                      title={t.title}
                      desc={t.desc}
                      meta={[
                        { icon: 'calendar', text: t.duration },
                        {
                          icon: 'clock',
                          text: hours ? `${hours} ${labels.hours}` : '',
                        },
                      ]}
                      where={
                        isAllBranches(t)
                          ? labels.allBranches
                          : `${n} ${labels.branchWord}`
                      }
                      labels={labels}
                      onOpen={() => setOpen({ gid: t._group.id, tid: t.id })}
                    />
                  );
                }}
              />
            </div>
          </section>
        </main>
        <Footer />
      </SiteFrame>

      <DetailsModal
        open={!!openType}
        onClose={close}
        title={openType?.title}
        closeLabel={labels.close}
      >
        {openType && (
          <TypeDetails
            group={openGroup}
            type={openType}
            labels={labels}
            base="/courses"
            branches={branches}
            regions={regions}
          />
        )}
      </DetailsModal>
    </div>
  );
}