import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';
import SiteFrame from '../layout/SiteFrame.jsx';


import { useLang } from '../../i18n/LanguageContext.jsx';
import useCatalog from '../../hooks/useCatalog.js';
import { PROGRAMS_PATH } from '../../data/Programscatalog.js';
import '../../styles/Programscatlog.css'
import PageBanner from '../pages/PageBanner.jsx';
import Icon from '../common/Icons.jsx';
import ProgramTabs from './ProgramTabs.jsx';
import BranchList from '../common/BranchList.jsx';
import { useContent } from '../../context/ContentContext.jsx';
import { getSliderLabels } from '../../data/sliderLabels.js';
import { branchesFor, isAllBranches } from '../../Utils/branches.js';

/* ───────────── small building blocks ───────────── */
function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="breadcrumb">
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !it.to ? (
                <span aria-current={last ? 'page' : undefined}>{it.label}</span>
              ) : (
                <Link to={it.to}>{it.label}</Link>
              )}
              {!last && <Icon name="chevron" size={14} className="crumbs__sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BackButton({ to, label }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="pc-back" onClick={() => navigate(to)}>
      <Icon name="chevron" size={16} className="pc-back__icon" />
      {label}
    </button>
  );
}

function Meta({ ui, duration, hours }) {
  return (
    <div className="pc-meta">
      {duration && (
        <span>
          <Icon name="calendar" size={14} /> {ui.duration}: {duration}
        </span>
      )}
      {hours ? (
        <span>
          <Icon name="clock" size={14} /> {hours} {ui.hours}
        </span>
      ) : null}
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className="pc-block">
      <h2 className="pc-block__title">
        <Icon name={icon} size={20} />
        {title}
      </h2>
      {children}
    </section>
  );
}

const Bullets = ({ items }) => (
  <ul className="pc-list">
    {items.map((x, i) => (
      <li key={i}>
        <span className="dot" />
        {x}
      </li>
    ))}
  </ul>
);

/* ───────────── Level 1 : the three groups ───────────── */
function GroupsView({ cat, base }) {
  const { ui } = cat;
  return (
    <>
      <h2 className="pc-heading">{ui.title}</h2>
      <ProgramTabs base={base} idPrefix="page-prog" />
    </>
  );
}

/* ───────────── Level 2 : diploma / course types ───────────── */
function TypesView({ cat, group, base }) {
  const { ui } = cat;
  return (
    <>
      <div className="pc-head">
        <span className="pc-head__icon">
          <Icon name={group.icon} size={30} stroke={1.6} />
        </span>
        <div>
          <h2 className="pc-heading">{group.title}</h2>
          <p className="pc-head__desc">{group.desc}</p>
        </div>
      </div>
      <h3 className="pc-sub">{ui.chooseType}</h3>
      <div className="pc-grid">
        {group.types.map((t) => (
          <article key={t.id} className="pc-card pc-card--type">
            <span className="pc-card__icon">
              <Icon name={t.icon} size={30} stroke={1.6} />
            </span>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <Meta ui={ui} duration={t.duration} hours={t.hours} />
            <div className="pc-card__stats">
              <span>
                <b>{t.courses.length}</b> {ui.courses}
              </span>
            </div>
            <Link className="btn btn--primary btn--sm" to={`${base}/${group.id}/${t.id}`}>
              <Icon name="eye" size={16} /> {ui.viewCourses}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

/* ───────────── Level 3 : courses of a diploma (expandable) ───────────── */
function CoursesView({ cat, group, type, base }) {
  const { ui } = cat;
  const [open, setOpen] = useState(() => new Set());
  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <>
      <div className="pc-head">
        <span className="pc-head__icon">
          <Icon name={type.icon} size={30} stroke={1.6} />
        </span>
        <div>
          <h2 className="pc-heading">{type.title}</h2>
          <p className="pc-head__desc">{type.desc}</p>
          <Meta ui={ui} duration={type.duration} hours={type.hours} />
        </div>
      </div>

      <h3 className="pc-sub">{ui.chooseCourse}</h3>
      <ul className="pc-courses">
        {type.courses.map((c, i) => {
          const isOpen = open.has(c.id);
          return (
            <li key={c.id} className={`pc-course ${isOpen ? 'is-open' : ''}`}>
              <div className="pc-course__row">
                <span className="pc-course__num">{i + 1}</span>
                <span className="pc-course__icon">
                  <Icon name={c.icon} size={22} stroke={1.6} />
                </span>
                <div className="pc-course__main">
                  <Link to={`${base}/${group.id}/${type.id}/${c.id}`} className="pc-course__title">
                    {c.title}
                  </Link>
                  <p>{c.desc}</p>
                  <Meta ui={ui} duration={c.duration} hours={c.hours} />
                </div>
                <div className="pc-course__actions">
                  <button
                    type="button"
                    className="pc-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggle(c.id)}
                  >
                    {isOpen ? ui.hideModules : ui.showModules}
                    <Icon name="chevron" size={14} className="pc-toggle__icon" />
                  </button>
                  <Link className="btn btn--primary btn--sm" to={`${base}/${group.id}/${type.id}/${c.id}`}>
                    {ui.viewDetails}
                  </Link>
                </div>
              </div>

              {isOpen && (
                <ol className="pc-course__modules">
                  {c.modules.map((m, k) => (
                    <li key={k}>
                      <b>{m.title}</b>
                      <span>
                        {m.hours} {ui.hoursShort}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ───────────── Level 4 : full details + study plan ───────────── */
function CourseView({ cat, group, type, course, base }) {
  const { ui } = cat;
  const { content, lang } = useContent();
  const labels = getSliderLabels(lang, content.courses?.labels);
  const allBranches = content.branches?.items || [];
  // a course follows its diploma's branches unless it sets its own
  const offer = course.branchMode ? course : type;
  const idx = type.courses.findIndex((x) => x.id === course.id);
  const prev = type.courses[idx - 1];
  const next = type.courses[idx + 1];
  const [open, setOpen] = useState(() => new Set([0]));
  const allOpen = open.size === course.modules.length;

  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const link = (c) => `${base}/${group.id}/${type.id}/${c.id}`;

  return (
    <div className="pc-detail">
      <div className="pc-detail__main">
        <div className="pc-head">
          <span className="pc-head__icon">
            <Icon name={course.icon} size={30} stroke={1.6} />
          </span>
          <div>
            <span className="pc-tag">{type.title}</span>
            <h2 className="pc-heading">{course.title}</h2>
          </div>
        </div>

        <Section icon="book" title={ui.overview}>
          <p className="pc-text">{course.desc}</p>
        </Section>

        {course.objectives?.length > 0 && (
          <Section icon="eye" title={ui.objectives}>
            <Bullets items={course.objectives} />
          </Section>
        )}

        {course.outcomes?.length > 0 && (
          <Section icon="cap" title={ui.outcomes}>
            <Bullets items={course.outcomes} />
          </Section>
        )}

        <Section icon="layers" title={ui.content}>
          <ol className="pc-chips">
            {course.modules.map((m, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                {m.title}
              </li>
            ))}
          </ol>
        </Section>

        <Section icon="calendar" title={ui.plan}>
          <button type="button" className="pc-link" onClick={() => setOpen(allOpen ? new Set() : new Set(course.modules.map((_, i) => i)))}>
            {allOpen ? ui.collapseAll : ui.expandAll}
          </button>
          <div className="pc-plan">
            {course.modules.map((m, i) => {
              const isOpen = open.has(i);
              return (
                <div key={i} className={`pc-step ${isOpen ? 'is-open' : ''}`}>
                  <button type="button" className="pc-step__head" aria-expanded={isOpen} onClick={() => toggle(i)}>
                    <span className="pc-step__num">{i + 1}</span>
                    <span className="pc-step__title">
                      <small>
                        {ui.module} {i + 1}
                      </small>
                      {m.title}
                    </span>
                    <span className="pc-step__hrs">
                      {m.hours} {ui.hoursShort}
                    </span>
                    <Icon name="chevron" size={16} className="pc-step__chev" />
                  </button>
                  {isOpen && (
                    <div className="pc-step__body">
                      <h4>{ui.topics}</h4>
                      <Bullets items={m.topics} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {course.practical?.length > 0 && (
          <Section icon="screen" title={ui.practical}>
            <Bullets items={course.practical} />
          </Section>
        )}

        {course.skills?.length > 0 && (
          <Section icon="trainer" title={ui.skills}>
            <ul className="pc-tags">
              {course.skills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Section>
        )}

        {course.prerequisites?.length > 0 && (
          <Section icon="cert" title={ui.prerequisites}>
            <Bullets items={course.prerequisites} />
          </Section>
        )}

        <div className="pc-detail__branches">
          <BranchList
            branches={branchesFor(offer, allBranches)}
            total={allBranches.length}
            all={isAllBranches(offer)}
            regions={content.branches?.regions || []}
            labels={labels}
          />
        </div>

        <div className="pc-pager">
          {prev ? (
            <Link to={link(prev)} className="pc-pager__btn pc-pager__btn--prev">
              <Icon name="chevron" size={16} className="pc-back__icon" />
              <span>
                <small>{ui.prev}</small>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={link(next)} className="pc-pager__btn pc-pager__btn--next">
              <span>
                <small>{ui.next}</small>
                {next.title}
              </span>
              <Icon name="chevron" size={16} className="pc-card__arrow" />
            </Link>
          )}
        </div>
      </div>

      <aside className="pc-detail__side">
        <div className="pc-summary">
          <h3>{ui.summary}</h3>
          <dl>
            <div>
              <dt>{ui.duration}</dt>
              <dd>{course.duration}</dd>
            </div>
            <div>
              <dt>{ui.hours}</dt>
              <dd>{course.hours}</dd>
            </div>
            <div>
              <dt>{ui.modules}</dt>
              <dd>{course.modules.length}</dd>
            </div>
          </dl>
          <a className="btn btn--primary" href="/#contact">
            {ui.register}
          </a>
        </div>
      </aside>
    </div>
  );
}

export default function ProgramsCatalog() {
  const { lang } = useLang();
  const params = useParams();
  const cat = useCatalog(); // editable from the dashboard (content.catalog)
  const { ui } = cat;

  const [groupId, typeId, courseId] = (params['*'] || '').split('/').filter(Boolean);

  const group = cat.groups.find((g) => g.id === groupId);
  const type = group?.types.find((t) => t.id === typeId);
  const course = type?.courses.find((c) => c.id === courseId);

  const invalid = (groupId && !group) || (typeId && !type) || (courseId && !course);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [groupId, typeId, courseId]);

  // Breadcrumb trail + where "Back" goes.
  const crumbs = [{ label: ui.home, to: '/' }, { label: ui.programs, to: PROGRAMS_PATH }];
  let backTo = '/';
  let backLabel = ui.home;
  if (group) {
    crumbs.push({ label: group.title, to: `${PROGRAMS_PATH}/${group.id}` });
    backTo = PROGRAMS_PATH;
    backLabel = ui.programs;
  }
  if (type) {
    crumbs.push({ label: type.title, to: `${PROGRAMS_PATH}/${group.id}/${type.id}` });
    backTo = `${PROGRAMS_PATH}/${group.id}`;
    backLabel = group.title;
  }
  if (course) {
    crumbs.push({ label: course.title });
    backTo = `${PROGRAMS_PATH}/${group.id}/${type.id}`;
    backLabel = type.title;
  }

  const bannerTitle = course?.title || type?.title || group?.title || ui.title;
  const bannerSub = course?.desc || type?.desc || group?.desc || ui.subtitle;

  return (
    <div key={lang} className="lang-fade">
      <Header />
      <SiteFrame>
        <main>
          <PageBanner title={bannerTitle} subtitle={bannerSub} />

          <section className="listing pc">
            <div className="container">
              {/* <div className="pc-toolbar">
                <BackButton to={backTo} label={`${ui.back} · ${backLabel}`} />
                <Breadcrumbs items={crumbs} />
              </div> */}

              <div className="pc-stage" key={`${groupId}/${typeId}/${courseId}`}>
                {invalid ? (
                  <div className="pc-empty">
                    <p>{ui.notFound}</p>
                    <Link className="btn btn--primary btn--sm" to={PROGRAMS_PATH}>
                      {ui.backToPrograms}
                    </Link>
                  </div>
                ) : course ? (
                  <CourseView cat={cat} group={group} type={type} course={course} base={PROGRAMS_PATH} />
                ) : type ? (
                  <CoursesView cat={cat} group={group} type={type} base={PROGRAMS_PATH} />
                ) : group ? (
                  <TypesView cat={cat} group={group} base={PROGRAMS_PATH} />
                ) : (
                  <GroupsView cat={cat} base={PROGRAMS_PATH} />
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </SiteFrame>
    </div>
  );
}