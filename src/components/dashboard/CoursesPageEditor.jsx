import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import { AreaField, Grid, ImageField, Panel, TextField, useDraft } from './Fields.jsx';

/*
 * Texts + banner of the /courses page ONLY.
 * The cards on that page are NOT edited here: /courses lists the same diplomas and courses as the home «Programs»
 * section, straight from the catalog (see «الكتالوج»), so there is a single place to add or change a program.
 */
export default function CoursesPageEditor({ notify }) {
  const { content, updateSection, updateShared } = useContent();
  const c = content.courses || {};
  const [d, setD, dirty, discard] = useDraft({
    title: c.title || '',
    subtitle: c.subtitle || '',
    searchPlaceholder: c.searchPlaceholder || '',
    searchButton: c.searchButton || '',
    allProgramsLabel: c.allProgramsLabel || '',
    programsTitle: c.programsTitle || '',
    empty: c.empty || '',
    banner: c.banner || '',
  });
  const set = (k) => (v) => setD((x) => ({ ...x, [k]: v }));

  return (
    <Panel
      title="نصوص صفحة الدورات (/courses)"
      hint="عنوان الصفحة، خانة البحث، والبانر. البطاقات نفسها تُدار من «الكتالوج» وتظهر هنا وفي الصفحة الرئيسية تلقائيًا."
      dirty={dirty}
      onDiscard={discard}
      onSave={() => {
        const { banner, ...texts } = d;
        updateSection('courses', texts);
        updateShared('courses', { banner }); // the banner picture is the same in both languages
        notify('تم حفظ نصوص صفحة الدورات');
      }}
      extra={
        <a href="/courses" target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
          <Icon name="eye" size={16} /> معاينة
        </a>
      }
    >
      <Grid>
        <TextField label="عنوان الصفحة" value={d.title} onChange={set('title')} />
        <TextField label="العنوان الفرعي" value={d.subtitle} onChange={set('subtitle')} />
        <TextField label="نص خانة البحث" value={d.searchPlaceholder} onChange={set('searchPlaceholder')} />
        <TextField label="نص زر البحث" value={d.searchButton} onChange={set('searchButton')} />
        <TextField label="نص تبويب «عرض الكل»" value={d.allProgramsLabel} onChange={set('allProgramsLabel')} />
        <TextField label="وصف شريط التبويبات (قارئ الشاشة)" value={d.programsTitle} onChange={set('programsTitle')} />
      </Grid>
      <AreaField label="رسالة عدم وجود نتائج" value={d.empty} onChange={set('empty')} rows={2} />
      <ImageField label="صورة البانر (اختياري)" value={d.banner} onChange={set('banner')} maxW={1600} />
    </Panel>
  );
}
