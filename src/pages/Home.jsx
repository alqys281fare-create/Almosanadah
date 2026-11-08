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

import { useLang } from '../i18n/LanguageContext.jsx';
import Contact from '../components/sections/Contact.jsx';
import BranchesCta from '../components/sections/Branchescta.jsx';

export default function Home() {
  const { lang } = useLang();
  return (
    // key remounts the page on language change so the fade-in plays again
    <div key={lang} className="lang-fade">
      <Header />
      <SiteFrame>
        <main>
          <Hero />
          <Features />
          <Programs />
          <About />
          <Stats />
          <Gallery />
          <BranchesCta/>
          <Accreditation />
          <Testimonials />
          <Partners />
          <Faq />
          <Contact/>
        </main>
        <Footer divider="var(--bg)" />
      </SiteFrame>
    </div>
  );
}
