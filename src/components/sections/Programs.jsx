import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import useCatalog from '../../hooks/useCatalog.js';
import { PROGRAMS_PATH } from '../../data/Programscatalog';
import ProgramTabs from './ProgramTabs.jsx';
import '../../styles/Programscatlog.css';

/* Home «Programs» section: a tab per main program, the diplomas / courses of that tab in a slider,
   and a details window (with the branches that offer it) behind every card. */
export default function Programs() {
  const { content } = useContent();
  const programs = content?.programs;
  const { ui } = useCatalog();

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
          <ProgramTabs idPrefix="home-prog" />
        </Reveal>

        
      </div>
    </section>
  );
}

