import { useContent } from '../../context/ContentContext.jsx';
import Counter from '../common/Counter.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';

export default function Stats() {
  const { content } = useContent();

  return (
    <section className="stats" id="stats">
      <SectionDivider from="var(--card)" variant="tilt" />
      <div className="container stats__grid">
        {content.stats.map((s, i) => (
          <Reveal key={s.id} direction="up" delay={i * 100} className="stat">
            <span className="stat__icon">
              <Icon name={s.icon} size={40} stroke={1.5} />
            </span>
            <strong className="stat__value">
              <Counter value={Number(s.value) || 0} suffix={s.suffix} />
            </strong>
            <span className="stat__label">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
