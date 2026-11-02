import { useContent } from '../../context/ContentContext.jsx';
import Icon from '../common/Icons.jsx';
import Reveal from '../common/Reveal.jsx';
import SectionDivider from '../common/SectionDivider.jsx';
import SmartLink from '../common/SmartLink.jsx';

/* A footer link: real link when it has an href, plain text when it is still empty. */
function FooterLink({ href, children, className = '' }) {
  if (!href) return <span className={`${className} is-plain`}>{children}</span>;
  return (
    <SmartLink href={href} className={className}>
      {children}
    </SmartLink>
  );
}

/* `divider` = colour of the section above (home page passes it so the footer melts into it) */
export default function Footer({ divider }) {
  const { content } = useContent();
  const { site, footer, contact } = content;
  const columns = footer.columns || [];
  const bottom = footer.bottomLinks || [];
  const images = (footer.images || []).filter((im) => im.src);
  const social = ((contact && contact.social) || []).filter((s) => s.href);

  // everything below is edited in dashboard → «التذييل»; an empty brand field falls back to «بيانات الموقع»
  const brandName = footer.brandName || site.name;
  const brandSubtitle = footer.brandSubtitle ?? site.subtitle;
  const logo = footer.logo || site.logo || '/logo.png';
  // phone / email: the footer value when the admin set one (empty = hidden), else the site-wide value
  const phone = footer.phone ?? site.phone;
  const email = footer.email ?? site.email;

  const info = [
    footer.address && { id: 'address', icon: 'pin', text: footer.address },
    phone && { id: 'phone', icon: 'phone', text: phone, href: `tel:${phone}`, ltr: true },
    email && { id: 'email', icon: 'mail', text: email, href: `mailto:${email}`, ltr: true },
  ].filter(Boolean);

  return (
    <footer className={`ft ${divider ? 'ft--sd' : ''}`} id="footer">

      <div className="container ft__grid">
        <Reveal direction="up" className="ft-brand">
          <div className="ft-brand__head">
            <span className="ft-brand__logo">
              <img src={logo} alt="" />
            </span>
            <div>
              <strong>{brandName}</strong>
              {brandSubtitle && <span>{brandSubtitle}</span>}
            </div>
          </div>
          {footer.description && <p className="ft-brand__text">{footer.description}</p>}

          {info.length > 0 && (
            <ul className="ft-brand__contact">
              {info.map((row) => (
                <li key={row.id}>
                  <Icon name={row.icon} size={16} />
                  {row.href ? (
                    <a href={row.href} dir={row.ltr ? 'ltr' : undefined}>
                      {row.text}
                    </a>
                  ) : (
                    <span>{row.text}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {images.length > 0 && (
            <ul className="ft-images">
              {images.map((im) => (
                <li key={im.id}>
                  {im.href ? (
                    <SmartLink href={im.href} aria-label={im.alt || undefined}>
                      <img src={im.src} alt={im.alt || ''} loading="lazy" />
                    </SmartLink>
                  ) : (
                    <img src={im.src} alt={im.alt || ''} loading="lazy" />
                  )}
                </li>
              ))}
            </ul>
          )}

          {social.length > 0 && (
            <div className="ft-social">
              {social.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.name} title={s.name}>
                  <Icon name={s.icon} size={17} />
                </a>
              ))}
            </div>
          )}
        </Reveal>

        {columns.map((col, i) => (
          <Reveal key={col.id} direction="up" delay={(i + 1) * 110} className="ft-col">
            <h3 className="ft-col__title">{col.title}</h3>
            <ul>
              {(col.links || []).map((l) => (
                <li key={l.id}>
                  <FooterLink href={l.href} className="ft-link">
                    <Icon name="chevron" size={13} stroke={2.4} />
                    <span>{l.label}</span>
                  </FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="ft__bar">
        <div className="container ft__bar-inner">
          <span>
            © {footer.showYear !== false && `${new Date().getFullYear()} `}
            {footer.text}
          </span>
          {bottom.length > 0 && (
            <nav aria-label="legal">
              {bottom.map((l) => (
                <FooterLink key={l.id} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
