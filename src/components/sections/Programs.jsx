import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import useCatalog from '../../hooks/useCatalog.js';
import { PROGRAMS_PATH } from '../../data/Programscatalog';
import '../../styles/Programscatlog.css';

/* Home "Programs" section — Level 1 only: the three main groups.
   Everything deeper (types → courses → details) lives on /programs. */
export default function Programs() {
  const { content } = useContent();
  const programs = content?.programs;
  const cat = useCatalog();
  const { ui } = cat;

  if (!programs) return null;

  return (
    <section className="programs" id="programs">
      <SectionDivider from="var(--card)" variant="wave" />
      <div className="container">
        <Reveal direction="up" className="section-head">
          <h2 className="section-title">
            <span className="section-title__line" />
            {programs.title}
            <span className="section-title__line" />
          </h2>
          <p className="section-desc">{programs.description}</p>
        </Reveal>

        <Reveal direction="up" delay={120}>
          <div className="pc-grid pc-grid--3">
            {cat.groups.map((g) => {
              const courseCount = g.types.reduce((n, t) => n + t.courses.length, 0);
              return (
                <Link key={g.id} to={`${PROGRAMS_PATH}/${g.id}`} className="pc-card pc-card--group">
                  <span className="pc-card__icon">
                    <Icon name={g.icon} size={34} stroke={1.6} />
                  </span>
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                  <div className="pc-card__stats">
                    <span>
                      <b>{g.types.length}</b> {ui.types}
                    </span>
                    <span>
                      <b>{courseCount}</b> {ui.courses}
                    </span>
                  </div>
                  <span className="pc-card__cta">
                    {ui.explore} <Icon name="chevron" size={16} className="pc-card__arrow" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}