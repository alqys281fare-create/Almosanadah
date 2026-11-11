
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';
import PageBanner from '../components/pages/PageBanner.jsx';

import Icon from '../components/common/Icons.jsx';
import TabSlider from '../components/common/TabSlider.jsx';
import DetailsModal from '../components/common/DetailsModal.jsx';
import { OfferCard } from '../components/common/Offer.jsx';
import TypeDetails, { cardGoals, typeHours } from '../components/common/TypeDetails.jsx';

import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { getSliderLabels } from '../data/sliderLabels.js';
import { PROGRAMS_PATH } from '../data/Programscatalog.js';
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
  const [applied, setApplied] = useState('');
  const [open, setOpen] = useState(null);

  // Sync with routing state if coming from another page.
  useEffect(() => {
    const state = location.state;

    if (!state) return;

    if (state.program && groups.some((group) => group.id === state.program)) {
      setActiveId(state.program);
    }
  }, [location.state, groups]);

  const q = norm(applied);

  // Build tabs: Show All first, followed by categories.
  const tabs = useMemo(() => {
    const countFor = (gid) => {
      const itemsToCount =
        gid === ALL
          ? groups.flatMap((group) => group.types || [])
          : groups.find((group) => group.id === gid)?.types || [];

      if (!q) return itemsToCount.length;

      return itemsToCount.filter(
        (item) =>
          norm(item.title).includes(q) ||
          norm(item.desc).includes(q)
      ).length;
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

    return baseItems.filter(
      (item) =>
        norm(item.title).includes(q) ||
        norm(item.desc).includes(q)
    );
  }, [baseItems, q]);

  const close = useCallback(() => setOpen(null), []);

  const submit = (event) => {
    event.preventDefault();

    setApplied(query);

    // When searching, jump back to Show All.
    if (query.trim()) {
      setActiveId(ALL);
    }
  };

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
              <form className="searchbar" onSubmit={submit} role="search">
                <button type="submit" className="searchbar__btn">
                  {c.searchButton}
                </button>

                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);

                    if (!event.target.value) {
                      setApplied('');
                    }
                  }}
                  placeholder={c.searchPlaceholder}
                  aria-label={c.searchButton}
                />

                <Icon
                  name="search"
                  size={20}
                  className="searchbar__icon"
                />
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
                renderItem={(type) => {
                  const hours = typeHours(type);

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
            base={PROGRAMS_PATH}
            branches={branches}
            regions={regions}
          />
        )}
      </DetailsModal>
    </div>
  );
}
