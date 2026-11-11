import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import { PROGRAMS_PATH } from '../../data/Programscatalog.js';
import Icon from '../common/Icons.jsx';
import { OfferCard } from '../common/Offer.jsx';
import { asList, cardGoals, typeHours } from '../common/TypeDetails.jsx';
import { getSliderLabels } from '../../data/sliderLabels.js';
import { AddButton, AreaField, BranchPicker, Grid, IconField, ImageField, Panel, Row, TextField, moveItem, useDraft } from './Fields.jsx';

/*
 * Dashboard editor for the programs catalog the public /programs pages render:
 *
 *    Programs (3 main categories)  →  Diplomas / course types  →  Courses  →  Modules (study plan) → Topics
 *
 * It edits content.catalog.groups — exactly the structure Programscatlog.jsx / Programs.jsx read.
 *
 * Arabic and English are stored as two separate trees (one per language):
 *   - TEXT is edited only for the language selected in «لغة المحتوى» (top of the dashboard);
 *   - STRUCTURE (add / delete / reorder) is applied to both languages at once, so a diploma or course
 *     always exists in both and its link (/programs/<program>/<diploma>/<course>) works in either language.
 *     The other language gets a placeholder title that you then translate by switching «لغة المحتوى».
 */

const T = {
  ar: { program: 'برنامج جديد', diploma: 'دبلوم جديد', course: 'مقرر جديد', module: 'محور جديد', topic: 'موضوع', months: '3 أشهر' },
  en: { program: 'New program', diploma: 'New diploma', course: 'New course', module: 'New module', topic: 'Topic', months: '3 months' },
};

const uid = (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const lines = (v) => String(v ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
};

/* ---------- immutable tree helpers (a tree = the `groups` array of ONE language) ---------- */
const mapGroup = (groups, gid, fn) => groups.map((g) => (g.id === gid ? fn(g) : g));
const mapType = (groups, gid, tid, fn) =>
  mapGroup(groups, gid, (g) => ({ ...g, types: (g.types || []).map((t) => (t.id === tid ? fn(t) : t)) }));
const mapCourse = (groups, gid, tid, cid, fn) =>
  mapType(groups, gid, tid, (t) => ({ ...t, courses: (t.courses || []).map((c) => (c.id === cid ? fn(c) : c)) }));
const moveById = (list, id, dir) => {
  const i = list.findIndex((x) => x.id === id);
  return i < 0 ? list : moveItem(list, i, dir);
};
const without = (list, id) => list.filter((x) => x.id !== id);

/* ---------- blank nodes ---------- */
const newModule = (l) => ({ title: T[l].module, hours: 10, topics: [`${T[l].topic} 1`, `${T[l].topic} 2`] });
const newCourse = (id, l) => ({
  id,
  icon: 'book',
  title: T[l].course,
  desc: '',
  hours: 40,
  duration: T[l].months,
  modules: [newModule(l)],
  objectives: [],
  outcomes: [],
  skills: [],
  practical: [],
  prerequisites: [],
});
const newType = (id, l) => ({
  id,
  icon: 'cap',
  title: T[l].diploma,
  desc: '',
  duration: T[l].months,
  hours: 0,
  goals: [],
  outcomes: [],
  skills: [],
  practical: [],
  prerequisites: [],
  courses: [],
});
const newGroup = (id, l) => ({ id, icon: 'book', title: T[l].program, desc: '', types: [] });

/* make sure every array the public pages call .map()/.length on exists, and numbers are numbers */
const cleanCourse = (c) => ({
  ...c,
  title: String(c.title || '').trim() || '—',
  hours: num(c.hours),
  objectives: lines((c.objectives || []).join?.('\n')),
  outcomes: lines((c.outcomes || []).join?.('\n')),
  skills: lines((c.skills || []).join?.('\n')),
  practical: lines((c.practical || []).join?.('\n')),
  prerequisites: lines((c.prerequisites || []).join?.('\n')),
  modules: (c.modules || []).map((m) => ({
    ...m,
    title: String(m.title || '').trim() || '—',
    hours: num(m.hours),
    topics: lines((m.topics || []).join?.('\n')),
  })),
});
const cleanTree = (groups) =>
  groups.map((g) => ({
    ...g,
    title: String(g.title || '').trim() || '—',
    types: (g.types || []).map((t) => ({
      ...t,
      title: String(t.title || '').trim() || '—',
      hours: num(t.hours),
      goals: lines(asList(t.goals).join('\n')),
      objectives: lines(asList(t.objectives).join('\n')),
      outcomes: lines(asList(t.outcomes).join('\n')),
      skills: lines(asList(t.skills).join('\n')),
      practical: lines(asList(t.practical).join('\n')),
      prerequisites: lines(asList(t.prerequisites).join('\n')),
      courses: (t.courses || []).map(cleanCourse),
    })),
  }));

/* a textarea where every line is one list item */
function LinesField({ label, value, onChange, rows = 4 }) {
  return <AreaField label={label} value={(value || []).join('\n')} onChange={(v) => onChange(v.split('\n'))} rows={rows} />;
}

function Crumbs({ items }) {
  return (
    <nav className="cat-crumbs" aria-label="المسار">
      {items.map((it, i) => (
        <span key={i} className="cat-crumbs__item">
          {i > 0 && <Icon name="chevron" size={14} className="cat-crumbs__sep" />}
          {it.onClick ? (
            <button type="button" onClick={it.onClick}>
              {it.label}
            </button>
          ) : (
            <strong>{it.label}</strong>
          )}
        </span>
      ))}
    </nav>
  );
}

/* a list entry: title + counts, with open / reorder / delete */
function Entry({ index, last, icon, title, meta, onOpen, onMove, onRemove, openLabel }) {
  return (
    <div className="cat-entry">
      <span className="cat-entry__icon">
        <Icon name={icon || 'book'} size={22} />
      </span>
      <button type="button" className="cat-entry__main" onClick={onOpen}>
        <strong>
          <span className="row-card__num">{index + 1}</span>
          {title}
        </strong>
        <small>{meta}</small>
      </button>
      <span className="cat-entry__btns">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onOpen}>
          <Icon name="edit" size={16} /> {openLabel}
        </button>
        <button type="button" className="icon-btn" disabled={index === 0} onClick={() => onMove(-1)} aria-label="تحريك للأعلى" title="تحريك للأعلى">
          <Icon name="chevronDown" size={18} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <button type="button" className="icon-btn" disabled={last} onClick={() => onMove(1)} aria-label="تحريك للأسفل" title="تحريك للأسفل">
          <Icon name="chevronDown" size={18} />
        </button>
        <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove} aria-label="حذف" title="حذف">
          <Icon name="trash" size={18} />
        </button>
      </span>
    </div>
  );
}

export default function CatalogEditor({ notify }) {
  const { lang, allContents, updateLang } = useContent();
  const langName = lang === 'en' ? 'الإنجليزي (English)' : 'العربي';
  const labels = getSliderLabels(lang, allContents[lang].courses?.labels);

  const [d, setD, dirty, discard] = useDraft({
    ar: allContents.ar.catalog?.groups || [],
    en: allContents.en.catalog?.groups || [],
  });
  const [sel, setSel] = useState({ g: null, t: null, c: null }); // current drill-down position

  const tree = d[lang];
  const group = tree.find((g) => g.id === sel.g);
  const type = group?.types?.find((t) => t.id === sel.t);
  const course = type?.courses?.find((c) => c.id === sel.c);

  /* text edits touch the language being edited only; structure edits touch both */
  const mine = (fn) => setD((x) => ({ ...x, [lang]: fn(x[lang]) }));
  const both = (fn) => setD((x) => ({ ar: fn(x.ar, 'ar'), en: fn(x.en, 'en') }));

  const confirmDelete = (what) =>
    window.confirm(`حذف ${what}؟ سيُحذف من النسختين العربية والإنجليزية، ولن يظهر في الموقع بعد الحفظ.`);

  const patchGroup = (patch) => mine((g) => mapGroup(g, sel.g, (x) => ({ ...x, ...patch })));
  const patchType = (patch) => mine((g) => mapType(g, sel.g, sel.t, (x) => ({ ...x, ...patch })));
  const patchCourse = (patch) => mine((g) => mapCourse(g, sel.g, sel.t, sel.c, (x) => ({ ...x, ...patch })));
  const patchModule = (i, patch) => patchCourse({ modules: course.modules.map((m, j) => (j === i ? { ...m, ...patch } : m)) });

  /* ---- structure (both languages) ---- */
  const addGroup = () => {
    const id = uid('g');
    both((g, l) => [...g, newGroup(id, l)]);
    setSel({ g: id, t: null, c: null });
  };
  const addType = () => {
    const id = uid('t');
    both((g, l) => mapGroup(g, sel.g, (x) => ({ ...x, types: [...(x.types || []), newType(id, l)] })));
    setSel({ g: sel.g, t: id, c: null });
  };
  const addCourse = () => {
    const id = uid('c');
    both((g, l) => mapType(g, sel.g, sel.t, (x) => ({ ...x, courses: [...(x.courses || []), newCourse(id, l)] })));
    setSel({ g: sel.g, t: sel.t, c: id });
  };
  const addModule = () => {
    // a study-plan module is part of ONE language's text (its number and order are what matter), so add it to both to keep them aligned
    both((g, l) => mapCourse(g, sel.g, sel.t, sel.c, (c) => ({ ...c, modules: [...(c.modules || []), newModule(l)] })));
  };
  const removeModule = (i) => both((g) => mapCourse(g, sel.g, sel.t, sel.c, (c) => ({ ...c, modules: (c.modules || []).filter((_, j) => j !== i) })));
  const moveModule = (i, dir) => both((g) => mapCourse(g, sel.g, sel.t, sel.c, (c) => ({ ...c, modules: moveItem(c.modules || [], i, dir) })));

  const save = () => {
    ['ar', 'en'].forEach((l) => updateLang(l, 'catalog', { groups: cleanTree(d[l]) }));
    notify('تم حفظ البرامج والدبلومات والمقررات');
  };

  /* ---------- breadcrumb ---------- */
  const crumbs = [{ label: 'البرامج', onClick: group ? () => setSel({ g: null, t: null, c: null }) : undefined }];
  if (group) crumbs.push({ label: group.title, onClick: type ? () => setSel({ g: sel.g, t: null, c: null }) : undefined });
  if (type) crumbs.push({ label: type.title, onClick: course ? () => setSel({ g: sel.g, t: sel.t, c: null }) : undefined });
  if (course) crumbs.push({ label: course.title });

  const previewPath = [PROGRAMS_PATH, sel.g, sel.t, sel.c].filter(Boolean).join('/');

  /* ---------- level 3 : one course — every detail + the full study plan ---------- */
  const courseView = course && (
    <>
      <h3 className="sub-title">بيانات المقرر</h3>
      <TextField label="اسم المقرر" value={course.title} onChange={(v) => patchCourse({ title: v })} />
      <AreaField label="نبذة عن المقرر" value={course.desc} onChange={(v) => patchCourse({ desc: v })} rows={3} />
      <Grid cols={3}>
        <TextField label="المدة (مثال: 12 أسبوعًا)" value={course.duration || ''} onChange={(v) => patchCourse({ duration: v })} />
        <TextField label="عدد الساعات التدريبية" type="number" dir="ltr" min="0" value={course.hours ?? ''} onChange={(v) => patchCourse({ hours: v })} />
        <span />
      </Grid>
      <IconField value={course.icon} onChange={(v) => patchCourse({ icon: v })} />

      <h3 className="sub-title">التفاصيل (كل عنصر في سطر)</h3>
      <Grid>
        <LinesField label="أهداف المقرر" value={course.objectives} onChange={(v) => patchCourse({ objectives: v })} />
        <LinesField label="مخرجات التعلم" value={course.outcomes} onChange={(v) => patchCourse({ outcomes: v })} />
        <LinesField label="المهارات المكتسبة" value={course.skills} onChange={(v) => patchCourse({ skills: v })} />
        <LinesField label="التدريب العملي والتقييم" value={course.practical} onChange={(v) => patchCourse({ practical: v })} />
      </Grid>
      <LinesField label="المتطلبات والشروط المسبقة" value={course.prerequisites} onChange={(v) => patchCourse({ prerequisites: v })} rows={3} />

      <h3 className="sub-title">الخطة الدراسية — المحاور ({(course.modules || []).length})</h3>
      <p className="field__hint">كل محور يظهر في الموقع كخطوة قابلة للفتح، ومواضيعه (موضوع في كل سطر) تظهر داخله. أضف المحاور وحذفها وغيّر ترتيبها هنا؛ يُطبَّق ذلك على اللغتين.</p>
      <div className="stack">
        {(course.modules || []).map((m, i) => (
          <Row
            key={i}
            index={i}
            title={m.title}
            onRemove={() => confirmDelete('هذا المحور') && removeModule(i)}
            onMoveUp={i > 0 ? () => moveModule(i, -1) : undefined}
            onMoveDown={i < course.modules.length - 1 ? () => moveModule(i, 1) : undefined}
          >
            <Grid cols={3}>
              <TextField label="عنوان المحور" value={m.title} onChange={(v) => patchModule(i, { title: v })} />
              <TextField label="الساعات" type="number" dir="ltr" min="0" value={m.hours ?? ''} onChange={(v) => patchModule(i, { hours: v })} />
              <span />
            </Grid>
            <LinesField label="المواضيع (موضوع في كل سطر)" value={m.topics} onChange={(v) => patchModule(i, { topics: v })} rows={4} />
          </Row>
        ))}
      </div>
      <AddButton onClick={addModule}>إضافة محور</AddButton>
    </>
  );

  /* ---------- level 2 : one diploma / course type ---------- */
  /* the goals shown on the card and in the details window are ONE list: keep both fields in sync */
  const typeGoals = type ? (asList(type.goals).length ? asList(type.goals) : asList(type.objectives)) : [];
  const setTypeGoals = (v) => patchType({ goals: v, objectives: v });

  const typeView = type && !course && (
    <>
      <div className="cat-split">
        <div className="cat-split__form">
          <h3 className="sub-title">١ · ما يظهر في البطاقة</h3>
          <TextField label="الاسم" value={type.title} onChange={(v) => patchType({ title: v })} />
          <AreaField label="الوصف المختصر" value={type.desc} onChange={(v) => patchType({ desc: v })} rows={2} />
          <LinesField label="الأهداف (هدف في كل سطر — تظهر في البطاقة وفي نافذة التفاصيل)" value={typeGoals} onChange={setTypeGoals} rows={4} />
          <Grid>
            <TextField label="المدة (مثال: سنتان)" value={type.duration || ''} onChange={(v) => patchType({ duration: v })} />
            <TextField label="إجمالي الساعات (فارغ = مجموع ساعات المقررات)" type="number" dir="ltr" min="0" value={type.hours ?? ''} onChange={(v) => patchType({ hours: v })} />
          </Grid>
          <IconField value={type.icon} onChange={(v) => patchType({ icon: v })} />
          <ImageField label="صورة غلاف البطاقة (اختياري)" value={type.image || ''} onChange={(v) => patchType({ image: v })} maxW={800} />
        </div>

        <aside className="cat-split__preview" aria-label="معاينة البطاقة">
          <span className="cat-split__label">معاينة مباشرة للبطاقة</span>
          <OfferCard
            icon={type.icon}
            image={type.image}
            badge={`${(type.courses || []).length} ${labels.courses}`}
            title={type.title}
            desc={type.desc}
            goals={cardGoals({ ...type, goals: typeGoals })}
            meta={[
              { icon: 'calendar', text: type.duration },
              { icon: 'clock', text: typeHours(type) ? `${typeHours(type)} ${labels.hours}` : '' },
            ]}
            where={`${(type.courses || []).length} ${labels.courses}`}
            labels={labels}
            onOpen={() => {}}
          />
        </aside>
      </div>

      <h3 className="sub-title">٢ · ما يظهر في نافذة «عرض التفاصيل» وصفحة البرنامج</h3>
      <p className="field__hint">كل عنصر في سطر. اترك أي خانة فارغة ليؤخذ محتواها تلقائيًا من مقررات هذا البرنامج.</p>
      <Grid>
        <LinesField label="مخرجات التعلم" value={asList(type.outcomes)} onChange={(v) => patchType({ outcomes: v })} />
        <LinesField label="المهارات المكتسبة" value={asList(type.skills)} onChange={(v) => patchType({ skills: v })} />
        <LinesField label="التدريب العملي والتقييم" value={asList(type.practical)} onChange={(v) => patchType({ practical: v })} rows={3} />
        <LinesField label="المتطلبات والشروط المسبقة" value={asList(type.prerequisites)} onChange={(v) => patchType({ prerequisites: v })} rows={3} />
      </Grid>

      <h3 className="sub-title">٣ · الفروع</h3>
      <BranchPicker
        label="الفروع التي يُقدَّم فيها هذا البرنامج"
        value={type}
        branches={allContents[lang].branches?.items || []}
        regions={allContents[lang].branches?.regions || []}
        onChange={(patch) => both((g) => mapType(g, sel.g, sel.t, (x) => ({ ...x, ...patch })))}
      />

      <h3 className="sub-title">٤ · المقررات ({(type.courses || []).length})</h3>
      <div className="stack">
        {(type.courses || []).map((c, i, arr) => (
          <Entry
            key={c.id}
            index={i}
            last={i === arr.length - 1}
            icon={c.icon}
            title={c.title}
            meta={`${(c.modules || []).length} محاور · ${c.hours || 0} ساعة`}
            openLabel="تعديل التفاصيل والخطة"
            onOpen={() => setSel({ g: sel.g, t: sel.t, c: c.id })}
            onMove={(dir) => both((g) => mapType(g, sel.g, sel.t, (t) => ({ ...t, courses: moveById(t.courses, c.id, dir) })))}
            onRemove={() => confirmDelete(`المقرر «${c.title}»`) && both((g) => mapType(g, sel.g, sel.t, (t) => ({ ...t, courses: without(t.courses, c.id) })))}
          />
        ))}
      </div>
      <AddButton onClick={addCourse}>إضافة مقرر</AddButton>
    </>
  );

  /* ---------- level 1 : one program (main category) ---------- */
  const groupView = group && !type && (
    <>
      <h3 className="sub-title">بيانات البرنامج</h3>
      <TextField label="اسم البرنامج" value={group.title} onChange={(v) => patchGroup({ title: v })} />
      <AreaField label="الوصف" value={group.desc} onChange={(v) => patchGroup({ desc: v })} rows={3} />
      <IconField value={group.icon} onChange={(v) => patchGroup({ icon: v })} />

      <h3 className="sub-title">الدبلومات وأنواع الدورات ({(group.types || []).length})</h3>
      <div className="stack">
        {(group.types || []).map((t, i, arr) => (
          <Entry
            key={t.id}
            index={i}
            last={i === arr.length - 1}
            icon={t.icon}
            title={t.title}
            meta={`${(t.courses || []).length} مقررات${t.duration ? ` · ${t.duration}` : ''}`}
            openLabel="فتح"
            onOpen={() => setSel({ g: sel.g, t: t.id, c: null })}
            onMove={(dir) => both((g) => mapGroup(g, sel.g, (x) => ({ ...x, types: moveById(x.types, t.id, dir) })))}
            onRemove={() => confirmDelete(`«${t.title}» وكل مقرراته`) && both((g) => mapGroup(g, sel.g, (x) => ({ ...x, types: without(x.types, t.id) })))}
          />
        ))}
      </div>
      <AddButton onClick={addType}>إضافة دبلوم / نوع دورة</AddButton>
    </>
  );

  /* ---------- level 0 : the programs ---------- */
  const rootView = !group && (
    <>
      <h3 className="sub-title">البرامج ({tree.length})</h3>
      <p className="field__hint">البرامج الرئيسية الثلاثة: الدبلومات الأكاديمية، الدبلومات المهنية، الدورات المهنية. افتح أي برنامج لإدارة دبلوماته ومقرراته.</p>
      <div className="stack">
        {tree.map((g, i, arr) => (
          <Entry
            key={g.id}
            index={i}
            last={i === arr.length - 1}
            icon={g.icon}
            title={g.title}
            meta={`${(g.types || []).length} دبلومات · ${(g.types || []).reduce((n, t) => n + (t.courses || []).length, 0)} مقررات`}
            openLabel="فتح"
            onOpen={() => setSel({ g: g.id, t: null, c: null })}
            onMove={(dir) => both((x) => moveById(x, g.id, dir))}
            onRemove={() => confirmDelete(`البرنامج «${g.title}» بكل دبلوماته ومقرراته`) && both((x) => without(x, g.id))}
          />
        ))}
      </div>
      <AddButton onClick={addGroup}>إضافة برنامج</AddButton>
    </>
  );

  return (
    <Panel
      title="البرامج والدبلومات والمقررات"
      hint={`هيكل صفحة /programs: البرنامج ← الدبلوم ← المقرر ← الخطة الدراسية. أنت تعدّل نصوص المحتوى ${langName}؛ بدّل «لغة المحتوى» من أعلى الصفحة لتعديل اللغة الأخرى. الإضافة والحذف والترتيب تُطبَّق على اللغتين معًا.`}
      dirty={dirty}
      onDiscard={discard}
      onSave={save}
      extra={
        <a href={previewPath} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      <Crumbs items={crumbs} />
      {rootView}
      {groupView}
      {typeView}
      {courseView}
    </Panel>
  );
}
