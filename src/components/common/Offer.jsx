import Icon from './Icons.jsx';
import SmartLink from './SmartLink.jsx';
import BranchList from './BranchList.jsx';
import { MetaChips } from './DetailParts.jsx';

/* One card of the slider — identical for programs, diplomas and courses. */
export function OfferCard({ icon = 'book', image, badge, tag, title, desc, meta = [], where, onOpen, labels }) {
  return (
    <article className="oc">
      <div className={`oc__media ${image ? 'has-img' : ''}`}>
        {image ? <img src={image} alt="" loading="lazy" draggable="false" /> : <span className="oc__icon"><Icon name={icon} size={40} stroke={1.5} /></span>}
        {badge && <span className="oc__badge">{badge}</span>}
        {tag && <span className="oc__tag">{tag}</span>}
      </div>
      <div className="oc__body">
        <h3 className="oc__title">{title}</h3>
        {desc && <p className="oc__desc">{desc}</p>}
        <MetaChips items={meta} />
        {where && (
          <span className="oc__where">
            <Icon name="pin" size={14} /> {where}
          </span>
        )}
      </div>
      <button type="button" className="btn btn--primary oc__btn" onClick={onOpen}>
        <Icon name="eye" size={16} /> {labels.showDetails}
      </button>
    </article>
  );
}

/*
 * The body of the details window: header, the sections passed as children, the branches where the
 * offering is available, and the call-to-action buttons.
 */
export function OfferDetails({ icon = 'book', image, tag, title, desc, meta = [], children, branchData, regions, labels, registerHref = '/admission', pageHref }) {
  return (
    <div className="od">
      <header className="od__hero">
        <span className={`od__media ${image ? 'has-img' : ''}`}>
          {image ? <img src={image} alt="" /> : <Icon name={icon} size={34} stroke={1.5} />}
        </span>
        <div className="od__head">
          {tag && <span className="od__tag">{tag}</span>}
          <h2 className="od__title">{title}</h2>
          <MetaChips items={meta} />
        </div>
      </header>

      <div className="od__body">
        {desc && (
          <section className="dp-block">
            <h3 className="dp-block__title">
              <Icon name="book" size={18} /> {labels.overview}
            </h3>
            <p className="dp-text">{desc}</p>
          </section>
        )}
        {children}
        <BranchList branches={branchData.branches} total={branchData.total} all={branchData.all} regions={regions} labels={labels} />
      </div>

      <footer className="od__foot">
        {pageHref && (
          <SmartLink href={pageHref} className="btn btn--ghost">
            {labels.openPage}
          </SmartLink>
        )}
        <SmartLink href={registerHref} className="btn btn--primary">
          {labels.register}
        </SmartLink>
      </footer>
    </div>
  );
}
