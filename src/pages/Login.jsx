import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/common/Icons.jsx';

export default function Login() {
  const { isAuthed, login } = useAuth();
  const { content } = useContent();
  const { t, toggle, dir } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shake, setShake] = useState(false);

  // admin area keeps the normal font size (see global.css)
  useEffect(() => {
    document.documentElement.dataset.area = 'admin';
    return () => {
      delete document.documentElement.dataset.area;
    };
  }, []);

  if (isAuthed) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (await login(form.username, form.password)) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } else {
      setFailed(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <main className="login">
      <span className="login__orb login__orb--1" />
      <span className="login__orb login__orb--2" />
      <span className="login__orb login__orb--3" />

      <button type="button" className="login__lang" onClick={toggle}>
        <Icon name="globe" size={16} /> {t('switchLang')}
      </button>

      <form className={`login__card ${shake ? 'is-shaking' : ''}`} onSubmit={submit} noValidate>
        <div className="login__logo">
          <Icon name="lock" size={30} />
        </div>
        <h1>{t('loginTitle')}</h1>
        <p className="login__sub">
          {t('loginFor')} {content.site.name}
        </p>

        <label className="field">
          <span className="field__label">{t('username')}</span>
          <span className="input-wrap">
            <Icon name="user" size={18} />
            <input
              className="input"
              autoComplete="username"
              autoFocus
              dir="ltr"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </span>
        </label>

        <label className="field">
          <span className="field__label">{t('password')}</span>
          <span className="input-wrap">
            <Icon name="lock" size={18} />
            <input
              className="input"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              dir="ltr"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="button" className="input-wrap__toggle" onClick={() => setShow((s) => !s)} aria-label={t('togglePassword')}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
            </button>
          </span>
        </label>

        {failed && (
          <p className="form-error" role="alert">
            {t('badLogin')}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--lg login__submit">
          {t('loginBtn')}
        </button>


        <Link to="/" className="login__back">
          <Icon name={dir === 'rtl' ? 'arrowRight' : 'arrowLeft'} size={16} /> {t('backToSite')}
        </Link>
      </form>
    </main>
  );
}
