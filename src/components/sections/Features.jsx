import { useContent } from '../../context/ContentContext.jsx';
import { useLang } from '../../i18n/LanguageContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';

export default function Features() {
  const { content } = useContent();
  const { t } = useLang();

  return (
    <section className="features" aria-label={t('featuresLabel')}>
      <div className="container features__grid">
        {content.features.map((f, i) => (
          <Reveal key={f.id} direction="up" delay={i * 90} className="feature">
            <span className="feature__icon">
              <Icon name={f.icon} size={30} />
            </span>
            <p>{f.title}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
