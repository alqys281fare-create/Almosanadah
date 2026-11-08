import { useEffect, useRef, useState } from 'react';
import Icon, { iconNames } from '../common/Icons.jsx';
import { isHex, normalizeHex } from '../../Utils/color.js';

/* ---------- draft hook: local copy of a section until "Save" ---------- */
export function useDraft(source) {
  const [draft, setDraft] = useState(source);
  const sourceKey = JSON.stringify(source);
  const firstRun = useRef(true);

  // re-sync when the stored value changes from elsewhere (reset / import)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setDraft(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  const dirty = JSON.stringify(draft) !== sourceKey;
  const discard = () => setDraft(source);
  return [draft, setDraft, dirty, discard];
}

/* ---------- layout ---------- */
/*
 * The Save / Discard buttons live in a bar that is ALWAYS visible at the bottom of the screen
 * (position: sticky), so long editors (courses, programs, branches…) never make you scroll
 * back to the top to save. The bar is a sibling of the panel because the panel clips its content.
 */
export function Panel({ title, hint, children, onSave, onDiscard, dirty, extra }) {
  return (
    <>
      <section className="panel">
        <header className="panel__head">
          <div>
            <h2>{title}</h2>
            {hint && <p>{hint}</p>}
          </div>
          {extra && <div className="panel__actions">{extra}</div>}
        </header>
        <div className="panel__body">{children}</div>
      </section>

      {(onSave || onDiscard) && (
        <div className={`savebar ${dirty ? 'is-dirty' : ''}`} role="region" aria-label="حفظ التغييرات">
          <span className="savebar__state" aria-live="polite">
            <i aria-hidden="true" />
            {dirty ? 'لديك تغييرات غير محفوظة' : 'كل التغييرات محفوظة'}
          </span>
          <div className="savebar__btns">
            {onDiscard && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={onDiscard} disabled={!dirty}>
                <Icon name="reset" size={16} /> تراجع
              </button>
            )}
            {onSave && (
              <button type="button" className="btn btn--primary btn--sm" onClick={onSave} disabled={!dirty}>
                <Icon name="save" size={16} /> حفظ التغييرات
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function Grid({ cols = 2, children }) {
  return <div className={`form-grid form-grid--${cols}`}>{children}</div>;
}

/* ---------- inputs ---------- */
export function TextField({ label, value, onChange, type = 'text', dir, placeholder, ...rest }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="input"
        type={type}
        dir={dir || (type === 'text' ? 'auto' : undefined)}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </label>
  );
}

export function AreaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea className="input" dir="auto" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const HIDDEN_ICONS = [
  'arrowLeft',
  'arrowRight',
  'chevronDown',
  'menu',
  'close',
  'dot',
  'plus',
  'trash',
  'edit',
  'save',
  'settings',
  'logout',
  'lock',
  'download',
  'upload',
  'reset',
  'check',
  'eyeOff',
  'search',
  'pin',
  'play',
  'palette',
  'chevron',
  'link',
];

export function IconField({ label = 'الأيقونة', value, onChange }) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <div className="icon-picker">
        {/* Clear button — only shown when an icon is currently selected.
            Uses `close`, which is already excluded from HIDDEN_ICONS the picker. */}
        {value && (
          <button
            type="button"
            title="بدون أيقونة"
            className="icon-picker__btn"
            onClick={() => onChange('')}
          >
            <Icon name="close" size={16} />
          </button>
        )}
        {iconNames
          .filter((n) => !HIDDEN_ICONS.includes(n))
          .map((n) => (
            <button
              key={n}
              type="button"
              title={n}
              className={`icon-picker__btn ${value === n ? 'is-active' : ''}`}
              onClick={() => onChange(n)}
            >
              <Icon name={n} size={20} />
            </button>
          ))}
      </div>
    </div>
  );
}

/* Image: URL or upload (stored as data URL, compressed to keep localStorage small) */
const compress = (file, maxW = 1100, quality = 0.82, forceJpeg = false) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        // photos (e.g. the hero poster) are stored as JPEG: a PNG of the same picture is 5-10x larger
        if (forceJpeg) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(!forceJpeg && file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export function ImageField({ label, value, onChange, maxW, jpeg = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await compress(file, maxW, jpeg ? 0.85 : undefined, jpeg));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <div className="image-field">
        <div className="image-field__preview">
          {value ? <img src={value} alt="" /> : <Icon name="image" size={30} />}
        </div>
        <div className="image-field__ctrl">
          <input
            className="input"
            dir="ltr"
            placeholder="https://… أو ارفع صورة"
            value={value?.startsWith('data:') ? '(صورة مرفوعة)' : value ?? ''}
            readOnly={value?.startsWith('data:')}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="image-field__btns">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              <Icon name="upload" size={16} /> {busy ? 'جارٍ الرفع…' : value ? 'تحديث الصورة' : 'رفع صورة'}
            </button>
            {value && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange('')}>
                <Icon name="trash" size={16} /> حذف الصورة
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
        </div>
      </div>
    </div>
  );
}

/* On/off switch */
export function ToggleField({ label, checked, onChange, hint }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track" aria-hidden="true" />
      <span className="toggle__text">
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

/* Colour picker + hex input */
export function ColorField({ label, hint, value, onChange }) {
  const valid = isHex(value);
  return (
    <div className="field color-field">
      <span className="field__label">{label}</span>
      <div className="color-field__ctrl">
        <input
          type="color"
          className="color-field__swatch"
          value={normalizeHex(value, '#000000')}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
        <input
          className={`input ${valid ? '' : 'input--bad'}`}
          dir="ltr"
          value={value}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChange(v && !v.startsWith('#') ? `#${v}` : v);
          }}
        />
      </div>
      {hint && <small className="field__hint">{hint}</small>}
    </div>
  );
}

/* Move one element of an array up (-1) or down (+1); returns a new array */
export const moveItem = (list, index, dir) => {
  const to = index + dir;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[index], next[to]] = [next[to], next[index]];
  return next;
};

/* Row helpers for list editors. Pass onMoveUp / onMoveDown to get the ordering arrows. */
export function Row({ index, title, onRemove, removeLabel = 'حذف', onMoveUp, onMoveDown, children }) {
  return (
    <div className="row-card">
      <div className="row-card__head">
        <span className="row-card__num">{index + 1}</span>
        <strong>{title}</strong>
        {(onMoveUp || onMoveDown) && (
          <span className="row-card__order">
            <button type="button" className="icon-btn" onClick={onMoveUp} disabled={!onMoveUp} aria-label="تحريك للأعلى" title="تحريك للأعلى">
              <Icon name="chevronDown" size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button type="button" className="icon-btn" onClick={onMoveDown} disabled={!onMoveDown} aria-label="تحريك للأسفل" title="تحريك للأسفل">
              <Icon name="chevronDown" size={18} />
            </button>
          </span>
        )}
        <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove} aria-label={removeLabel} title={removeLabel}>
          <Icon name={removeLabel === 'حذف' ? 'trash' : 'eyeOff'} size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

export const AddButton = ({ onClick, children }) => (
  <button type="button" className="btn btn--ghost add-btn" onClick={onClick}>
    <Icon name="plus" size={18} /> {children}
  </button>
);

export const nextId = (list) => list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;

/* a textarea where every line is one list item */
export function LinesField({ label, value, onChange, rows = 4, hint }) {
  return <AreaField label={label} hint={hint} value={(value || []).join('\n')} onChange={(v) => onChange(v.split('\n'))} rows={rows} />;
}

/*
 * «Where is it offered?» — choose all branches, or tick specific ones (grouped by region).
 *   value    { branchMode: 'all' | 'selected', branchIds: [] }
 *   onChange (patch) → patch has the same two keys
 */
export function BranchPicker({ label = 'الفروع المتاحة', value, onChange, branches = [], regions = [] }) {
  const mode = value?.branchMode === 'selected' ? 'selected' : 'all';
  const ids = (value?.branchIds || []).map(String);
  const has = (id) => ids.includes(String(id));
  const setIds = (next) => onChange({ branchMode: 'selected', branchIds: next });
  const toggle = (id) => setIds(has(id) ? ids.filter((x) => x !== String(id)) : [...ids, String(id)]);
  const groups = regions
    .map((r) => ({ ...r, list: branches.filter((b) => String(b.region) === String(r.id)) }))
    .filter((g) => g.list.length);
  const listed = new Set(groups.flatMap((g) => g.list.map((b) => String(b.id))));
  const rest = branches.filter((b) => !listed.has(String(b.id)));
  if (rest.length) groups.push({ id: '__rest', label: 'أخرى', list: rest });

  return (
    <div className="bp">
      <span className="field__label">{label}</span>
      <div className="bp__modes" role="radiogroup" aria-label={label}>
        <button type="button" role="radio" aria-checked={mode === 'all'} className={`bp__mode ${mode === 'all' ? 'is-active' : ''}`} onClick={() => onChange({ branchMode: 'all', branchIds: ids })}>
          جميع الفروع ({branches.length})
        </button>
        <button type="button" role="radio" aria-checked={mode === 'selected'} className={`bp__mode ${mode === 'selected' ? 'is-active' : ''}`} onClick={() => onChange({ branchMode: 'selected', branchIds: ids })}>
          فروع محددة ({mode === 'selected' ? ids.filter((i) => branches.some((b) => String(b.id) === i)).length : ids.length})
        </button>
      </div>

      {mode === 'selected' && (
        <div className="bp__list">
          <div className="bp__tools">
            <button type="button" className="link-btn" onClick={() => setIds(branches.map((b) => String(b.id)))}>تحديد الكل</button>
            <button type="button" className="link-btn" onClick={() => setIds([])}>إلغاء التحديد</button>
          </div>
          {branches.length === 0 && <p className="field__hint">لا توجد فروع بعد — أضفها من قسم «صفحة الفروع».</p>}
          {groups.map((g) => {
            const all = g.list.every((b) => has(b.id));
            return (
              <fieldset key={g.id} className="bp__group">
                <legend>
                  <label className="bp__check">
                    <input
                      type="checkbox"
                      checked={all}
                      onChange={() => setIds(all ? ids.filter((i) => !g.list.some((b) => String(b.id) === i)) : [...new Set([...ids, ...g.list.map((b) => String(b.id))])])}
                    />
                    <strong>{g.label}</strong>
                  </label>
                </legend>
                <div className="bp__items">
                  {g.list.map((b) => (
                    <label key={b.id} className={`bp__check bp__item ${has(b.id) ? 'is-on' : ''}`}>
                      <input type="checkbox" checked={has(b.id)} onChange={() => toggle(b.id)} />
                      {b.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}
    </div>
  );
}
