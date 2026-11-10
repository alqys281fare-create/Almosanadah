import { useEffect, useRef, useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEFAULT_THEME, THEME_PRESETS, applyTheme, sanitizeTheme, useTheme } from '../../context/ThemeContext.jsx';
import { contrast, isHex } from '../../Utils/color.js';
import { saveSite } from '../../api.js';
import { allTabLabel, buildTabs, sameId } from '../../Utils/catalog.js';
import Icon from '../common/Icons.jsx';
import {
  AddButton,
  AreaField,
  BranchPicker,
  ColorField,
  Grid,
  IconField,
  ImageField,
  LinesField,
  Panel,
  Row,
  SelectField,
  TextField,
  ToggleField,
  moveItem,
  nextId,
  useDraft,
} from './Fields.jsx';
import CatalogEditor from './CatalogEditor.jsx';
import { SLIDER_LABELS } from '../../data/sliderLabels.js';
import { getCatalog } from '../../data/Programscatalog.js';
import { syncAvailability } from '../../Utils/branches.js';
import { AD_SLOT_DEFS, normalizeAds } from '../../Utils/ads.js';

/* =============== Overview =============== */
export function Overview({ go }) {
  const { content, lang } = useContent();
  const cards = [
    {
      k: 'programs',
      icon: 'layers',
      label: 'البرامج والمقررات',
      n: (content.catalog?.groups || []).reduce((n, g) => n + (g.types || []).reduce((m, t) => m + (t.courses || []).length, 0), 0),
    },
    { k: 'courses', icon: 'cap', label: 'صفحة الدورات', n: content.courses.items.length },
    { k: 'features', icon: 'cert', label: 'المميزات', n: content.features.length },
    { k: 'stats', icon: 'chart', label: 'الإحصائيات', n: content.stats.length },
    { k: 'about', icon: 'book', label: 'فقرات من نحن', n: content.about.paragraphs.length },
    { k: 'gallery', icon: 'image', label: 'صور المعرض', n: content.gallery.items.length },
    { k: 'accreditation', icon: 'cert', label: 'جهات الاعتماد', n: content.accreditation.items.length },
    { k: 'testimonials', icon: 'users', label: 'آراء الطلاب', n: content.testimonials.items.length },
    { k: 'partners', icon: 'users', label: 'الشركاء', n: content.partners.items.length },
    { k: 'faq', icon: 'book', label: 'الأسئلة الشائعة', n: content.faq.items.length },
    { k: 'ads', icon: 'image', label: 'الإعلانات', n: content.ads.enabled === false ? 'متوقفة' : 4 },
    { k: 'branches', icon: 'pin', label: 'الفروع', n: content.branches.items.length },
    { k: 'theme', icon: 'palette', label: 'ألوان الموقع', n: '' },
  ];
  return (
    <Panel
      title="مرحبًا بك في لوحة التحكم"
      hint={`تحكّم بمحتوى الموقع بالكامل. أنت تعدّل الآن المحتوى ${lang === 'en' ? 'الإنجليزي' : 'العربي'}، ويمكنك التبديل من أعلى الصفحة. التغييرات تظهر مباشرة بعد الحفظ.`}
    >
      <div className="overview">
        {cards.map((c) => (
          <button key={c.k} type="button" className="overview__card" onClick={() => go(c.k)}>
            <span className="overview__icon">
              <Icon name={c.icon} size={28} />
            </span>
            <strong>{c.n}</strong>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
      <a href="/" target="_blank" rel="noreferrer" className="btn btn--primary" style={{ marginTop: 22 }}>
        <Icon name="eye" size={18} /> معاينة الموقع
      </a>
    </Panel>
  );
}

/* =============== Site info / nav / CTA buttons =============== */

/* Mirror of the fallback in Header.jsx so the panel previews exactly what
   the live site renders before the first save. */
const FALLBACK_ACTIONS = [
  { id: 'services', label: 'خدماتى التعليمية', href: '#services', variant: 'ghost' },
  { id: 'register', label: 'سجل الان', href: '#register', variant: 'primary' },
];

export function SiteEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [site, setSite, dirty, discard] = useDraft(content.site);
  const [nav, setNav, navDirty, discardNav] = useDraft(content.nav);
  const set = (k) => (v) => setSite((s) => ({ ...s, [k]: v }));

  /* Actions: what the header / drawer buttons actually render.
     Same fallback as Header.jsx so the panel matches the live site. */
  const actions =
    Array.isArray(site.actions) && site.actions.length ? site.actions : FALLBACK_ACTIONS;

  const setActions = (next) => setSite((s) => ({ ...s, actions: next }));
  const patchAction = (i, k, v) =>
    setActions(actions.map((a, j) => (j === i ? { ...a, [k]: v } : a)));

  /* Top-bar buttons (لوحة التحكم + تبديل اللغة) */
  const topbar = {
    dashboard: { show: true, label: '', href: '/dashboard', icon: 'user', ...(site.topbar?.dashboard || {}) },
    lang: { show: true, label: '', icon: 'globe', ...(site.topbar?.lang || {}) },
  };
  const patchTop = (btn, k, v) =>
    setSite((s) => ({ ...s, topbar: { ...topbar, [btn]: { ...topbar[btn], [k]: v } } }));

  const save = () => {
    // merge actions + top-bar settings into site so header / drawer pick them up
    updateSection('site', { ...site, actions, topbar });
    updateSection('nav', nav);
    notify('تم حفظ بيانات الموقع');
  };

  return (
    <Panel
      title="بيانات الموقع"
      hint="الاسم والشعار ومعلومات التواصل وروابط القائمة وأزرار الدعوة لاتخاذ إجراء."
      dirty={dirty || navDirty}
      onSave={save}
      onDiscard={() => {
        discard();
        discardNav();
      }}
    >
      <Grid>
        <TextField label="اسم المعهد" value={site.name} onChange={set('name')} />
        <TextField label="العنوان الفرعي" value={site.subtitle} onChange={set('subtitle')} />
        <TextField label="رقم الهاتف" value={site.phone} onChange={set('phone')} dir="ltr" />
        <TextField label="البريد الإلكتروني" value={site.email} onChange={set('email')} dir="ltr" type="email" />
      </Grid>
      <ImageField label="الشعار" value={site.logo} onChange={set('logo')} maxW={400} />

      {/* ---------- Top bar buttons ---------- */}
      <h3 className="sub-title">أزرار الشريط العلوي</h3>
      <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '0.85rem' }}>
        الزران الموجودان أعلى الصفحة (زر لوحة التحكم وزر تبديل اللغة): أظهرهما أو أخفهما، وغيّر النص والرابط والأيقونة. اترك النص فارغًا لاستخدام النص الافتراضي للغة.
      </p>
      <div className="stack">
        <Row index={0} title="زر لوحة التحكم" onRemove={() => patchTop('dashboard', 'show', false)} removeLabel="إخفاء">
          <ToggleField label="إظهار الزر" checked={topbar.dashboard.show} onChange={(v) => patchTop('dashboard', 'show', v)} />
          <Grid>
            <TextField label="نص الزر" placeholder="الافتراضي: لوحة التحكم" value={topbar.dashboard.label} onChange={(v) => patchTop('dashboard', 'label', v)} />
            <TextField label="الرابط" dir="ltr" placeholder="/dashboard" value={topbar.dashboard.href} onChange={(v) => patchTop('dashboard', 'href', v)} />
          </Grid>
          <IconField label="الأيقونة (اختياري)" value={topbar.dashboard.icon} onChange={(v) => patchTop('dashboard', 'icon', v)} />
        </Row>
        <Row index={1} title="زر تبديل اللغة" onRemove={() => patchTop('lang', 'show', false)} removeLabel="إخفاء">
          <ToggleField label="إظهار الزر" checked={topbar.lang.show} onChange={(v) => patchTop('lang', 'show', v)} hint="عند إخفائه لن يستطيع الزائر تبديل لغة الموقع." />
          <TextField label="نص الزر" placeholder="الافتراضي: English / العربية" value={topbar.lang.label} onChange={(v) => patchTop('lang', 'label', v)} />
          <IconField label="الأيقونة (اختياري)" value={topbar.lang.icon} onChange={(v) => patchTop('lang', 'icon', v)} />
        </Row>
      </div>

      {/* ---------- Header CTA buttons ---------- */}
      <h3 className="sub-title">أزرار الهيدر الرئيسية</h3>
      <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '0.85rem' }}>
        تظهر هذه الأزرار في شريط الهيدر أعلى الصفحة، وفي القائمة الجانبية على الجوال.
      </p>
      <div className="stack">
        {actions.map((action, i) => (
          <Row
            key={action.id}
            index={i}
            title={action.label || `زر ${i + 1}`}
            onRemove={() => setActions(actions.filter((_, j) => j !== i))}
          >
            <Grid cols={3}>
              <TextField
                label="نص الزر"
                value={action.label}
                onChange={(v) => patchAction(i, 'label', v)}
              />
              <TextField
                label="الرابط"
                dir="ltr"
                value={action.href}
                onChange={(v) => patchAction(i, 'href', v)}
              />
              <SelectField
                label="التصميم"
                value={action.variant || 'ghost'}
                onChange={(v) => patchAction(i, 'variant', v)}
                options={[
                  { value: 'ghost', label: 'شفاف (فاتح)' },
                  { value: 'primary', label: 'رئيسي (أحمر)' },
                ]}
              />
            </Grid>
            <IconField
              label="الأيقونة (اختياري)"
              value={action.icon || ''}
              onChange={(v) => patchAction(i, 'icon', v)}
            />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setActions([
            ...actions,
            { id: `a-${Date.now()}`, label: 'زر جديد', href: '#', variant: 'ghost' },
          ])
        }
      >
        إضافة زر
      </AddButton>

      {/* ---------- existing nav editor ---------- */}
      <h3 className="sub-title">روابط القائمة</h3>
      <div className="stack">
        {nav.map((item, i) => (
          <div className="inline-row" key={item.id}>
            <TextField
              label="النص"
              value={item.label}
              onChange={(v) => setNav((l) => l.map((x, j) => (j === i ? { ...x, label: v } : x)))}
            />
            <TextField
              label="الرابط"
              dir="ltr"
              value={item.href}
              onChange={(v) => setNav((l) => l.map((x, j) => (j === i ? { ...x, href: v } : x)))}
            />
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              aria-label="حذف"
              onClick={() => setNav((l) => l.filter((_, j) => j !== i))}
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        ))}
      </div>
      <AddButton onClick={() => setNav((l) => [...l, { id: `n-${Date.now()}`, label: 'رابط جديد', href: '#home' }])}>
        إضافة رابط
      </AddButton>
    </Panel>
  );
}

/* =============== Hero =============== */
export function HeroEditor({ notify }) {
  const { content, updateSection, updateShared } = useContent();
  const [hero, setHero, dirty, discard] = useDraft(content.hero);
  const set = (k) => (v) => setHero((h) => ({ ...h, [k]: v }));
  const setBadge = (i, k, v) =>
    setHero((h) => ({ ...h, badges: h.badges.map((b, j) => (j === i ? { ...b, [k]: v } : b)) }));

  return (
    <Panel
      title="القسم الرئيسي (Hero)"
      hint="العنوان الكبير والوصف والصورة وأزرار الدعوة لاتخاذ إجراء."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('hero', hero);
        // the poster is the same picture in Arabic and English: apply it to both languages
        // (before, it only changed in the language being edited, so the other language kept the old poster)
        updateShared('hero', { image: hero.image });
        notify('تم حفظ القسم الرئيسي');
      }}
    >
      <Grid>
        <TextField label="العنوان" value={hero.title} onChange={set('title')} />
        <TextField label="العنوان المميز" value={hero.highlight} onChange={set('highlight')} />
      </Grid>
      <AreaField label="الوصف" value={hero.description} onChange={set('description')} />
      <TextField label="نص الزر" value={hero.cta} onChange={set('cta')} />
      <ImageField
        label="صورة الواجهة / البوستر (تُطبَّق على العربية والإنجليزية معًا — اتركها فارغة لاستخدام الرسم الافتراضي)"
        value={hero.image}
        onChange={set('image')}
        maxW={1920}
        jpeg
      />

      <h3 className="sub-title">الشارات الثلاث</h3>
      <div className="stack">
        {hero.badges.map((b, i) => (
          <Row
            key={b.id}
            index={i}
            title={b.text}
            onRemove={() => setHero((h) => ({ ...h, badges: h.badges.filter((_, j) => j !== i) }))}
          >
            <TextField label="النص" value={b.text} onChange={(v) => setBadge(i, 'text', v)} />
            <IconField value={b.icon} onChange={(v) => setBadge(i, 'icon', v)} />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setHero((h) => ({ ...h, badges: [...h.badges, { id: nextId(h.badges), icon: 'cap', text: 'شارة جديدة' }] }))
        }
      >
        إضافة شارة
      </AddButton>
    </Panel>
  );
}

/* =============== Features =============== */
export function FeaturesEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [list, setList, dirty, discard] = useDraft(content.features);
  const patch = (i, k, v) => setList((l) => l.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <Panel
      title="شريط المميزات"
      hint="الأيقونات أسفل القسم الرئيسي."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('features', list);
        notify('تم حفظ المميزات');
      }}
    >
      <div className="stack">
        {list.map((f, i) => (
          <Row key={f.id} index={i} title={f.title} onRemove={() => setList((l) => l.filter((_, j) => j !== i))}>
            <TextField label="العنوان" value={f.title} onChange={(v) => patch(i, 'title', v)} />
            <IconField value={f.icon} onChange={(v) => patch(i, 'icon', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setList((l) => [...l, { id: nextId(l), icon: 'cert', title: 'ميزة جديدة' }])}>
        إضافة ميزة
      </AddButton>
    </Panel>
  );
}

/* =============== Programs (home section) =============== */
export function CourseFiltersEditor({ notify, go }) {
  const { content, updateSection } = useContent();

  // The program TYPES live in courses.programs (shared by the home page tabs and the courses page filter).
  const source = {
    title: content.programs.title,
    description: content.programs.description,
    detailsLabel: content.programs.detailsLabel || '',
    allLabel: allTabLabel(content),
    types: content.courses.programs || [],
    items: content.programs.items || [],
  };
  const [p, setP, dirty, discard] = useDraft(source);
  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }));
  const typeOptions = p.types.map((t) => ({ value: String(t.id), label: t.label }));
  const courseCount = (id) => (content.courses.items || []).filter((c) => sameId(c.program, id)).length;

  const patchType = (i, v) => setP((x) => ({ ...x, types: x.types.map((t, j) => (j === i ? { ...t, label: v } : t)) }));
  const addType = () =>
    setP((x) => ({ ...x, types: [...x.types, { id: `p${Date.now().toString(36)}`, label: 'برنامج جديد' }] }));
  const removeType = (i) => {
    if (p.types.length <= 1) return notify('يجب أن يبقى برنامج واحد على الأقل', 'error');
    setP((x) => {
      const gone = x.types[i].id;
      const rest = x.types.filter((_, j) => j !== i);
      // featured programs of the deleted type move to the first remaining type
      return {
        ...x,
        types: rest,
        items: x.items.map((it) => (sameId(it.program, gone) ? { ...it, program: rest[0].id, category: rest[0].id } : it)),
      };
    });
  };

  const patchItem = (i, k, v) => setP((x) => ({ ...x, items: x.items.map((t, j) => (j === i ? { ...t, [k]: v } : t)) }));
  const addItem = () =>
    setP((x) => ({
      ...x,
      items: [
        ...x.items,
        {
          id: nextId(x.items),
          program: x.types[0]?.id ?? '',
          category: x.types[0]?.id ?? '',
          title: 'برنامج جديد',
          duration: '3 أشهر',
          hours: '120 ساعة تدريبية',
          image: '',
          href: '',
          topics: ['المحور الأول', 'المحور الثاني'],
        },
      ],
    }));

  const save = () => {
    const types = p.types.map((t) => ({ ...t, label: t.label.trim() || 'برنامج' }));
    const fallback = types[0]?.id ?? '';
    const valid = (id) => types.some((t) => sameId(t.id, id));
    const items = p.items.map((it) => ({
      ...it,
      program: valid(it.program) ? it.program : fallback,
      category: valid(it.program) ? it.program : fallback,
      topics: (it.topics || []).map((x) => String(x).trim()).filter(Boolean),
    }));
    // courses of a deleted program type move to the first remaining type, so none of them disappears
    const courseItems = (content.courses.items || []).map((c) => (valid(c.program) ? c : { ...c, program: fallback }));

    updateSection('programs', {
      title: p.title,
      description: p.description,
      detailsLabel: p.detailsLabel,
      items,
      tabs: buildTabs(types, p.allLabel),
    });
    updateSection('courses', { programs: types, items: courseItems });
    notify('تم حفظ البرامج');
  };

  return (
    <Panel
      title="تصنيفات صفحة الدورات"
      hint="أنواع البرامج المستخدمة كتبويبات وفلاتر في الصفحة المسطّحة /courses. هيكل البرامج ← الدبلومات ← المقررات (صفحة /programs) يُدار من قسم «البرامج والدبلومات والمقررات»."
      dirty={dirty}
      onDiscard={discard}
      onSave={save}
      extra={
        <a href="/#programs" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      <Grid>
        <TextField label="عنوان القسم" value={p.title} onChange={set('title')} />
        <TextField label="نص زر «عرض التفاصيل»" value={p.detailsLabel} onChange={set('detailsLabel')} />
      </Grid>
      <AreaField label="وصف القسم" value={p.description} onChange={set('description')} rows={3} />

      {/* ---------- program types ---------- */}
      <h3 className="sub-title">أنواع البرامج ({p.types.length})</h3>
      <p className="field__hint">
        كل برنامج هنا يظهر كتبويب في الصفحة الرئيسية وكفلتر في صفحة الدورات. يمكنك إضافة أي عدد من البرامج.
      </p>
      <div className="stack">
        {p.types.map((t, i) => (
          <Row key={t.id} index={i} title={t.label} onRemove={() => removeType(i)}>
            <Grid>
              <TextField label="اسم البرنامج" value={t.label} onChange={(v) => patchType(i, v)} />
              <p className="field__hint" style={{ alignSelf: 'end', margin: 0 }}>
                عدد الدورات داخله: <strong>{courseCount(t.id)}</strong>
              </p>
            </Grid>
          </Row>
        ))}
      </div>
      <AddButton onClick={addType}>إضافة برنامج</AddButton>
      <TextField label="نص تبويب «عرض الكل»" value={p.allLabel} onChange={set('allLabel')} />

      {/* ---------- featured program cards ---------- */}
      <h3 className="sub-title">بطاقات البرامج المميزة ({p.items.length})</h3>
      <div className="stack">
        {p.items.map((it, i) => (
          <Row
            key={it.id}
            index={i}
            title={it.title}
            onRemove={() => setP((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}
          >
            <Grid>
              <TextField label="عنوان البرنامج" value={it.title} onChange={(v) => patchItem(i, 'title', v)} />
              <SelectField
                label="يتبع برنامج"
                value={String(it.program ?? '')}
                onChange={(v) => {
                  patchItem(i, 'program', v);
                  patchItem(i, 'category', v);
                }}
                options={typeOptions}
              />
              <TextField label="المدة" value={it.duration} onChange={(v) => patchItem(i, 'duration', v)} />
              <TextField label="الساعات التدريبية" value={it.hours} onChange={(v) => patchItem(i, 'hours', v)} />
            </Grid>
            <AreaField
              label="المحاور (كل محور في سطر)"
              value={(it.topics || []).join('\n')}
              onChange={(v) => patchItem(i, 'topics', v.split('\n'))}
              rows={4}
            />
            <TextField label="رابط البطاقة (اختياري)" dir="ltr" value={it.href || ''} onChange={(v) => patchItem(i, 'href', v)} />
            <ImageField label="صورة البرنامج" value={it.image || ''} onChange={(v) => patchItem(i, 'image', v)} maxW={900} />
          </Row>
        ))}
      </div>
      <AddButton onClick={addItem}>إضافة بطاقة برنامج</AddButton>

      <p className="field__hint">
        المحتوى منفصل لكل لغة: بعد الإضافة بالعربية بدّل «لغة المحتوى» إلى English وأضف نفس العنصر هناك.
      </p>
      {go && (
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => go('courses')}>
          <Icon name="cap" size={16} /> إدارة الدورات
        </button>
      )}
    </Panel>
  );
}

/* =============== Programs → Diplomas → Courses (the /programs pages) =============== */
export function ProgramsEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [p, setP, dirty, discard] = useDraft({ title: content.programs.title || '', description: content.programs.description || '' });
  return (
    <>
      <Panel
        title="عنوان قسم البرامج في الصفحة الرئيسية"
        hint="النص الذي يظهر فوق بطاقات البرامج الرئيسية في الصفحة الرئيسية."
        dirty={dirty}
        onDiscard={discard}
        onSave={() => {
          updateSection('programs', { title: p.title, description: p.description });
          notify('تم حفظ عنوان القسم');
        }}
        extra={
          <a href="/#programs" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
            <Icon name="eye" size={16} /> معاينة
          </a>
        }
      >
        <TextField label="عنوان القسم" value={p.title} onChange={(v) => setP((x) => ({ ...x, title: v }))} />
        <AreaField label="وصف القسم" value={p.description} onChange={(v) => setP((x) => ({ ...x, description: v }))} rows={3} />
      </Panel>
      <CatalogEditor notify={notify} />
    </>
  );
}

/* =============== About =============== */
export function AboutEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [a, setA, dirty, discard] = useDraft(content.about);

  return (
    <Panel
      title="من نحن"
      hint="العنوان والفقرات التعريفية."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('about', { ...a, paragraphs: a.paragraphs.filter((p) => p.trim()) });
        notify('تم حفظ قسم من نحن');
      }}
    >
      <Grid>
        <TextField label="الوسم" value={a.label} onChange={(v) => setA((x) => ({ ...x, label: v }))} />
        <TextField label="العنوان" value={a.title} onChange={(v) => setA((x) => ({ ...x, title: v }))} />
      </Grid>
      <div className="stack">
        {a.paragraphs.map((p, i) => (
          <Row key={i} index={i} title={`فقرة ${i + 1}`} onRemove={() => setA((x) => ({ ...x, paragraphs: x.paragraphs.filter((_, j) => j !== i) }))}>
            <AreaField
              label="النص"
              rows={4}
              value={p}
              onChange={(v) => setA((x) => ({ ...x, paragraphs: x.paragraphs.map((t, j) => (j === i ? v : t)) }))}
            />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setA((x) => ({ ...x, paragraphs: [...x.paragraphs, ''] }))}>إضافة فقرة</AddButton>
    </Panel>
  );
}

/* =============== Stats =============== */
export function StatsEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [list, setList, dirty, discard] = useDraft(content.stats);
  const patch = (i, k, v) => setList((l) => l.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <Panel
      title="الإحصائيات"
      hint="الأرقام المتحركة أسفل الصفحة."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('stats', list.map((s) => ({ ...s, value: Number(s.value) || 0 })));
        notify('تم حفظ الإحصائيات');
      }}
    >
      <div className="stack">
        {list.map((s, i) => (
          <Row key={s.id} index={i} title={s.label} onRemove={() => setList((l) => l.filter((_, j) => j !== i))}>
            <Grid cols={3}>
              <TextField label="التسمية" value={s.label} onChange={(v) => patch(i, 'label', v)} />
              <TextField label="الرقم" type="number" min="0" dir="ltr" value={s.value} onChange={(v) => patch(i, 'value', v)} />
              <TextField label="لاحقة (مثل +)" dir="ltr" value={s.suffix} onChange={(v) => patch(i, 'suffix', v)} />
            </Grid>
            <IconField value={s.icon} onChange={(v) => patch(i, 'icon', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setList((l) => [...l, { id: nextId(l), icon: 'users', value: 100, suffix: '+', label: 'إحصائية جديدة' }])}>
        إضافة إحصائية
      </AddButton>
    </Panel>
  );
}

/* =============== Footer =============== */
/* Everything the public footer renders. Arabic and English are separate (switch «لغة المحتوى» above). */
const SOCIAL_ICONS = ['x', 'instagram', 'facebook', 'linkedin', 'youtube', 'send', 'message', 'globe', 'phone', 'mail'];

export function FooterEditor({ notify }) {
  const { content, updateSection, updateShared } = useContent();
  const { site, footer, contact } = content;

  // phone / email default to the site-wide values until the admin sets footer-specific ones
  const source = {
    brandName: footer.brandName ?? '',
    brandSubtitle: footer.brandSubtitle ?? '',
    logo: footer.logo ?? '',
    images: footer.images || [],
    description: footer.description ?? '',
    address: footer.address ?? '',
    phone: footer.phone ?? site.phone ?? '',
    email: footer.email ?? site.email ?? '',
    social: contact.social || [],
    columns: footer.columns || [],
    bottomLinks: footer.bottomLinks || [],
    text: footer.text ?? '',
    showYear: footer.showYear !== false,
  };
  const [f, setF, dirty, discard] = useDraft(source);
  const [bothLangs, setBothLangs] = useState(false);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const patchList = (key, i, patch) => setF((x) => ({ ...x, [key]: x[key].map((it, j) => (j === i ? { ...it, ...patch } : it)) }));
  const removeFrom = (key, i) => setF((x) => ({ ...x, [key]: x[key].filter((_, j) => j !== i) }));
  const move = (key, i, dir) => setF((x) => ({ ...x, [key]: moveItem(x[key], i, dir) }));
  const order = (key, list, i) => ({
    onMoveUp: i > 0 ? () => move(key, i, -1) : undefined,
    onMoveDown: i < list.length - 1 ? () => move(key, i, 1) : undefined,
  });

  // columns → links (nested)
  const patchCol = (i, patch) => patchList('columns', i, patch);
  const patchLink = (ci, li, patch) =>
    setF((x) => ({
      ...x,
      columns: x.columns.map((c, j) => (j === ci ? { ...c, links: c.links.map((l, k) => (k === li ? { ...l, ...patch } : l)) } : c)),
    }));
  const mutateLinks = (ci, fn) => setF((x) => ({ ...x, columns: x.columns.map((c, j) => (j === ci ? { ...c, links: fn(c.links || []) } : c)) }));

  const save = () => {
    const clean = (list) => list.filter((l) => String(l.label || '').trim() || String(l.href || '').trim());
    updateSection('footer', {
      brandName: f.brandName,
      brandSubtitle: f.brandSubtitle,
      logo: f.logo,
      images: f.images.filter((im) => im.src),
      description: f.description,
      address: f.address,
      phone: f.phone,
      email: f.email,
      columns: f.columns.map((c) => ({ ...c, links: clean(c.links || []) })),
      bottomLinks: clean(f.bottomLinks),
      text: f.text,
      showYear: f.showYear,
    });
    // the social icons are the same list the «تواصل معنا» section uses
    updateSection('contact', { social: f.social });
    // optional: logo + footer images are pictures, not text, so they can be applied to both languages at once
    if (bothLangs) updateShared('footer', { logo: f.logo, images: f.images.filter((im) => im.src) });
    notify('تم حفظ التذييل');
  };

  return (
    <Panel
      title="التذييل"
      hint="كل ما يظهر في أسفل الموقع. المحتوى منفصل لكل لغة: بدّل «لغة المحتوى» من أعلى الصفحة لتعديل النسخة العربية أو الإنجليزية، وتظهر التغييرات في الموقع بعد الحفظ مباشرة."
      dirty={dirty}
      onDiscard={discard}
      onSave={save}
      extra={
        <a href="/#footer" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      {/* ---------- brand ---------- */}
      <h3 className="sub-title">الشعار والتعريف</h3>
      <Grid>
        <TextField label="اسم الجهة (فارغ = اسم الموقع)" value={f.brandName} onChange={set('brandName')} placeholder={site.name} />
        <TextField label="العنوان الفرعي" value={f.brandSubtitle} onChange={set('brandSubtitle')} placeholder={site.subtitle} />
      </Grid>
      <ImageField label="شعار التذييل (فارغ = شعار الموقع)" value={f.logo} onChange={set('logo')} maxW={400} />
      <AreaField label="نبذة التذييل" value={f.description} onChange={set('description')} rows={4} />

      <h3 className="sub-title">صور التذييل ({f.images.length})</h3>
      <p className="field__hint">شعارات الاعتماد أو أي صور تظهر تحت النبذة. الصورة اختيارية، ويمكن ربطها برابط.</p>
      <div className="stack">
        {f.images.map((im, i) => (
          <Row key={im.id} index={i} title={im.alt || 'صورة'} onRemove={() => removeFrom('images', i)} {...order('images', f.images, i)}>
            <ImageField label="الصورة" value={im.src || ''} onChange={(v) => patchList('images', i, { src: v })} maxW={500} />
            <Grid>
              <TextField label="النص البديل / الوصف" value={im.alt || ''} onChange={(v) => patchList('images', i, { alt: v })} />
              <TextField label="رابط (اختياري)" dir="ltr" value={im.href || ''} onChange={(v) => patchList('images', i, { href: v })} />
            </Grid>
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setF((x) => ({ ...x, images: [...x.images, { id: `fi-${Date.now().toString(36)}`, src: '', alt: '', href: '' }] }))}>
        إضافة صورة
      </AddButton>
      <ToggleField
        label="تطبيق الشعار وصور التذييل على العربية والإنجليزية معًا"
        hint="عند التفعيل تُنسخ الصور (وليس النصوص) إلى اللغة الأخرى عند الحفظ."
        checked={bothLangs}
        onChange={setBothLangs}
      />

      {/* ---------- contact ---------- */}
      <h3 className="sub-title">معلومات التواصل</h3>
      <Grid>
        <TextField label="رقم الهاتف (اتركه فارغًا لإخفائه)" dir="ltr" value={f.phone} onChange={set('phone')} />
        <TextField label="البريد الإلكتروني (اتركه فارغًا لإخفائه)" dir="ltr" value={f.email} onChange={set('email')} />
      </Grid>
      <TextField label="العنوان" value={f.address} onChange={set('address')} />

      {/* ---------- social ---------- */}
      <h3 className="sub-title">روابط التواصل الاجتماعي ({f.social.length})</h3>
      <p className="field__hint">نفس الروابط تظهر في قسم «تواصل معنا». الرابط الفارغ لا يظهر في الموقع.</p>
      <div className="stack">
        {f.social.map((s, i) => (
          <Row key={s.id} index={i} title={s.name || 'رابط'} onRemove={() => removeFrom('social', i)} {...order('social', f.social, i)}>
            <Grid>
              <TextField label="الاسم" value={s.name || ''} onChange={(v) => patchList('social', i, { name: v })} />
              <TextField label="الرابط" dir="ltr" value={s.href || ''} onChange={(v) => patchList('social', i, { href: v })} />
            </Grid>
            <div className="field">
              <span className="field__label">الأيقونة</span>
              <div className="icon-picker">
                {SOCIAL_ICONS.map((n) => (
                  <button key={n} type="button" title={n} className={`icon-picker__btn ${s.icon === n ? 'is-active' : ''}`} onClick={() => patchList('social', i, { icon: n })}>
                    <Icon name={n} size={20} />
                  </button>
                ))}
              </div>
            </div>
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setF((x) => ({ ...x, social: [...x.social, { id: `s-${Date.now().toString(36)}`, name: 'منصة جديدة', icon: 'globe', href: '' }] }))}>
        إضافة رابط
      </AddButton>

      {/* ---------- navigation columns ---------- */}
      <h3 className="sub-title">أعمدة روابط التنقل ({f.columns.length})</h3>
      <div className="stack">
        {f.columns.map((col, ci) => (
          <Row key={col.id} index={ci} title={col.title} onRemove={() => removeFrom('columns', ci)} {...order('columns', f.columns, ci)}>
            <TextField label="عنوان العمود" value={col.title || ''} onChange={(v) => patchCol(ci, { title: v })} />
            <div className="stack stack--tight">
              {(col.links || []).map((l, li) => (
                <div className="link-row" key={l.id}>
                  <TextField label="النص" value={l.label || ''} onChange={(v) => patchLink(ci, li, { label: v })} />
                  <TextField label="الرابط (فارغ = نص عادي)" dir="ltr" value={l.href || ''} onChange={(v) => patchLink(ci, li, { href: v })} />
                  <span className="link-row__btns">
                    <button type="button" className="icon-btn" disabled={li === 0} onClick={() => mutateLinks(ci, (a) => moveItem(a, li, -1))} aria-label="للأعلى">
                      <Icon name="chevronDown" size={18} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <button type="button" className="icon-btn" disabled={li === (col.links || []).length - 1} onClick={() => mutateLinks(ci, (a) => moveItem(a, li, 1))} aria-label="للأسفل">
                      <Icon name="chevronDown" size={18} />
                    </button>
                    <button type="button" className="icon-btn icon-btn--danger" onClick={() => mutateLinks(ci, (a) => a.filter((_, k) => k !== li))} aria-label="حذف">
                      <Icon name="trash" size={18} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <AddButton onClick={() => mutateLinks(ci, (a) => [...a, { id: nextId(a), label: 'رابط جديد', href: '' }])}>إضافة رابط للعمود</AddButton>
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setF((x) => ({ ...x, columns: [...x.columns, { id: nextId(x.columns), title: 'عمود جديد', links: [] }] }))}>
        إضافة عمود
      </AddButton>

      {/* ---------- bottom bar ---------- */}
      <h3 className="sub-title">الشريط السفلي</h3>
      <TextField label="نص حقوق النشر" value={f.text} onChange={set('text')} />
      <ToggleField label="إظهار السنة الحالية بعد علامة ©" checked={f.showYear} onChange={set('showYear')} />
      <h3 className="sub-title">روابط الشريط السفلي ({f.bottomLinks.length})</h3>
      <div className="stack stack--tight">
        {f.bottomLinks.map((l, i) => (
          <div className="link-row" key={l.id}>
            <TextField label="النص" value={l.label || ''} onChange={(v) => patchList('bottomLinks', i, { label: v })} />
            <TextField label="الرابط (فارغ = نص عادي)" dir="ltr" value={l.href || ''} onChange={(v) => patchList('bottomLinks', i, { href: v })} />
            <span className="link-row__btns">
              <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move('bottomLinks', i, -1)} aria-label="للأعلى">
                <Icon name="chevronDown" size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button type="button" className="icon-btn" disabled={i === f.bottomLinks.length - 1} onClick={() => move('bottomLinks', i, 1)} aria-label="للأسفل">
                <Icon name="chevronDown" size={18} />
              </button>
              <button type="button" className="icon-btn icon-btn--danger" onClick={() => removeFrom('bottomLinks', i)} aria-label="حذف">
                <Icon name="trash" size={18} />
              </button>
            </span>
          </div>
        ))}
      </div>
      <AddButton onClick={() => setF((x) => ({ ...x, bottomLinks: [...x.bottomLinks, { id: nextId(x.bottomLinks), label: 'رابط جديد', href: '' }] }))}>
        إضافة رابط
      </AddButton>
    </Panel>
  );
}

/* =============== Account + backup =============== */
export function SettingsEditor({ notify }) {
  const { credentials, updateCredentials } = useAuth();
  const { content, replaceAll, reset, lang, allContents } = useContent();
  const { theme } = useTheme();
  const [form, setForm] = useState({ username: credentials.username, current: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const saveCreds = () => {
    setError('');
    if (form.current !== credentials.password) return setError('كلمة المرور الحالية غير صحيحة');
    if (!form.username.trim()) return setError('اسم المستخدم مطلوب');
    if (form.password && form.password.length < 6) return setError('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف');
    if (form.password && form.password !== form.confirm) return setError('تأكيد كلمة المرور غير مطابق');
    updateCredentials({ username: form.username.trim(), ...(form.password ? { password: form.password } : {}) });
    setForm((f) => ({ ...f, current: '', password: '', confirm: '' }));
    notify('تم تحديث بيانات الدخول');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `almosanadah-content-${lang}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      replaceAll(JSON.parse(await file.text()));
      notify('تم استيراد المحتوى');
    } catch {
      notify('ملف غير صالح', 'error');
    }
    e.target.value = '';
  };

  return (
    <>
      <Panel title="بيانات الدخول" hint="غيّر اسم المستخدم وكلمة المرور الخاصة بلوحة التحكم.">
        <Grid>
          <TextField label="اسم المستخدم" dir="ltr" value={form.username} onChange={(v) => setForm((f) => ({ ...f, username: v }))} />
          <TextField label="كلمة المرور الحالية" type="password" dir="ltr" value={form.current} onChange={(v) => setForm((f) => ({ ...f, current: v }))} />
          <TextField label="كلمة المرور الجديدة (اختياري)" type="password" dir="ltr" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} />
          <TextField label="تأكيد كلمة المرور" type="password" dir="ltr" value={form.confirm} onChange={(v) => setForm((f) => ({ ...f, confirm: v }))} />
        </Grid>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" className="btn btn--primary" onClick={saveCreds}>
          <Icon name="lock" size={18} /> تحديث بيانات الدخول
        </button>
      </Panel>

      <Panel title="نشر المحتوى للجميع" hint="كل حفظ تقوم به يُنشر تلقائيًا للزوار في أي متصفح. استخدم هذا الزر لنشر كل المحتوى الحالي (العربي والإنجليزي والألوان) دفعة واحدة، مثلًا لنقل تعديلات قديمة محفوظة في هذا المتصفح إلى الخادم.">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            saveSite({ ar: allContents.ar, en: allContents.en, theme });
            notify('تم إرسال المحتوى إلى الخادم');
          }}
        >
          <Icon name="upload" size={18} /> نشر المحتوى الحالي كافتراضي للجميع
        </button>
      </Panel>

      <Panel title="النسخ الاحتياطي" hint={`صدّر المحتوى (${lang === 'en' ? 'English' : 'العربية'}) كملف JSON أو استورد نسخة سابقة، أو استرجع الوضع الافتراضي.`}>
        <div className="btn-row">
          <button type="button" className="btn btn--ghost" onClick={exportJson}>
            <Icon name="download" size={18} /> تصدير المحتوى
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} /> استيراد المحتوى
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
          <button
            type="button"
            className="btn btn--ghost danger"
            onClick={() => {
              if (window.confirm('سيتم استرجاع المحتوى الافتراضي للغة المحددة حاليًا فقط. هل أنت متأكد؟')) {
                reset();
                notify('تمت إعادة المحتوى الافتراضي');
              }
            }}
          >
            <Icon name="reset" size={18} /> استرجاع الافتراضي
          </button>
        </div>
      </Panel>
    </>
  );
}

/* =============== Theme colours =============== */
const THEME_FIELDS = [
  { k: 'primary', label: 'اللون الأساسي', hint: 'الأزرار والروابط النشطة والشرائط (الأحمر حاليًا).' },
  { k: 'secondary', label: 'اللون الثانوي', hint: 'الشريط العلوي والعناوين (الأزرق حاليًا).' },
  { k: 'dark', label: 'اللون الداكن', hint: 'الخلفيات الداكنة والتدرجات.' },
  { k: 'text', label: 'لون النص', hint: 'النصوص العامة في الموقع.' },
  { k: 'background', label: 'خلفية الصفحة', hint: 'لون خلفية الموقع.' },
  { k: 'card', label: 'خلفية البطاقات', hint: 'البطاقات والأقسام البيضاء.' },
];

export function ThemeEditor({ notify }) {
  const { theme, saveTheme, resetTheme } = useTheme();
  const [draft, setDraft] = useState(theme);
  const dirty = JSON.stringify(draft) !== JSON.stringify(theme);
  const allValid = Object.values(draft).every(isHex);

  // live preview: the whole site (and this dashboard) follows the draft while editing
  useEffect(() => {
    if (allValid) applyTheme(draft);
  }, [draft, allValid]);
  useEffect(() => () => applyTheme(theme), [theme]);

  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }));
  const cleaned = sanitizeTheme(draft);
  const lowContrast = allValid && contrast(cleaned.primary, '#ffffff') < 3;

  return (
    <Panel
      title="ألوان الموقع"
      hint="غيّر ألوان الموقع بالكامل. تُطبَّق المعاينة مباشرة أثناء التعديل، ولا تُحفظ إلا عند الضغط على «حفظ التغييرات»."
      dirty={dirty}
      onDiscard={() => setDraft(theme)}
      onSave={() => {
        if (!allValid) return notify('أحد الألوان غير صالح (مثال: #AB1A37)', 'error');
        saveTheme(draft);
        notify('تم حفظ ألوان الموقع');
      }}
    >
      <h3 className="sub-title">ثيمات جاهزة</h3>
      <div className="preset-row">
        {THEME_PRESETS.map((p) => (
          <button key={p.id} type="button" className="preset" onClick={() => setDraft({ ...p.theme })}>
            <span className="preset__sw">
              <i style={{ background: p.theme.primary }} />
              <i style={{ background: p.theme.secondary }} />
              <i style={{ background: p.theme.dark }} />
            </span>
            {p.label}
          </button>
        ))}
      </div>

      <h3 className="sub-title">الألوان</h3>
      <Grid>
        {THEME_FIELDS.map((f) => (
          <ColorField key={f.k} label={f.label} hint={f.hint} value={draft[f.k]} onChange={set(f.k)} />
        ))}
      </Grid>

      {lowContrast && (
        <p className="form-error" role="alert">
          تنبيه: اللون الأساسي فاتح، وقد يصعب قراءة النص الأبيض فوق الأزرار. يُفضّل لونًا أغمق.
        </p>
      )}

      <h3 className="sub-title">معاينة</h3>
      <div className="theme-preview">
        <div className="theme-preview__bar" style={{ background: cleaned.secondary }}>
          <span>الشريط العلوي</span>
          <b style={{ background: cleaned.primary }}>زر رئيسي</b>
        </div>
        <div className="theme-preview__body" style={{ background: cleaned.background, color: cleaned.text }}>
          <div className="theme-preview__card" style={{ background: cleaned.card }}>
            <strong style={{ color: cleaned.secondary }}>عنوان بطاقة</strong>
            <p>هذا نص تجريبي لمعاينة الألوان على خلفية البطاقة.</p>
            <span style={{ background: cleaned.primary }}>اقرأ المزيد</span>
          </div>
          <div className="theme-preview__dark" style={{ background: cleaned.dark }}>قسم داكن</div>
        </div>
      </div>

      <button
        type="button"
        className="btn btn--ghost danger"
        onClick={() => {
          setDraft(DEFAULT_THEME);
          resetTheme();
          notify('تمت إعادة الألوان الافتراضية');
        }}
      >
        <Icon name="reset" size={18} /> استرجاع الألوان الافتراضية
      </button>
    </Panel>
  );
}

/* =============== Courses page =============== */
export function CoursesEditor({ notify, go }) {
  const { content, lang, allContents, updateSection, updateLang } = useContent();
  const branchList = content.branches?.items || [];
  const regionList = content.branches?.regions || [];
  const [c, setC, dirty, discard] = useDraft(content.courses);
  const [filter, setFilter] = useState('all'); // dashboard-only: narrow the long course list by program
  const set = (k) => (v) => setC((x) => ({ ...x, [k]: v }));
  const patchCat = (i, k, v) => setC((x) => ({ ...x, categories: x.categories.map((t, j) => (j === i ? { ...t, [k]: v } : t)) }));
  const patchItem = (i, k, v) => setC((x) => ({ ...x, items: x.items.map((t, j) => (j === i ? { ...t, [k]: v } : t)) }));
  const catOptions = c.categories.map((t) => ({ value: String(t.id), label: t.label }));
  const programs = c.programs || [];
  const programOptions = programs.map((t) => ({ value: String(t.id), label: t.label }));
  const countOf = (id) => c.items.filter((it) => id === 'all' || sameId(it.program, id)).length;

  const removeCat = (i) =>
    setC((x) => {
      const gone = x.categories[i].id;
      const rest = x.categories.filter((_, j) => j !== i);
      const fallback = rest[0]?.id ?? '';
      return { ...x, categories: rest, items: x.items.map((it) => (sameId(it.category, gone) ? { ...it, category: fallback } : it)) };
    });

  const addCourse = () =>
    setC((x) => ({
      ...x,
      items: [
        ...x.items,
        {
          id: nextId(x.items),
          category: x.categories[0]?.id ?? 1,
          // a new course starts in the program that is currently selected in the filter
          program: filter !== 'all' ? filter : x.programs?.[0]?.id ?? '',
          icon: 'book',
          title: 'دورة جديدة',
          href: '',
          image: '',
          desc: '',
          duration: '',
          hours: 0,
          highlights: [],
          requirements: [],
          branchMode: 'all',
          branchIds: [],
        },
      ],
    }));

  return (
    <Panel
      title="صفحة الدورات"
      hint="نصوص الصفحة، الفئات التدريبية، والدورات المعروضة (صفحة /courses). كل دورة تتبع برنامجًا وفئة."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        const items = c.items.map((it) => ({
          ...it,
          hours: Number(it.hours) || 0,
          highlights: (it.highlights || []).map((x) => String(x).trim()).filter(Boolean),
          requirements: (it.requirements || []).map((x) => String(x).trim()).filter(Boolean),
        }));
        updateSection('courses', { ...c, items });
        // the branches a course is offered at are the same in both languages → keep the other copy in sync
        const other = lang === 'ar' ? 'en' : 'ar';
        updateLang(other, 'courses', { items: syncAvailability(items, allContents[other].courses?.items || []) });
        notify('تم حفظ صفحة الدورات');
      }}
      extra={
        <a href="/courses" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      <Grid>
        <TextField label="عنوان الصفحة" value={c.title} onChange={set('title')} />
        <TextField label="العنوان الفرعي" value={c.subtitle} onChange={set('subtitle')} />
        <TextField label="نص خانة البحث" value={c.searchPlaceholder} onChange={set('searchPlaceholder')} />
        <TextField label="نص زر البحث" value={c.searchButton} onChange={set('searchButton')} />
        <TextField label="عنوان الفئات" value={c.categoriesTitle} onChange={set('categoriesTitle')} />
        <TextField label="نص «كل الدورات»" value={c.allLabel} onChange={set('allLabel')} />
        <TextField label="نص «كل البرامج»" value={c.allProgramsLabel} onChange={set('allProgramsLabel')} />
      </Grid>
      <TextField label="رسالة عدم وجود نتائج" value={c.empty} onChange={set('empty')} />
      <ImageField label="صورة البانر (اختياري)" value={c.banner} onChange={set('banner')} maxW={1600} />

      <h3 className="sub-title">الفئات التدريبية ({c.categories.length})</h3>
      <div className="stack">
        {c.categories.map((cat, i) => (
          <Row key={cat.id} index={i} title={cat.label} onRemove={() => removeCat(i)}>
            <TextField label="اسم الفئة" value={cat.label} onChange={(v) => patchCat(i, 'label', v)} />
            <IconField value={cat.icon} onChange={(v) => patchCat(i, 'icon', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setC((x) => ({ ...x, categories: [...x.categories, { id: nextId(x.categories), label: 'فئة جديدة', icon: 'book' }] }))}>
        إضافة فئة
      </AddButton>

      <h3 className="sub-title">الدورات ({c.items.length})</h3>
      <div className="filter-bar" role="group" aria-label="تصفية الدورات حسب البرنامج">
        <button type="button" className={`filter-chip ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
          كل البرامج ({countOf('all')})
        </button>
        {programs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`filter-chip ${sameId(filter, t.id) ? 'is-active' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label} ({countOf(t.id)})
          </button>
        ))}
      </div>
      {go && (
        <p className="field__hint">
          لإضافة تصنيف جديد أو تعديل أسماء التصنيفات استخدم قسم{' '}
          <button type="button" className="link-btn" onClick={() => go('filters')}>
            «تصنيفات صفحة الدورات»
          </button>
          .
        </p>
      )}

      <div className="stack">
        {c.items.map((it, i) =>
          filter === 'all' || sameId(it.program, filter) ? (
            <Row key={it.id} index={i} title={it.title} onRemove={() => setC((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
              <Grid cols={3}>
                <TextField label="اسم الدورة" value={it.title} onChange={(v) => patchItem(i, 'title', v)} />
                <SelectField label="البرنامج" value={String(it.program ?? '')} onChange={(v) => patchItem(i, 'program', v)} options={programOptions} />
                <SelectField label="الفئة" value={String(it.category)} onChange={(v) => patchItem(i, 'category', Number(v) || v)} options={catOptions} />
              </Grid>
              <TextField label="رابط الدورة (اختياري)" dir="ltr" value={it.href} onChange={(v) => patchItem(i, 'href', v)} />
              <IconField label="الأيقونة" value={it.icon} onChange={(v) => patchItem(i, 'icon', v)} />
              <ImageField label="صورة بدل الأيقونة (اختياري)" value={it.image || ''} onChange={(v) => patchItem(i, 'image', v)} maxW={600} />
              <AreaField label="وصف الدورة (يظهر في البطاقة وفي نافذة التفاصيل)" value={it.desc || ''} onChange={(v) => patchItem(i, 'desc', v)} rows={3} />
              <Grid cols={2}>
                <TextField label="المدة (مثال: 6 أشهر)" value={it.duration || ''} onChange={(v) => patchItem(i, 'duration', v)} />
                <TextField label="عدد الساعات التدريبية" type="number" dir="ltr" min="0" value={it.hours ?? ''} onChange={(v) => patchItem(i, 'hours', v)} />
              </Grid>
              <Grid cols={2}>
                <LinesField label="أبرز ما سيتعلمه الطالب (سطر لكل نقطة)" value={it.highlights} onChange={(v) => patchItem(i, 'highlights', v)} rows={4} />
                <LinesField label="المتطلبات (سطر لكل نقطة)" value={it.requirements} onChange={(v) => patchItem(i, 'requirements', v)} rows={4} />
              </Grid>
              <BranchPicker
                value={it}
                branches={branchList}
                regions={regionList}
                onChange={(patch) => setC((x) => ({ ...x, items: x.items.map((t, j) => (j === i ? { ...t, ...patch } : t)) }))}
              />
            </Row>
          ) : null
        )}
      </div>
      <AddButton onClick={addCourse}>إضافة دورة</AddButton>
    </Panel>
  );
}

/* =============== Slider / details / branches interface texts =============== */
const LABEL_NAMES = {
  tabsLabel: 'وصف شريط التبويبات (قارئ الشاشة)', sliderLabel: 'وصف المنزلق (قارئ الشاشة)', prev: 'زر السابق', next: 'زر التالي',
  showDetails: 'زر «عرض التفاصيل»', details: 'عنوان نافذة التفاصيل', close: 'زر الإغلاق', items: 'كلمة «برنامج»', courses: 'كلمة «مقرر»',
  emptyTab: 'رسالة التبويب الفارغ', duration: 'كلمة «المدة»', hours: 'كلمة «ساعة تدريبية»', category: 'كلمة «الفئة»', program: 'كلمة «نوع البرنامج»',
  overview: 'عنوان «نبذة»', highlights: 'عنوان «أبرز ما ستتعلمه»', objectives: 'عنوان «الأهداف»', outcomes: 'عنوان «مخرجات التعلم»',
  skills: 'عنوان «المهارات»', practical: 'عنوان «التدريب العملي»', requirements: 'عنوان «المتطلبات»', includedCourses: 'عنوان «المقررات المتضمنة»',
  fullPlan: 'نص «الخطة الدراسية الكاملة»', branches: 'عنوان «الفروع المتاحة»', branchesHint: 'وصف فلتر المناطق', allBranches: 'نص «متاح في جميع الفروع»',
  branchWord: 'كلمة «فرع»', noBranches: 'رسالة عدم تحديد فروع', allRegions: 'نص «كل المناطق»', call: 'نص «اتصال»', openMap: 'نص «الموقع على الخريطة»',
  register: 'زر «سجّل الآن»', contact: 'نص «استفسر عن البرنامج»', openPage: 'زر «صفحة البرنامج»',
};

export function UiLabelsEditor({ notify }) {
  const { content, lang, updateSection } = useContent();
  const defaults = SLIDER_LABELS[lang === 'en' ? 'en' : 'ar'];
  const catUi = getCatalog(lang).ui;
  const [d, setD, dirty, discard] = useDraft({
    labels: { ...defaults, ...(content.courses?.labels || {}) },
    ui: { ...catUi, ...(content.catalog?.ui || {}) },
  });
  const setLabel = (k) => (v) => setD((x) => ({ ...x, labels: { ...x.labels, [k]: v } }));
  const setUi = (k) => (v) => setD((x) => ({ ...x, ui: { ...x.ui, [k]: v } }));
  const resetAll = () => {
    if (window.confirm('استرجاع كل النصوص إلى الافتراضي؟')) setD({ labels: { ...defaults }, ui: { ...catUi } });
  };

  return (
    <Panel
      title="نصوص واجهة البرامج والتفاصيل"
      hint="كل الكلمات الثابتة في التبويبات والمنزلق ونافذة التفاصيل وقائمة الفروع وصفحات البرامج. تُحفظ لكل لغة على حدة (غيّر «لغة المحتوى» لتعديل الإنجليزية)."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('courses', { labels: d.labels });
        updateSection('catalog', { ui: d.ui });
        notify('تم حفظ نصوص الواجهة');
      }}
      extra={
        <button type="button" className="btn btn--ghost btn--sm" onClick={resetAll}>
          استرجاع الافتراضي
        </button>
      }
    >
      <h3 className="sub-title">التبويبات ونافذة التفاصيل والفروع</h3>
      <Grid cols={2}>
        {Object.keys(defaults).map((k) => (
          <TextField key={k} label={LABEL_NAMES[k] || k} value={d.labels[k] ?? ''} onChange={setLabel(k)} />
        ))}
      </Grid>
      <h3 className="sub-title">صفحات البرامج (/programs)</h3>
      <Grid cols={2}>
        {Object.entries(catUi)
          .filter(([, v]) => typeof v === 'string')
          .map(([k]) => (
            <TextField key={k} label={k} value={d.ui[k] ?? ''} onChange={setUi(k)} />
          ))}
      </Grid>
    </Panel>
  );
}

/* =============== Contact section texts =============== */
const CONTACT_FIELDS = [
  ['title', 'عنوان القسم'], ['subtitle', 'العنوان الفرعي'], ['formTitle', 'عنوان النموذج'], ['formHint', 'نص توضيحي للنموذج'],
  ['name', 'حقل الاسم'], ['email', 'حقل البريد'], ['subject', 'حقل الموضوع'], ['message', 'حقل الرسالة'], ['send', 'زر الإرسال'],
  ['success', 'رسالة النجاح'], ['error', 'رسالة الخطأ'], ['phoneLabel', 'عنوان رقم التواصل'], ['emailLabel', 'عنوان البريد'],
  ['regionsLabel', 'عنوان الفروع'], ['regionsValue', 'نص الفروع'],
];
export function ContactEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [c, setC, dirty, discard] = useDraft(content.contact);
  return (
    <Panel
      title="قسم تواصل معنا"
      hint="نصوص قسم التواصل في الصفحة الرئيسية. روابط التواصل الاجتماعي تُعدَّل من قسم «التذييل»."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('contact', c);
        notify('تم حفظ قسم التواصل');
      }}
    >
      <Grid cols={2}>
        {CONTACT_FIELDS.map(([k, label]) =>
          ['formHint', 'success', 'error', 'subtitle'].includes(k) ? null : (
            <TextField key={k} label={label} value={c[k] ?? ''} onChange={(v) => setC((x) => ({ ...x, [k]: v }))} />
          )
        )}
      </Grid>
      {['subtitle', 'formHint', 'success', 'error'].map((k) => (
        <AreaField key={k} label={CONTACT_FIELDS.find((f) => f[0] === k)[1]} value={c[k] ?? ''} onChange={(v) => setC((x) => ({ ...x, [k]: v }))} rows={2} />
      ))}
    </Panel>
  );
}

/* =============== Branches page =============== */
export function BranchesEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [b, setB, dirty, discard] = useDraft(content.branches);
  const set = (k) => (v) => setB((x) => ({ ...x, [k]: v }));
  const patchRegion = (i, v) => setB((x) => ({ ...x, regions: x.regions.map((r, j) => (j === i ? { ...r, label: v } : r)) }));
  const patchItem = (i, k, v) => setB((x) => ({ ...x, items: x.items.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));
  const regionOptions = b.regions.map((r) => ({ value: r.id, label: r.label }));

  const removeRegion = (i) =>
    setB((x) => {
      const gone = x.regions[i].id;
      const rest = x.regions.filter((_, j) => j !== i);
      const fallback = rest[0]?.id ?? '';
      return { ...x, regions: rest, items: x.items.map((it) => (it.region === gone ? { ...it, region: fallback } : it)) };
    });

  return (
    <Panel
      title="صفحة الفروع"
      hint="نصوص الصفحة، المناطق، والفروع مع مواقعها على الخريطة (صفحة /branches)."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('branches', {
          ...b,
          perPage: Math.max(1, Number(b.perPage) || 6),
          items: b.items.map((it) => ({ ...it, lat: Number(it.lat) || 0, lng: Number(it.lng) || 0 })),
        });
        notify('تم حفظ صفحة الفروع');
      }}
      extra={
        <a href="/branches" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      <Grid>
        <TextField label="عنوان الصفحة" value={b.title} onChange={set('title')} />
        <TextField label="نص «جميع الفروع»" value={b.allLabel} onChange={set('allLabel')} />
        <TextField label="نص زر الموقع" value={b.locationLabel} onChange={set('locationLabel')} />
        <TextField label="نص زر الفيديو" value={b.videoLabel} onChange={set('videoLabel')} />
        <TextField label="عدد الفروع في الصفحة الواحدة" type="number" min="1" dir="ltr" value={b.perPage} onChange={set('perPage')} />
      </Grid>
      <AreaField label="وصف الصفحة" rows={3} value={b.description} onChange={set('description')} />
      <ImageField label="صورة البانر (اختياري)" value={b.banner} onChange={set('banner')} maxW={1600} />

      <h3 className="sub-title">المناطق ({b.regions.length})</h3>
      <div className="stack">
        {b.regions.map((r, i) => (
          <div className="inline-row" key={r.id}>
            <TextField label="اسم المنطقة" value={r.label} onChange={(v) => patchRegion(i, v)} />
            <button type="button" className="icon-btn icon-btn--danger" aria-label="حذف" onClick={() => removeRegion(i)}>
              <Icon name="trash" size={18} />
            </button>
          </div>
        ))}
      </div>
      <AddButton onClick={() => setB((x) => ({ ...x, regions: [...x.regions, { id: `r-${Date.now()}`, label: 'منطقة جديدة' }] }))}>إضافة منطقة</AddButton>

      <h3 className="sub-title">الفروع ({b.items.length})</h3>
      <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '0.85rem' }}>
        موقع الدبوس على الخريطة يُحدَّد بخط العرض والطول، انسخهما من خرائط جوجل (انقر بزر الفأرة الأيمن على الموقع).
      </p>
      <div className="stack">
        {b.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.name} onRemove={() => setB((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <Grid>
              <TextField label="اسم الفرع" value={it.name} onChange={(v) => patchItem(i, 'name', v)} />
              <SelectField label="المنطقة" value={it.region} onChange={(v) => patchItem(i, 'region', v)} options={regionOptions} />
              <TextField label="العنوان" value={it.address} onChange={(v) => patchItem(i, 'address', v)} />
              <TextField label="الهاتف" dir="ltr" value={it.phone} onChange={(v) => patchItem(i, 'phone', v)} />
              <TextField label="ساعات العمل" value={it.hours} onChange={(v) => patchItem(i, 'hours', v)} />
              <TextField label="رابط الموقع (خرائط جوجل)" dir="ltr" value={it.mapUrl} onChange={(v) => patchItem(i, 'mapUrl', v)} />
              <TextField label="رابط الفيديو التعريفي" dir="ltr" value={it.videoUrl} onChange={(v) => patchItem(i, 'videoUrl', v)} />
              <span />
              <TextField label="خط العرض (Latitude)" type="number" step="any" dir="ltr" value={it.lat} onChange={(v) => patchItem(i, 'lat', v)} />
              <TextField label="خط الطول (Longitude)" type="number" step="any" dir="ltr" value={it.lng} onChange={(v) => patchItem(i, 'lng', v)} />
            </Grid>
            <ImageField label="شعار الفرع (اختياري)" value={it.logo || ''} onChange={(v) => patchItem(i, 'logo', v)} maxW={300} />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setB((x) => ({
            ...x,
            items: [
              ...x.items,
              { id: nextId(x.items), region: x.regions[0]?.id ?? '', name: 'فرع جديد', address: '', phone: '', hours: '', mapUrl: '', videoUrl: '', logo: '', lat: 24.71, lng: 46.68 },
            ],
          }))
        }
      >
        إضافة فرع
      </AddButton>
    </Panel>
  );
}

/* =============== Gallery (home) =============== */
export function GalleryEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [g, setG, dirty, discard] = useDraft(content.gallery);
  const set = (k) => (v) => setG((x) => ({ ...x, [k]: v }));
  const patchTab = (i, k, v) => setG((x) => ({ ...x, tabs: x.tabs.map((t, j) => (j === i ? { ...t, [k]: v } : t)) }));
  const patchItem = (i, k, v) => setG((x) => ({ ...x, items: x.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));
  const catOptions = g.tabs.map((t) => ({ value: t.id, label: t.label }));

  return (
    <Panel
      title="معرض الصور"
      hint="الصور تظهر في الصفحة الرئيسية: الأولى كبيرة، والثانية والثالثة بجانبها، والباقي في صف سفلي."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('gallery', g);
        notify('تم حفظ معرض الصور');
      }}
    >
      <Grid>
        <TextField label="عنوان القسم" value={g.title} onChange={set('title')} />
        <TextField label="نص زر «عرض الكل»" value={g.allLabel} onChange={set('allLabel')} />
      </Grid>
      <TextField label="رسالة عدم وجود صور" value={g.empty} onChange={set('empty')} />

      <h3 className="sub-title">التبويبات</h3>
      <div className="stack">
        {g.tabs.map((t, i) => (
          <Row key={t.id} index={i} title={t.label} removeLabel="إخفاء" onRemove={() => setG((x) => ({ ...x, tabs: x.tabs.filter((_, j) => j !== i) }))}>
            <TextField label="اسم التبويب" value={t.label} onChange={(v) => patchTab(i, 'label', v)} />
            <IconField value={t.icon} onChange={(v) => patchTab(i, 'icon', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setG((x) => ({ ...x, tabs: [...x.tabs, { id: `t-${Date.now()}`, label: 'تبويب جديد', icon: 'image' }] }))}>
        إضافة تبويب
      </AddButton>

      <h3 className="sub-title">الصور ({g.items.length})</h3>
      <div className="stack">
        {g.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.title} onRemove={() => setG((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <Grid>
              <TextField label="العنوان" value={it.title} onChange={(v) => patchItem(i, 'title', v)} />
              <SelectField label="التبويب" value={it.category} onChange={(v) => patchItem(i, 'category', v)} options={catOptions} />
              <TextField label="التاريخ (نص حر)" value={it.date} onChange={(v) => patchItem(i, 'date', v)} />
            </Grid>
            <ImageField label="الصورة" value={it.image || ''} onChange={(v) => patchItem(i, 'image', v)} maxW={1400} jpeg />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setG((x) => ({ ...x, items: [...x.items, { id: nextId(x.items), category: x.tabs[0]?.id ?? '', title: 'صورة جديدة', date: '', image: '' }] }))
        }
      >
        إضافة صورة
      </AddButton>
    </Panel>
  );
}

/* =============== Accreditation (home) =============== */
export function AccreditationEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [a, setA, dirty, discard] = useDraft(content.accreditation);
  const set = (k) => (v) => setA((x) => ({ ...x, [k]: v }));
  const patchTab = (i, v) => setA((x) => ({ ...x, tabs: x.tabs.map((t, j) => (j === i ? { ...t, label: v } : t)) }));
  const patchItem = (i, k, v) => setA((x) => ({ ...x, items: x.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));
  const catOptions = a.tabs.map((t) => ({ value: t.id, label: t.label }));

  return (
    <Panel
      title="الاعتماد"
      hint="شعارات الجهات المعتمدة. التبويب الذي لا يحتوي على أي عنصر يختفي تلقائيًا من الموقع."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('accreditation', a);
        notify('تم حفظ قسم الاعتماد');
      }}
    >
      <Grid>
        <TextField label="عنوان القسم" value={a.title} onChange={set('title')} />
        <TextField label="نص زر «عرض الكل»" value={a.allLabel} onChange={set('allLabel')} />
      </Grid>

      <h3 className="sub-title">أسماء التبويبات</h3>
      <Grid cols={4}>
        {a.tabs.map((t, i) => (
          <TextField key={t.id} label={`تصنيف ${i + 1}`} value={t.label} onChange={(v) => patchTab(i, v)} />
        ))}
      </Grid>

      <h3 className="sub-title">الجهات المعتمدة ({a.items.length})</h3>
      <div className="stack">
        {a.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.name} onRemove={() => setA((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <Grid>
              <TextField label="النص تحت الشعار" value={it.name} onChange={(v) => patchItem(i, 'name', v)} />
              <SelectField label="التصنيف" value={it.category} onChange={(v) => patchItem(i, 'category', v)} options={catOptions} />
            </Grid>
            <ImageField label="الشعار" value={it.logo || ''} onChange={(v) => patchItem(i, 'logo', v)} maxW={500} />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setA((x) => ({ ...x, items: [...x.items, { id: nextId(x.items), category: x.tabs[0]?.id ?? '', name: 'جهة جديدة', logo: '' }] }))
        }
      >
        إضافة جهة
      </AddButton>
    </Panel>
  );
}

/* =============== Testimonials (home) =============== */
export function TestimonialsEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [t, setT, dirty, discard] = useDraft(content.testimonials);
  const patchItem = (i, k, v) => setT((x) => ({ ...x, items: x.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));

  return (
    <Panel
      title="آراء الطلاب"
      hint="الآراء الحالية أمثلة تجريبية — استبدلها بآراء حقيقية من طلابك قبل النشر."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('testimonials', t);
        notify('تم حفظ آراء الطلاب');
      }}
    >
      <TextField label="عنوان القسم" value={t.title} onChange={(v) => setT((x) => ({ ...x, title: v }))} />

      <h3 className="sub-title">الآراء ({t.items.length})</h3>
      <div className="stack">
        {t.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.name} onRemove={() => setT((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <Grid>
              <TextField label="الاسم" value={it.name} onChange={(v) => patchItem(i, 'name', v)} />
              <TextField label="سطر تحت الاسم (مثال: خريج دبلوم الإدارة)" value={it.meta} onChange={(v) => patchItem(i, 'meta', v)} />
              <TextField label="التقييم (من 0 إلى 5)" type="number" min={0} max={5} dir="ltr" value={it.rating} onChange={(v) => patchItem(i, 'rating', Math.max(0, Math.min(5, Number(v) || 0)))} />
            </Grid>
            <AreaField label="نص الرأي" rows={3} value={it.text} onChange={(v) => patchItem(i, 'text', v)} />
            <ImageField label="الصورة الشخصية (اختياري — بدونها تظهر الأحرف الأولى)" value={it.image || ''} onChange={(v) => patchItem(i, 'image', v)} maxW={300} jpeg />
          </Row>
        ))}
      </div>
      <AddButton
        onClick={() =>
          setT((x) => ({ ...x, items: [...x.items, { id: nextId(x.items), name: 'اسم الطالب', meta: '', rating: 5, image: '', text: 'اكتب رأي الطالب هنا' }] }))
        }
      >
        إضافة رأي
      </AddButton>
    </Panel>
  );
}

/* =============== Partners (home) =============== */
export function PartnersEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [p, setP, dirty, discard] = useDraft(content.partners);
  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }));
  const patchItem = (i, k, v) => setP((x) => ({ ...x, items: x.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));

  return (
    <Panel
      title="الشركاء"
      hint="شعارات الشركاء تظهر داخل دوائر في شريط متحرك. الشعارات الحالية أمثلة تجريبية — استبدلها بشعارات شركائك قبل النشر."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('partners', p);
        notify('تم حفظ قسم الشركاء');
      }}
    >
      <Grid>
        <TextField label="عنوان القسم" value={p.title} onChange={set('title')} />
        <TextField label="الوصف تحت العنوان" value={p.subtitle} onChange={set('subtitle')} />
      </Grid>

      <h3 className="sub-title">الشركاء ({p.items.length})</h3>
      <div className="stack">
        {p.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.name} onRemove={() => setP((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <Grid>
              <TextField label="اسم الشريك" value={it.name} onChange={(v) => patchItem(i, 'name', v)} />
              <TextField label="رابط الشريك (اختياري)" dir="ltr" value={it.href || ''} onChange={(v) => patchItem(i, 'href', v)} />
            </Grid>
            <ImageField label="الشعار" value={it.logo || ''} onChange={(v) => patchItem(i, 'logo', v)} maxW={400} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setP((x) => ({ ...x, items: [...x.items, { id: nextId(x.items), name: 'شريك جديد', logo: '', href: '' }] }))}>
        إضافة شريك
      </AddButton>
    </Panel>
  );
}

/* =============== FAQ (home) =============== */
export function FaqEditor({ notify }) {
  const { content, updateSection } = useContent();
  const [f, setF, dirty, discard] = useDraft(content.faq);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const patchItem = (i, k, v) => setF((x) => ({ ...x, items: x.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));

  return (
    <Panel
      title="الأسئلة الشائعة"
      hint="الأسئلة الحالية أمثلة تجريبية — اكتب أسئلتك وإجاباتك الحقيقية. أول سؤال يظهر مفتوحًا."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('faq', f);
        notify('تم حفظ الأسئلة الشائعة');
      }}
    >
      <Grid>
        <TextField label="عنوان القسم" value={f.title} onChange={set('title')} />
        <TextField label="الوصف تحت العنوان" value={f.subtitle} onChange={set('subtitle')} />
      </Grid>

      <h3 className="sub-title">الأسئلة ({f.items.length})</h3>
      <div className="stack">
        {f.items.map((it, i) => (
          <Row key={it.id} index={i} title={it.q} onRemove={() => setF((x) => ({ ...x, items: x.items.filter((_, j) => j !== i) }))}>
            <TextField label="السؤال" value={it.q} onChange={(v) => patchItem(i, 'q', v)} />
            <AreaField label="الإجابة" rows={3} value={it.a} onChange={(v) => patchItem(i, 'a', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => setF((x) => ({ ...x, items: [...x.items, { id: nextId(x.items), q: 'سؤال جديد؟', a: 'اكتب الإجابة هنا' }] }))}>
        إضافة سؤال
      </AddButton>
    </Panel>
  );
}

/* =============== Advertisement posters (side strips on large screens) =============== */
/* One screen edits BOTH languages: every position has its own Arabic and English poster
   (upload / preview / replace / delete), and each language's site only ever shows its own. */
const AD_POSITIONS = {
  'left-1': 'الجانب الأيسر — الإعلان العلوي',
  'left-2': 'الجانب الأيسر — الإعلان السفلي',
  'right-1': 'الجانب الأيمن — الإعلان العلوي',
  'right-2': 'الجانب الأيمن — الإعلان السفلي',
};

export function AdsEditor({ notify }) {
  const { allContents, updateLang } = useContent();

  const pick = (l) => {
    const a = normalizeAds(allContents[l].ads, {});
    return { label: a.label || '', slots: a.slots };
  };
  const [a, setA, dirty, discard] = useDraft({
    enabled: allContents.ar.ads.enabled !== false && allContents.en.ads.enabled !== false,
    ar: pick('ar'),
    en: pick('en'),
  });

  const patchSlot = (l, id, patch) =>
    setA((x) => ({ ...x, [l]: { ...x[l], slots: x[l].slots.map((sl) => (sl.id === id ? { ...sl, ...patch } : sl)) } }));
  const patchLang = (l, patch) => setA((x) => ({ ...x, [l]: { ...x[l], ...patch } }));

  const save = () => {
    ['ar', 'en'].forEach((l) => updateLang(l, 'ads', { enabled: a.enabled, label: a[l].label, slots: a[l].slots }));
    notify('تم حفظ الإعلانات');
  };

  const langBox = (l, title, slot) => (
    <div className="ad-lang" dir={l === 'ar' ? 'rtl' : 'ltr'}>
      <h4 className="ad-lang__title">{title}</h4>
      <ImageField
        label={l === 'ar' ? 'صورة الإعلان (تظهر في النسخة العربية فقط)' : 'Advertisement image (shown on the English site only)'}
        value={slot.image || ''}
        onChange={(v) => patchSlot(l, slot.id, { image: v })}
        maxW={700}
        jpeg
      />
      <TextField label="الرابط عند الضغط" dir="ltr" value={slot.href || ''} onChange={(v) => patchSlot(l, slot.id, { href: v })} placeholder="/courses أو #contact أو https://…" />
      <Grid>
        <TextField label="عنوان البانر الافتراضي" value={slot.title || ''} onChange={(v) => patchSlot(l, slot.id, { title: v })} />
        <TextField label="النص الصغير للبانر الافتراضي" value={slot.text || ''} onChange={(v) => patchSlot(l, slot.id, { text: v })} />
      </Grid>
    </div>
  );

  return (
    <Panel
      title="الإعلانات"
      hint="أربعة مواضع: إعلانان على اليسار وإعلانان على اليمين. لكل موضع صورة عربية وصورة إنجليزية منفصلتان، وتظهر كل واحدة في لغتها فقط. المقاس المقترح 300×690 بكسل (نسبة 1:2.3). بدون صورة يظهر بانر المعهد المتحرك، وإن تُرك العنوان والنص والصورة فارغة يختفي الموضع."
      dirty={dirty}
      onDiscard={discard}
      onSave={save}
    >
      <ToggleField
        label="إظهار الإعلانات"
        hint="تظهر على جانبي الصفحة في الشاشات الكبيرة (1600 بكسل فأكثر)، وفي شبكة فوق التذييل على باقي الأجهزة."
        checked={a.enabled}
        onChange={(v) => setA((x) => ({ ...x, enabled: v }))}
      />
      <Grid>
        <TextField label="كلمة «إعلان» فوق البوستر (العربية)" value={a.ar.label} onChange={(v) => patchLang('ar', { label: v })} />
        <TextField label="Tag above the poster (English)" dir="ltr" value={a.en.label} onChange={(v) => patchLang('en', { label: v })} />
      </Grid>

      {AD_SLOT_DEFS.map((def, i) => (
        <section className="ad-pos" key={def.id}>
          <h3 className="sub-title">
            <span className="row-card__num">{i + 1}</span> {AD_POSITIONS[def.id]}
          </h3>
          <div className="ad-pos__langs">
            {langBox('ar', 'النسخة العربية', a.ar.slots.find((x) => x.id === def.id))}
            {langBox('en', 'النسخة الإنجليزية (English)', a.en.slots.find((x) => x.id === def.id))}
          </div>
        </section>
      ))}
    </Panel>
  );
}

export const sections = [
  { key: 'overview', label: 'نظرة عامة', icon: 'home' },
  { key: 'site', label: 'بيانات الموقع', icon: 'globe' },
  { key: 'hero', label: 'القسم الرئيسي', icon: 'image' },
  { key: 'features', label: 'المميزات', icon: 'cert' },
  { key: 'programs', label: 'البرامج والدبلومات والمقررات', icon: 'layers' },
  { key: 'about', label: 'من نحن', icon: 'book' },
  { key: 'stats', label: 'الإحصائيات', icon: 'chart' },
  { key: 'gallery', label: 'معرض الصور', icon: 'image' },
  { key: 'accreditation', label: 'الاعتماد', icon: 'cert' },
  { key: 'testimonials', label: 'آراء الطلاب', icon: 'users' },
  { key: 'partners', label: 'الشركاء', icon: 'users' },
  { key: 'faq', label: 'الأسئلة الشائعة', icon: 'book' },
  { key: 'ads', label: 'الإعلانات', icon: 'image' },
  { key: 'courses', label: 'صفحة الدورات', icon: 'cap' },
  { key: 'filters', label: 'تصنيفات صفحة الدورات', icon: 'layers' },
  { key: 'labels', label: 'نصوص التبويبات والتفاصيل', icon: 'settings' },
  { key: 'admission', label: 'قواعد القبول', icon: 'cert' },
  { key: 'contact', label: 'قسم تواصل معنا', icon: 'mail' },
  { key: 'branches', label: 'صفحة الفروع', icon: 'pin' },
  { key: 'theme', label: 'ألوان الموقع', icon: 'palette' },
  { key: 'footer', label: 'التذييل', icon: 'building' },
 
];