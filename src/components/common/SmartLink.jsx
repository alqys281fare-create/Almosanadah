import { Link, useLocation } from 'react-router-dom';

/*
 * One link component for every href an admin can type:
 *   "/courses"            → client-side route
 *   "#about"              → smooth-scroll on the home page, or "/#about" from other pages
 *   "https://…" / mailto: → normal anchor (external opens in a new tab)
 */
export const isExternal = (href = '') => /^(https?:)?\/\//i.test(href) || /^(mailto|tel|sms|whatsapp):/i.test(href);

export default function SmartLink({ href = '#', children, ...rest }) {
  const { pathname } = useLocation();

  if (isExternal(href)) {
    const web = /^(https?:)?\/\//i.test(href);
    return (
      <a href={href} {...(web ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (href.startsWith('#') && href.length > 1 && pathname !== '/') {
    return (
      <Link to={{ pathname: '/', hash: href }} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
