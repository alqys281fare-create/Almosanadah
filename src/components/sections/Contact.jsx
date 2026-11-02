import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Decorative "contact us" illustration: envelope, chat bubbles and an @ badge.
   Colours come from the theme (--navy, --red, --card) via CSS classes. */
function ContactIllustration() {
  return (
    <svg
      className="ct-illus"
      viewBox="0 0 480 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Background blob + dotted orbit */}
      <circle className="ct-illus__blob" cx="240" cy="215" r="165" />
      <circle className="ct-illus__orbit" cx="240" cy="215" r="195" />

      {/* Envelope group */}
      <g className="ct-illus__float ct-illus__float--a">
        {/* letter peeking out */}
        <rect className="ct-illus__letter" x="170" y="150" width="140" height="110" rx="10" />
        <rect className="ct-illus__line" x="188" y="170" width="70" height="8" rx="4" />
        <rect className="ct-illus__line ct-illus__line--red" x="188" y="190" width="104" height="8" rx="4" />
        <rect className="ct-illus__line" x="188" y="210" width="90" height="8" rx="4" />

        {/* envelope body */}
        <rect className="ct-illus__env" x="140" y="200" width="200" height="132" rx="16" />
        <path className="ct-illus__fold" d="M146 330 L232 258 M334 330 L248 258" />
        <path className="ct-illus__flap" d="M140 216 Q140 200 156 200 L324 200 Q340 200 340 216 L252 276 Q240 284 228 276 Z" />
      </g>

      {/* Chat bubble (red) */}
      <g className="ct-illus__float ct-illus__float--b">
        <path
          className="ct-illus__bubble-red"
          d="M318 70 h84 a18 18 0 0 1 18 18 v44 a18 18 0 0 1 -18 18 h-48 l-22 20 v-20 h-14 a18 18 0 0 1 -18 -18 v-44 a18 18 0 0 1 18 -18 z"
        />
        <circle className="ct-illus__dot" cx="344" cy="110" r="6" />
        <circle className="ct-illus__dot" cx="360" cy="110" r="6" />
        <circle className="ct-illus__dot" cx="376" cy="110" r="6" />
      </g>

      {/* Chat bubble (navy outline) */}
      <g className="ct-illus__float ct-illus__float--c">
        <path
          className="ct-illus__bubble-navy"
          d="M62 150 h86 a16 16 0 0 1 16 16 v34 a16 16 0 0 1 -16 16 h-62 l-20 18 v-18 h-4 a16 16 0 0 1 -16 -16 v-34 a16 16 0 0 1 16 -16 z"
        />
        <rect className="ct-illus__bubble-line" x="80" y="170" width="66" height="7" rx="3.5" />
        <rect className="ct-illus__bubble-line" x="80" y="187" width="42" height="7" rx="3.5" />
      </g>

      {/* @ badge */}
      <g className="ct-illus__float ct-illus__float--d">
        <circle className="ct-illus__badge" cx="372" cy="318" r="30" />
        <text className="ct-illus__at" x="372" y="329" textAnchor="middle">@</text>
      </g>

      {/* Sparkles */}
      <g className="ct-illus__spark">
        <path d="M96 296 v20 M86 306 h20" />
        <path d="M420 200 v14 M413 207 h14" />
        <path d="M236 52 v14 M229 59 h14" />
      </g>
      <circle className="ct-illus__pip ct-illus__pip--red" cx="110" cy="352" r="6" />
      <circle className="ct-illus__pip" cx="436" cy="270" r="5" />
      <circle className="ct-illus__pip ct-illus__pip--red" cx="196" cy="86" r="4" />
    </svg>
  );
}

/* A text input / textarea with an icon at the start side, like the design. */
function Field({ id, icon, label, error, area, ...rest }) {
  const Tag = area ? 'textarea' : 'input';
  return (
    <div className={`ct-field ${area ? 'ct-field--area' : ''} ${error ? 'is-error' : ''}`}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <Icon name={icon} size={17} className="ct-field__icon" />
      <Tag id={id} placeholder={label} aria-invalid={error ? 'true' : undefined} {...(area ? { rows: 4 } : {})} {...rest} />
    </div>
  );
}


export default function Contact() {
  const { content } = useContent();
  const { site, contact: c } = content;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | error | sent
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (status !== 'idle') setStatus('idle');
  };

  const invalid = {
    name: !form.name.trim(),
    email: !EMAIL_RE.test(form.email.trim()),
    message: !form.message.trim(),
  };

  const submit = (e) => {
    e.preventDefault();
    if (invalid.name || invalid.email || invalid.message) return setStatus('error');
    const subject = form.subject.trim() || `${c.title} — ${form.name.trim()}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()}\n${form.email.trim()}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const show = status === 'error';
  const social = (c.social || []).filter((s) => s.href);

  return (
    <section className="ct" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal direction="up" className="section-head">
          <h2 className="section-title" id="contact-title">
            <span className="section-title__line" />
            {c.title}
            <span className="section-title__line" />
          </h2>
          {c.subtitle && <p className="section-desc">{c.subtitle}</p>}
        </Reveal>

        <Reveal direction="up" delay={120}>
          <div className="ct-layout">
            <ContactIllustration />

            <div className="ct-card">
              <h3 className="ct-card__title">{c.formTitle}</h3>
              <p className="ct-card__hint">{c.formHint}</p>

              <form className="ct-form" onSubmit={submit} noValidate>
                <Field id="ct-name" icon="user" label={c.name} value={form.name} onChange={set('name')} error={show && invalid.name} autoComplete="name" />
                <Field id="ct-email" icon="mail" label={c.email} type="email" value={form.email} onChange={set('email')} error={show && invalid.email} autoComplete="email" />
                <div className="ct-form__full">
                  <Field id="ct-subject" icon="tag" label={c.subject} value={form.subject} onChange={set('subject')} />
                </div>
                <div className="ct-form__full">
                  <Field id="ct-message" icon="message" area label={c.message} value={form.message} onChange={set('message')} error={show && invalid.message} />
                </div>

                <p className={`ct-status ct-status--${status}`} role="status" aria-live="polite">
                  {status === 'error' && c.error}
                  {status === 'sent' && c.success}
                </p>

                <div className="ct-form__foot ct-form__full">
                  <ul className="ct-info">
                    <li>
                      <Icon name="pin" size={20} />
                      <strong>{c.regionsValue}</strong>
                      <span>{c.regionsLabel}</span>
                    </li>
                    <li>
                      <Icon name="mail" size={20} />
                      <a href={`mailto:${site.email}`} dir="ltr"><strong>{site.email}</strong></a>
                      <span>{c.emailLabel}</span>
                    </li>
                    <li>
                      <Icon name="phone" size={20} />
                      <a href={`tel:${site.phone}`} dir="ltr"><strong>{site.phone}</strong></a>
                      <span>{c.phoneLabel}</span>
                    </li>
                  </ul>
                  <button type="submit" className="ct-send">
                    {c.send}
                    <Icon name="send" size={17} className="ct-send__icon" />
                  </button>
                </div>
              </form>

              {social.length > 0 && (
                <div className="ct-social">
                  {social.map((s) => (
                    <a key={s.id} href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.name} title={s.name}>
                      <Icon name={s.icon} size={18} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}