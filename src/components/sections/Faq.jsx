import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import FaqIllustration from '../common/FaqIllustration.jsx';

/* "الأسئلة الشائعة" — accordion (one answer open at a time) next to an illustration. */
export default function Faq() {
  const { content } = useContent();
  const f = content.faq;
  const items = f?.items || [];
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <section className="fq" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <Reveal direction="up" className="section-head">
          <h2 className="section-title" id="faq-title">
            <span className="section-title__line" />
            {f.title}
            <span className="section-title__line" />
          </h2>
          {f.subtitle && <p className="section-desc">{f.subtitle}</p>}
        </Reveal>

        <div className="fq__grid">
          <div className="fq__list">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={it.id} direction="up" delay={i * 70}>
                  <div className={`fq-item ${isOpen ? 'is-open' : ''}`}>
                    <h3 className="fq-item__q">
                      <button
                        type="button"
                        id={`faq-q-${it.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${it.id}`}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                      >
                        <span>{it.q}</span>
                        <Icon name="chevron" size={18} stroke={2.4} className="fq-item__chev" />
                      </button>
                    </h3>
                    <div className="fq-item__panel" id={`faq-a-${it.id}`} role="region" aria-labelledby={`faq-q-${it.id}`}>
                      <div className="fq-item__inner">
                        <p>{it.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal direction="zoom" delay={150} className="fq__art-wrap">
            <FaqIllustration />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
