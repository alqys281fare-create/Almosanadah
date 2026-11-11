
import { useMemo } from 'react';

import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import SiteFrame from '../components/layout/SiteFrame.jsx';

import Hero from '../components/sections/Hero.jsx';
import Features from '../components/sections/Features.jsx';
import Programs from '../components/sections/Programs.jsx';
import About from '../components/sections/About.jsx';
import Stats from '../components/sections/Stats.jsx';
import Gallery from '../components/sections/Gallery.jsx';
import Accreditation from '../components/sections/Accreditation.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import Partners from '../components/sections/Partners.jsx';
import Faq from '../components/sections/Faq.jsx';
import Contact from '../components/sections/Contact.jsx';
import BranchesCta from '../components/sections/Branchescta.jsx';

import SectionDivider from '../components/common/SectionDivider.jsx';

import { useLang } from '../i18n/LanguageContext.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { HOME_SECTIONS, normalizeHomeLayout } from '../data/homeSections.js';

/* id → component */
const COMPONENTS = {
  hero: Hero,
  features: Features,
  programs: Programs,
  about: About,
  stats: Stats,
  gallery: Gallery,
  branches: BranchesCta,
  accreditation: Accreditation,
  testimonials: Testimonials,
  partners: Partners,
  faq: Faq,
  contact: Contact,
};

export default function Home() {
  const { lang } = useLang();
  const { content } = useContent();

  const sequence = useMemo(() => {
    const { order, hidden } = normalizeHomeLayout(content?.homeLayout);

    return order.filter((id) => !hidden.includes(id));
  }, [content?.homeLayout]);

  return (
    <div key={lang} className="lang-fade">
      <Header />

      <SiteFrame>
        <main>
          {sequence.map((id, i) => {
            const Section = COMPONENTS[id];

            if (!Section) return null;

            // Background of the previous visible section.
            const above =
              i > 0
                ? HOME_SECTIONS[sequence[i - 1]]?.bg
                : null;

            return (
              <div key={id} className="home-section-wrapper">
                

                <Section />
              </div>
            );
          })}
        </main>

        <Footer divider="var(--bg)" />
      </SiteFrame>
    </div>
  );
}
