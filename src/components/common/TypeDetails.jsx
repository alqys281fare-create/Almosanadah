import { Link } from 'react-router-dom';
import { branchesFor, isAllBranches } from '../../Utils/branches.js';
import { OfferDetails } from './Offer.jsx';
import { Block, Bullets, Tags, uniq } from './DetailParts.jsx';

/*
 * ONE place for everything the public pages show about a diploma / course type
 * (card goals, total hours, details window). The home «Programs» section and the /courses page
 * both read the same catalog (content.catalog) and both use these helpers, so they can never drift apart.
 */

/* Normalize a value (array | string | object) into a clean list of strings. */
export const asList = (v) =>
  Array.isArray(v)
    ? v.filter(Boolean)
    : typeof v === 'string'
    ? v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean)
    : v && typeof v === 'object'
    ? Object.values(v).filter(Boolean)
    : [];

/* Goals shown on a card: the type's own, then its objectives, then the ones of its courses. */
export const cardGoals = (t) => {
  const own = asList(t.goals);
  if (own.length) return own;

  const objectives = asList(t.objectives);
  if (objectives.length) return objectives;

  return uniq((t.courses || []).flatMap((c) => [...asList(c.goals), ...asList(c.objectives)]));
};

/* Total training hours: the type's own number, else the sum of its courses. */
export const typeHours = (t) =>
  Number(t.hours) || (t.courses || []).reduce((n, c) => n + (Number(c.hours) || 0), 0);

/* Details window content for one diploma / course type. */
export default function TypeDetails({ group, type, labels, base, branches, regions }) {
  const courses = type.courses || [];

  // use the type's own list, otherwise gather it from its courses
  const pick = (key, max = 8) =>
    type[key]?.length ? type[key] : uniq(courses.flatMap((c) => c[key] || [])).slice(0, max);

  const objectives = pick('objectives');
  const outcomes = pick('outcomes');
  const skills = pick('skills', 12);
  const practical = pick('practical', 4);
  const prerequisites = pick('prerequisites', 4);
  const where = branchesFor(type, branches);
  const hours = typeHours(type);

  return (
    <OfferDetails
      icon={type.icon}
      image={type.image}
      tag={group.title}
      title={type.title}
      desc={type.desc}
      meta={[
        { icon: 'calendar', text: type.duration && `${labels.duration}: ${type.duration}` },
        { icon: 'clock', text: hours ? `${hours} ${labels.hours}` : '' },
        { icon: 'layers', text: courses.length ? `${courses.length} ${labels.courses}` : '' },
      ]}
      branchData={{ branches: where, total: branches.length, all: isAllBranches(type) }}
      regions={regions}
      labels={labels}
      pageHref={`${base}/${group.id}/${type.id}`}
    >
      {courses.length > 0 && (
        <Block icon="layers" title={labels.includedCourses}>
          <ul className="dp-courses">
            {courses.map((c, i) => (
              <li key={c.id || i}>
                <span className="dp-courses__n">{i + 1}</span>
                <div>
                  <Link to={`${base}/${group.id}/${type.id}/${c.id}`}>{c.title}</Link>
                  <small>
                    {[c.duration, c.hours ? `${c.hours} ${labels.hours}` : ''].filter(Boolean).join(' · ')}
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
