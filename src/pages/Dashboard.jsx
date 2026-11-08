import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ContentLangScope, useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/common/Icons.jsx';
import AdmissionEditor from '../components/dashboard/AdmissionEditor.jsx';
import {
  AboutEditor,
  AccreditationEditor,
  GalleryEditor,
  TestimonialsEditor,
  PartnersEditor,
  FaqEditor,
  AdsEditor,
  BranchesEditor,
  CoursesEditor,
  CourseFiltersEditor,
  ThemeEditor,
  UiLabelsEditor,
  ContactEditor,
  FeaturesEditor,
  FooterEditor,
  HeroEditor,
  Overview,
  ProgramsEditor,
  SettingsEditor,
  SiteEditor,
  StatsEditor,
  sections,
} from '../components/dashboard/Editors.jsx';

function Shell({ editLang, setEditLang }) {
  const { logout, credentials } = useAuth();
  const { content } = useContent(); // content of the language being edited
  const navigate = useNavigate();
  const [active, setActive] = useState(() => localStorage.getItem('almosanadah:tab') || 'overview');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('almosanadah:tab', active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  const notify = useCallback((msg, type = 'success') => setToast({ msg, type, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // the server could not store the last change (not logged in on the server, offline, …)
  useEffect(() => {
    const onSync = (e) => {
      if (e.detail.ok) return;
      notify(
        e.detail.error === 'auth'
          ? 'لم يُحفظ على الخادم: سجّل الخروج ثم الدخول من جديد'
          : 'تعذّر الحفظ على الخادم، التغييرات محفوظة في هذا المتصفح فقط',
        'error'
      );
    };
    window.addEventListener('almosanadah:sync', onSync);
    return () => window.removeEventListener('almosanadah:sync', onSync);
  }, [notify]);

  const choose = (k) => {
    setActive(k);
    setMenu(false);
  };

  const view = {
    overview: <Overview go={choose} />,
    site: <SiteEditor notify={notify} />,
    hero: <HeroEditor notify={notify} />,
    features: <FeaturesEditor notify={notify} />,
    programs: <ProgramsEditor notify={notify} />,
    filters: <CourseFiltersEditor notify={notify} go={choose} />,
    labels: <UiLabelsEditor notify={notify} />,
    admission: <AdmissionEditor notify={notify} />,
    contact: <ContactEditor notify={notify} />,
    gallery: <GalleryEditor notify={notify} />,
    accreditation: <AccreditationEditor notify={notify} />,
    testimonials: <TestimonialsEditor notify={notify} />,
    partners: <PartnersEditor notify={notify} />,
    faq: <FaqEditor notify={notify} />,
    ads: <AdsEditor notify={notify} />,
    about: <AboutEditor notify={notify} />,
    stats: <StatsEditor notify={notify} />,
    courses: <CoursesEditor notify={notify} go={choose} />,
    branches: <BranchesEditor notify={notify} />,
    theme: <ThemeEditor notify={notify} />,
    footer: <FooterEditor notify={notify} />,
    settings: <SettingsEditor notify={notify} />,
  }[active];

  const current = sections.find((s) => s.key === active);

  return (
    <div className="dash" dir="rtl" lang="ar">
      <aside className={`dash__side ${menu ? 'is-open' : ''}`}>
        <div className="dash__brand">
          <strong>{content.site.name}</strong>
          <span>لوحة التحكم</span>
        </div>
        <nav className="dash__nav">
          {sections.map((s) => (
            <button key={s.key} type="button" className={`dash__link ${active === s.key ? 'is-active' : ''}`} onClick={() => choose(s.key)}>
              <Icon name={s.icon} size={20} /> {s.label}
            </button>
          ))}
        </nav>
        <div className="dash__foot">
          <Link to="/" className="dash__link">
            <Icon name="eye" size={20} /> عرض الموقع
          </Link>
          <button
            type="button"
            className="dash__link dash__link--out"
            onClick={() => {
              logout();
              navigate('/dashboard/login', { replace: true });
            }}
          >
            <Icon name="logout" size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>
      {menu && <button type="button" className="dash__scrim" aria-label="إغلاق" onClick={() => setMenu(false)} />}

      <div className="dash__main">
        <header className="dash__top">
          <button type="button" className="dash__burger" onClick={() => setMenu(true)} aria-label="القائمة">
            <Icon name="menu" size={24} />
          </button>
          <h1>{current?.label}</h1>

          <div className="lang-switch" role="group" aria-label="لغة المحتوى">
            <span className="lang-switch__label">
              <Icon name="globe" size={16} /> لغة المحتوى
            </span>
            {[
              { k: 'ar', label: 'العربية' },
              { k: 'en', label: 'English' },
            ].map((l) => (
              <button
                key={l.k}
                type="button"
                className={`lang-switch__btn ${editLang === l.k ? 'is-active' : ''}`}
                aria-pressed={editLang === l.k}
                onClick={() => setEditLang(l.k)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <span className="dash__user">
            <Icon name="user" size={18} />  {credentials?.username || 'admin'}
          </span>
        </header>
        <div className="dash__content" key={`${active}-${editLang}`}>
          {view}
        </div>
      </div>

      {toast && (
        <div className={`toast toast--${toast.type}`} role="status" key={toast.id}>
          <Icon name={toast.type === 'error' ? 'close' : 'check'} size={18} /> {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { lang } = useLang();
  // the dashboard is always Arabic/RTL and keeps the normal font size (see global.css)
  useEffect(() => {
    document.documentElement.dataset.area = 'admin';
    return () => {
      delete document.documentElement.dataset.area;
    };
  }, []);
  // Which language's content the editors work on (independent from the site language).
  const [editLang, setEditLang] = useState(lang);

  return (
    <ContentLangScope lang={editLang}>
      <Shell editLang={editLang} setEditLang={setEditLang} />
    </ContentLangScope>
  );
}
