import { useContent } from '../../context/ContentContext.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';

export default function About() {
  const { content } = useContent();
  const { about } = content;

  return (
    <section className="about" id="about">

      {/* logo.png as a soft, semi-transparent watermark behind the text (this section only) */}
      <div className="about__mark" aria-hidden="true">
        <span className="about__ring" />
        <span className="about__ring about__ring--2" />
        <img className="about__logo" src="/logo.png" alt="" />
      </div>

      <div className="container about__inner">
        <Reveal direction="up" className="section-head">
          <h2 className="section-title">
            <span className="section-title__line" />
            {about.label}
            <span className="section-title__line" />
          </h2>
        </Reveal>
        <Reveal direction="up" delay={100}>
          <h2 className="about__title">{about.title}</h2>
        </Reveal>
        <div className="about__text">
          <Reveal direction="up" delay={200} as="p">
            {about.paragraphs.join(' ')}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
