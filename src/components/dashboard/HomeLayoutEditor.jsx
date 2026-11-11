import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import { Panel, moveItem, useDraft } from './Fields.jsx';
import { DEFAULT_HOME_ORDER, HOME_SECTIONS, PINNED_SECTIONS, normalizeHomeLayout } from '../../data/homeSections.js';

/* section id → the dashboard page that edits its content */
const EDIT_KEY = {
  hero: 'hero',
  features: 'features',
  programs: 'programs',
  about: 'about',
  stats: 'stats',
  gallery: 'gallery',
  branches: 'branches',
  accreditation: 'accreditation',
  testimonials: 'testimonials',
  partners: 'partners',
  faq: 'faq',
  contact: 'contact',
};

const label = (id) => HOME_SECTIONS[id]?.label.ar || id;

/*
 * Order + visibility of the home page sections.
 * Stored once (content.homeLayout) and applied to BOTH languages, so the Arabic and English pages always match.
 * Hero + Features stay pinned at the top: the first screen is sized to fill exactly one viewport.
 */
export default function HomeLayoutEditor({ notify, go }) {
  const { content, updateShared } = useContent();
  const [layout, setLayout, dirty, discard] = useDraft(normalizeHomeLayout(content.homeLayout));
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const pinned = layout.order.filter((id) => PINNED_SECTIONS.includes(id));
  const movable = layout.order.filter((id) => !PINNED_SECTIONS.includes(id));
  const setMovable = (next) => setLayout((l) => ({ ...l, order: [...pinned, ...next] }));
  const toggle = (id) =>
    setLayout((l) => ({ ...l, hidden: l.hidden.includes(id) ? l.hidden.filter((x) => x !== id) : [...l.hidden, id] }));

  const drop = (targetId) => {
    if (dragId && dragId !== targetId) {
      const from = movable.indexOf(dragId);
      const to = movable.indexOf(targetId);
      const next = movable.filter((x) => x !== dragId);
      next.splice(to, 0, movable[from]);
      setMovable(next);
    }
    setDragId(null);
    setOverId(null);
  };

  const visibleCount = layout.order.length - layout.hidden.length;
  const isDefault =
    JSON.stringify(layout.order) === JSON.stringify(DEFAULT_HOME_ORDER) && layout.hidden.length === 0;

  return (
    <Panel
      title="ترتيب أقسام الصفحة الرئيسية"
      hint="اسحب البطاقات أو استخدم الأسهم لتغيير ترتيب ظهور الأقسام، وأخفِ أي قسم لا تريده. الترتيب يُطبَّق على العربية والإنجليزية معًا."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateShared('homeLayout', layout);
        notify('تم حفظ ترتيب الصفحة الرئيسية');
      }}
      extra={
        <>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={isDefault}
            onClick={() => setLayout({ order: [...DEFAULT_HOME_ORDER], hidden: [] })}
          >
            <Icon name="reset" size={16} /> الترتيب الافتراضي
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
            <Icon name="eye" size={16} /> معاينة
          </a>
        </>
      }
    >
      <p className="layout-summary">
        <strong>{visibleCount}</strong> قسمًا ظاهرًا من أصل <strong>{layout.order.length}</strong>
        {layout.hidden.length > 0 && <> · <span>{layout.hidden.length} مخفي</span></>}
      </p>

      <ol className="layout-list">
        {pinned.map((id) => (
          <li key={id} className="layout-item layout-item--pinned">
            <span className="layout-item__grip" aria-hidden="true">
              <Icon name="lock" size={16} />
            </span>
            <strong>{label(id)}</strong>
            <span className="layout-item__note">ثابت في أعلى الصفحة</span>
            {go && EDIT_KEY[id] && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(EDIT_KEY[id])}>
                تعديل المحتوى
              </button>
            )}
          </li>
        ))}

        {movable.map((id, i) => {
          const hidden = layout.hidden.includes(id);
          return (
            <li
              key={id}
              className={`layout-item ${hidden ? 'is-hidden' : ''} ${dragId === id ? 'is-dragging' : ''} ${
                overId === id && dragId !== id ? 'is-over' : ''
              }`}
              draggable
              onDragStart={(e) => {
                setDragId(id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (overId !== id) setOverId(id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop(id);
              }}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
            >
              <span className="layout-item__grip" aria-hidden="true" title="اسحب لإعادة الترتيب">
                <Icon name="menu" size={18} />
              </span>
              <span className="layout-item__num">{i + 1}</span>
              <strong>{label(id)}</strong>
              {hidden && <span className="layout-item__note">مخفي عن الزوار</span>}

              <span className="layout-item__actions">
                {go && EDIT_KEY[id] && (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(EDIT_KEY[id])}>
                    تعديل المحتوى
                  </button>
                )}
                <button
                  type="button"
                  className="icon-btn"
                  disabled={i === 0}
                  onClick={() => setMovable(moveItem(movable, i, -1))}
                  aria-label="تحريك للأعلى"
                  title="تحريك للأعلى"
                >
                  <Icon name="chevronDown" size={18} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  disabled={i === movable.length - 1}
                  onClick={() => setMovable(moveItem(movable, i, 1))}
                  aria-label="تحريك للأسفل"
                  title="تحريك للأسفل"
                >
                  <Icon name="chevronDown" size={18} />
                </button>
                <button
                  type="button"
                  className={`icon-btn ${hidden ? '' : 'icon-btn--danger'}`}
                  onClick={() => toggle(id)}
                  aria-pressed={hidden}
                  aria-label={hidden ? 'إظهار القسم' : 'إخفاء القسم'}
                  title={hidden ? 'إظهار القسم' : 'إخفاء القسم'}
                >
                  <Icon name={hidden ? 'eye' : 'eyeOff'} size={18} />
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="field__hint">
        ملاحظة: إخفاء قسم يُخفي أيضًا الروابط التي تشير إليه في القائمة العلوية (مثل «من نحن» أو «تواصل معنا») حتى تعدّلها من «بيانات الموقع».
      </p>
    </Panel>
  );
}
