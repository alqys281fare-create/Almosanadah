import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import CatalogEditor from './CatalogEditor.jsx';
import CoursesPageEditor from './CoursesPageEditor.jsx';
import { ProgramsEditor, UiLabelsEditor } from './Editors.jsx';

const TABS = [
  { key: 'catalog', label: 'الكتالوج', hint: 'البرامج والدبلومات والمقررات', icon: 'layers' },
  { key: 'home', label: 'قسم الصفحة الرئيسية', hint: 'عنوان ووصف القسم', icon: 'home' },
  { key: 'page', label: 'صفحة الدورات', hint: 'نصوص /courses والبانر', icon: 'cap' },
  { key: 'labels', label: 'نصوص البطاقات والتفاصيل', hint: 'الأزرار والعناوين', icon: 'settings' },
];

/*
 * ONE place for everything about programs, diplomas and courses.
 *
 * The home «Programs» section, the /courses page and the /programs pages all read the SAME catalog
 * (content.catalog.groups). Adding or changing a diploma / course in «الكتالوج» therefore updates all three,
 * and the other tabs only hold the texts around the cards.
 *
 * Every tab stays mounted (just hidden) so switching tabs never throws away unsaved edits.
 */
export default function ProgramsHub({ notify }) {
  const { content } = useContent();
  const [tab, setTab] = useState('catalog');

  const groups = content.catalog?.groups || [];
  const types = groups.reduce((n, g) => n + (g.types || []).length, 0);
  const courses = groups.reduce((n, g) => n + (g.types || []).reduce((m, t) => m + (t.courses || []).length, 0), 0);

  return (
    <>
      <section className="hub">
        <div className="hub__stats">
          <span><strong>{groups.length}</strong> برنامج</span>
          <span><strong>{types}</strong> دبلوم / دورة</span>
          <span><strong>{courses}</strong> مقرر</span>
        </div>
        <p className="hub__note">
          <Icon name="check" size={16} /> الصفحة الرئيسية وصفحة الدورات وصفحات البرامج تقرأ كلها من هذا الكتالوج الواحد، فأي تعديل هنا يظهر في الثلاثة.
        </p>
        <div className="hub__tabs" role="tablist" aria-label="أقسام إدارة البرامج">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`hub__tab ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <Icon name={t.icon} size={18} />
              <span>
                <strong>{t.label}</strong>
                <small>{t.hint}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div hidden={tab !== 'catalog'}>
        <CatalogEditor notify={notify} />
      </div>
      <div hidden={tab !== 'home'}>
        <ProgramsEditor notify={notify} />
      </div>
      <div hidden={tab !== 'page'}>
        <CoursesPageEditor notify={notify} />
      </div>
      <div hidden={tab !== 'labels'}>
        <UiLabelsEditor notify={notify} />
      </div>
    </>
  );
}
