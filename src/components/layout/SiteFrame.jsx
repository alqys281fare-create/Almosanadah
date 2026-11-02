import { Children } from 'react';
import AdRail, { AdStrip } from './AdRail.jsx';
import Footer from './Footer.jsx';
import ScrollProgress from '../common/ScrollProgress.jsx';

/*
 * Page frame. On screens >= 1600px the page content is a centred column and the two empty strips on
 * its sides hold the advertisement posters (two per side, see AdRail / design.css) — they sit in their
 * own grid columns, so they can never overlap the content.
 * On smaller screens (laptops, tablets, phones) the rails disappear and the same four posters are shown
 * in a responsive grid (<AdStrip />) just above the footer.
 */
export default function SiteFrame({ children }) {
  // the strip goes right before the footer, which every page renders as its last child
  const kids = Children.toArray(children);
  const last = kids[kids.length - 1];
  const hasFooter = last && last.type === Footer;
  const body = hasFooter ? kids.slice(0, -1) : kids;

  return (
    <div className="site-frame">
      <ScrollProgress />
      <AdRail side="left" />
      <div className="site-main">
        {body}
        <AdStrip />
        {hasFooter ? last : null}
      </div>
      <AdRail side="right" />
    </div>
  );
}
