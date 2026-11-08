import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import useCatalog from '../../hooks/useCatalog.js';
import { PROGRAMS_PATH } from '../../data/Programscatalog.js';
import { getSliderLabels } from '../../data/sliderLabels.js';
import { branchesFor, isAllBranches } from '../../Utils/branches.js';
import TabSlider from '../common/TabSlider.jsx';
import DetailsModal from '../common/DetailsModal.jsx';
import { OfferCard, OfferDetails } from '../common/Offer.jsx';
import { Block, Bullets, Tags, uniq } from '../common/DetailParts.jsx';

/* Details for one diploma / course type */
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
            {courses.map((c, i) => (
              <li key={c.id}>
                <span className="dp-courses__n">{i + 1}</span>

                <div>
                  <Link to={`${base}/${group.id}/${type.id}/${c.id}`}>
                    {c.title}
                  </Link>

                  <small>
                    {[
                      c.duration,
                      c.hours ? `${c.hours} ${labels.hours}` : '',
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

/*
 * Program tabs:
 * - Category tabs: display items belonging to the selected group.
 * - Show All: displays all items from every group.
 * - Show Details: displays full information and applicable branches.
 */

export default function ProgramTabs({
  base = PROGRAMS_PATH,
  idPrefix = 'prog',
}) {
  const { content } = useContent();
  const { lang } = useLang();

  const cat = useCatalog();

  const labels = getSliderLabels(
    lang,
    content.courses?.labels
  );

  const branches = content.branches?.items || [];
  const regions = content.branches?.regions || [];

  const groups = cat.groups || [];

  // Default to the first category tab.
  const [activeId, setActiveId] = useState(groups[0]?.id);

  // Keep the active tab valid when the catalog loads after the first render
  // (fixes “no tab highlighted” on slow loads / medium screens).
  useEffect(() => {
    if (!groups.length) return;

    const valid = groups.some((g) => g.id === activeId) || activeId === 'all';
    if (!valid) {
      setActiveId(groups[0].id);
    }
  }, [groups, activeId]);

  // Selected item and its original group.
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);

  // Category tabs first, Show All tab last.
  const tabs = useMemo(() => {
    const totalItems = groups.reduce(
      (sum, g) => sum + (g.types || []).length,
      0
    );

    return [
      ...groups.map((g) => ({
        id: g.id,
        label: g.title,
        icon: g.icon,
        count: (g.types || []).length,
      })),

      {
        id: 'all',
        label: lang === 'ar' ? 'عرض الكل' : 'Show All',
        icon: 'grid',
        count: totalItems,
      },
    ];
  }, [groups, lang]);

  // Check whether Show All is selected.
  const isAll = activeId === 'all';

  // Find the selected group.
  const group = groups.find((g) => g.id === activeId) || groups[0];

  // Prepare slider items.
  // Keep the original group for opening the correct details.
  const displayedItems = useMemo(() => {
    if (isAll) {
      return groups.flatMap((g) =>
        (g.types || []).map((t) => ({
          ...t,
          _group: g,
        }))
      );
    }

    const selectedGroup = groups.find((g) => g.id === activeId);

    return (selectedGroup?.types || []).map((t) => ({
      ...t,
      _group: selectedGroup,
    }));
  }, [groups, activeId, isAll]);

  if (!group && !displayedItems.length) return null;

  // Find original group and item for the details modal.
  const openGroup = open
    ? groups.find((g) => g.id === open.gid)
    : null;

  const openType = openGroup?.types?.find(
    (t) => t.id === open?.tid
  );

  return (
    <>
      {/* Category and Show All slider */}
      <TabSlider
        idPrefix={idPrefix}
        tabs={tabs}
        active={activeId}
        onChange={setActiveId}
        items={displayedItems}
        labels={labels}
        renderItem={(t) => {
          const hours =
            Number(t.hours) ||
            (t.courses || []).reduce(
              (n, c) => n + (Number(c.hours) || 0),
              0
            );

          const n = branchesFor(t, branches).length;

          return (
            <OfferCard
              icon={t.icon}
              image={t.image}
              badge={`${(t.courses || []).length} ${labels.courses}`}
              title={t.title}
              desc={t.desc}
              meta={[
                {
                  icon: 'calendar',
                  text: t.duration,
                },
                {
                  icon: 'clock',
                  text: hours
                    ? `${hours} ${labels.hours}`
                    : '',
                },
              ]}
              where={
                isAllBranches(t)
                  ? labels.allBranches
                  : `${n} ${labels.branchWord}`
              }
              labels={labels}
              onOpen={() =>
                setOpen({
                  gid: t._group.id,
                  tid: t.id,
                })
              }
            />
          );
        }}
      />

      {/* Item details modal */}
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
            base={base}
            branches={branches}
            regions={regions}
          />
        )}
      </DetailsModal>
    </>
  );
}