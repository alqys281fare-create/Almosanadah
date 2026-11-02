import { useContent } from '../../context/ContentContext.jsx';
import { getAdmission } from '../../data/admissionContent.js';
import { AddButton, AreaField, Grid, IconField, ImageField, Panel, Row, TextField, nextId, useDraft } from './Fields.jsx';

/* Dashboard section «قواعد القبول» — edits the content of the /admission page (per language). */
export default function AdmissionEditor({ notify }) {
  const { content, lang, updateSection, updateShared } = useContent();
  const [a, setA, dirty, discard] = useDraft(getAdmission(lang, content.admission));

  const set = (k) => (v) => setA((x) => ({ ...x, [k]: v }));
  const patch = (list, i, k, v) => setA((x) => ({ ...x, [list]: x[list].map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));
  const remove = (list, i) => setA((x) => ({ ...x, [list]: x[list].filter((_, j) => j !== i) }));
  const add = (list, item) => setA((x) => ({ ...x, [list]: [...x[list], { id: nextId(x[list]), ...item }] }));

  return (
    <Panel
      title="قواعد القبول"
      hint="محتوى صفحة «قواعد القبول». النصوص الحالية أمثلة — اكتب شروط المعهد الحقيقية. لإظهار الصفحة في القائمة اجعل رابط «قواعد القبول» في إعدادات القائمة: /admission"
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        updateSection('admission', a);
        updateShared('admission', { banner: a.banner }); // the banner picture is the same in both languages
        notify('تم حفظ قواعد القبول');
      }}
    >
      <Grid>
        <TextField label="عنوان الصفحة" value={a.title} onChange={set('title')} />
        <TextField label="الوصف تحت العنوان" value={a.subtitle} onChange={set('subtitle')} />
      </Grid>
      <ImageField label="صورة اللافتة العلوية (اختياري)" value={a.banner || ''} onChange={set('banner')} maxW={1600} jpeg />

      <h3 className="sub-title">المقدمة</h3>
      <TextField label="عنوان المقدمة" value={a.introTitle} onChange={set('introTitle')} />
      <AreaField label="نص المقدمة" rows={4} value={a.intro} onChange={set('intro')} />

      <h3 className="sub-title">خطوات التسجيل ({a.steps.length})</h3>
      <TextField label="عنوان القسم" value={a.stepsTitle} onChange={set('stepsTitle')} />
      <div className="stack">
        {a.steps.map((s, i) => (
          <Row key={s.id} index={i} title={s.title} onRemove={() => remove('steps', i)}>
            <Grid>
              <TextField label="عنوان الخطوة" value={s.title} onChange={(v) => patch('steps', i, 'title', v)} />
              <IconField value={s.icon} onChange={(v) => patch('steps', i, 'icon', v)} />
            </Grid>
            <AreaField label="الوصف" rows={2} value={s.text} onChange={(v) => patch('steps', i, 'text', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => add('steps', { icon: 'check', title: 'خطوة جديدة', text: 'اكتب وصف الخطوة' })}>إضافة خطوة</AddButton>

      <h3 className="sub-title">شروط القبول ({a.conditions.length})</h3>
      <TextField label="عنوان القسم" value={a.conditionsTitle} onChange={set('conditionsTitle')} />
      <div className="stack">
        {a.conditions.map((c, i) => (
          <Row key={c.id} index={i} title={c.text} onRemove={() => remove('conditions', i)}>
            <AreaField label="الشرط" rows={2} value={c.text} onChange={(v) => patch('conditions', i, 'text', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => add('conditions', { text: 'شرط جديد' })}>إضافة شرط</AddButton>

      <h3 className="sub-title">المستندات المطلوبة ({a.documents.length})</h3>
      <TextField label="عنوان القسم" value={a.documentsTitle} onChange={set('documentsTitle')} />
      <div className="stack">
        {a.documents.map((d, i) => (
          <Row key={d.id} index={i} title={d.title} onRemove={() => remove('documents', i)}>
            <Grid>
              <TextField label="اسم المستند" value={d.title} onChange={(v) => patch('documents', i, 'title', v)} />
              <IconField value={d.icon} onChange={(v) => patch('documents', i, 'icon', v)} />
            </Grid>
            <TextField label="ملاحظة قصيرة (اختياري)" value={d.text || ''} onChange={(v) => patch('documents', i, 'text', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => add('documents', { icon: 'cert', title: 'مستند جديد', text: '' })}>إضافة مستند</AddButton>

      <h3 className="sub-title">ملاحظات مهمة ({a.notes.length})</h3>
      <TextField label="عنوان القسم" value={a.notesTitle} onChange={set('notesTitle')} />
      <div className="stack">
        {a.notes.map((n, i) => (
          <Row key={n.id} index={i} title={n.text} onRemove={() => remove('notes', i)}>
            <AreaField label="الملاحظة" rows={2} value={n.text} onChange={(v) => patch('notes', i, 'text', v)} />
          </Row>
        ))}
      </div>
      <AddButton onClick={() => add('notes', { text: 'ملاحظة جديدة' })}>إضافة ملاحظة</AddButton>

      <h3 className="sub-title">قسم التواصل في أسفل الصفحة</h3>
      <Grid>
        <TextField label="العنوان" value={a.ctaTitle} onChange={set('ctaTitle')} />
        <TextField label="النص" value={a.ctaText} onChange={set('ctaText')} />
        <TextField label="الزر الأول" value={a.ctaButton} onChange={set('ctaButton')} />
        <TextField label="رابط الزر الأول" dir="ltr" value={a.ctaHref} onChange={set('ctaHref')} />
        <TextField label="الزر الثاني" value={a.ctaSecondary} onChange={set('ctaSecondary')} />
        <TextField label="رابط الزر الثاني" dir="ltr" value={a.ctaSecondaryHref} onChange={set('ctaSecondaryHref')} />
      </Grid>
    </Panel>
  );
}
