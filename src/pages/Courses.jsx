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

import useCatalog from '../hooks/useCatalog.js';

// Arabic-friendly text normalization for search.
const norm = (v = '') =>
  String(v)
    .toLowerCase()
    .replace(/[\u064B-\u0670\u061F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

const ALL = 'all';

/* Normalize a value (array | string | object) into a clean list of strings. */
function asList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).filter(Boolean);
  }

  return [];
}

/* Get goals for the card from the available data sources. */
function cardGoals(type) {
  // 1. Goals directly assigned to the type.
  const ownGoals = asList(type.goals);

  if (ownGoals.length > 0) {
    return ownGoals;
  }

  // 2. Objectives directly assigned to the type.
  const ownObjectives = asList(type.objectives);

  if (ownObjectives.length > 0) {
    return ownObjectives;
  }

  // 3. Collect goals/objectives from included courses.
  return uniq(
    (type.courses || []).flatMap((course) => [
      ...asList(course.goals),
      ...asList(course.objectives),
    ])
  );
}

/* Build a normalized haystack for search across all useful fields. */
function searchHaystack(item) {
  return [
    item.title,
    item.desc,
    item._group?.title,
    ...asList(item.goals),
    ...asList(item.objectives),
    ...asList(item.skills),
    ...asList(item.outcomes),
    ...(item.courses || []).map((course) => course.title),
  ]
    .filter(Boolean)
    .map(norm)
    .join(' ');
}

/* Check whether an item matches the normalized query. */
function matchesQuery(item, needle) {
  if (!needle) return true;
  return searchHaystack(item).includes(needle);
}

/*
 * Details for one diploma / course type.
 * Reuses the same details structure from ProgramTabs.
 */
function TypeDetails({ group, type, labels, base, branches, regions }) {
  const courses = type.courses || [];

  const pick = (key, max = 8) =>
    type[key]?.length
      ? type[key]
      : uniq(courses.flatMap((course) => course[key] || [])).slice(0, max);

  const objectives = pick('objectives');
  const outcomes = pick('outcomes');
  const skills = pick('skills', 12);
  const practical = pick('practical', 4);
  const prerequisites = pick('prerequisites', 4);

  const where = branchesFor(type, branches);

  const hours =
    Number(type.hours) ||
    courses.reduce((n, course) => n + (Number(course.hours) || 0), 0);

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
          text: courses.length
            ? `${courses.length} ${labels.courses}`
            : '',
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
            {courses.map((course, i) => (
              <li key={course.id || i}>
                <span className="dp-courses__n">{i + 1}</span>

                <div>
                  <Link to={`${base}/${group.id}/${type.id}/${course.id}`}>
                    {course.title}
                  </Link>

                  <small>
                    {[
                      course.duration,
                      course.hours
                        ? `${course.hours} ${labels.hours}`
                        : '',
                    ]
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

  const c = content.courses || {};
  const labels = getSliderLabels(lang, c.labels);

  // Read from the same catalog source as ProgramTabs.
  const cat = useCatalog();
  const groups = cat.groups || [];

  const branches = content.branches?.items || [];
  const regions = content.branches?.regions || [];

  const [activeId, setActiveId] = useState(ALL);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  // Sync with routing state if coming from another page.
  useEffect(() => {
    const state = location.state;

    if (!state) return;

    if (state.program && groups.some((group) => group.id === state.program)) {
      setActiveId(state.program);
    }
  }, [location.state, groups]);

  // Debounce the raw query into the effective search term.
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const q = norm(debounced);

  // While searching, always look across "Show All".
  useEffect(() => {
    if (debounced.trim()) {
      setActiveId(ALL);
    }
  }, [debounced]);

  // Build tabs: Show All first, followed by categories.
  const tabs = useMemo(() => {
    const countFor = (gid) => {
      const itemsToCount =
        gid === ALL
          ? groups.flatMap((group) =>
              (group.types || []).map((type) => ({
                ...type,
                _group: group,
              }))
            )
          : (groups.find((group) => group.id === gid)?.types || []).map(
              (type) => ({
                ...type,
                _group: groups.find((g) => g.id === gid),
              })
            );

      if (!q) return itemsToCount.length;

      return itemsToCount.filter((item) => matchesQuery(item, q)).length;
    };

    return [
      {
        id: ALL,
        label: c.allProgramsLabel || (lang === 'ar' ? 'عرض الكل' : 'Show All'),
        icon: 'grid',
        count: countFor(ALL),
      },

      ...groups.map((group) => ({
        id: group.id,
        label: group.title,
        icon: group.icon,
        count: countFor(group.id),
      })),
    ];
  }, [groups, lang, q, c.allProgramsLabel]);

  const isAll = activeId === ALL;

  // Extract items for the selected tab.
  const baseItems = useMemo(() => {
    if (isAll) {
      return groups.flatMap((group) =>
        (group.types || []).map((type) => ({
          ...type,
          _group: group,
        }))
      );
    }

    const selectedGroup = groups.find((group) => group.id === activeId);

    return (selectedGroup?.types || []).map((type) => ({
      ...type,
      _group: selectedGroup,
    }));
  }, [groups, activeId, isAll]);

  // Apply search filter.
  const list = useMemo(() => {
    if (!q) return baseItems;

    return baseItems.filter((item) => matchesQuery(item, q));
  }, [baseItems, q]);

  const close = useCallback(() => setOpen(null), []);

  // Find original group and selected type for the details modal.
  const openGroup = open
    ? groups.find((group) => group.id === open.gid)
    : null;

  const openType = openGroup?.types?.find(
    (type) => type.id === open?.tid
  );

  return (
    <div key={lang} className="lang-fade">
      <Header />

      <SiteFrame>
        <main>
          <PageBanner
            title={c.title}
            subtitle={c.subtitle}
            image={c.banner}
          />

          <section className="listing">
            <div className="container">
              <div className="searchbar" role="search">
                <Icon
                  name="search"
                  size={20}
                  className="searchbar__icon"
                />

                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setQuery('');
                    }
                  }}
                  placeholder={c.searchPlaceholder}
                  aria-label={c.searchButton || labels.search}
                />

                {query ? (
                  <button
                    type="button"
                    className="searchbar__clear"
                    onClick={() => setQuery('')}
                    aria-label={labels.clear || 'Clear search'}
                  >
                    ×
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="searchbar__btn"
                    aria-label={c.searchButton || labels.search}
                    tabIndex={-1}
                    disabled
                  >
                    {c.searchButton}
                  </button>
                )}
              </div>

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
                renderItem={(type) => {
                  const hours =
                    Number(type.hours) ||
                    (type.courses || []).reduce(
                      (n, course) => n + (Number(course.hours) || 0),
                      0
                    );

                  const branchCount = branchesFor(type, branches).length;

                  const goals = cardGoals(type);

                  return (
                    <OfferCard
                      icon={type.icon}
                      image={type.image}
                      tag={type._group.title}
                      title={type.title}
                      desc={type.desc}
                      goals={goals}
                      meta={[
                        {
                          icon: 'calendar',
                          text: type.duration,
                        },
                        {
                          icon: 'clock',
                          text: hours
                            ? `${hours} ${labels.hours}`
                            : '',
                        },
                      ]}
                      where={
                        isAllBranches(type)
                          ? labels.allBranches
                          : `${branchCount} ${labels.branchWord}`
                      }
                      labels={labels}
                      onOpen={() =>
                        setOpen({
                          gid: type._group.id,
                          tid: type.id,
                        })
                      }
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