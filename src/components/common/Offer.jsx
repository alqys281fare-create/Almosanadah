import Icon from './Icons.jsx';
import SmartLink from './SmartLink.jsx';
import BranchList from './BranchList.jsx';
import { MetaChips } from './DetailParts.jsx';

/* Normalize a value (array | string | object) into a clean list of strings. */
function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value && typeof value === 'object') return Object.values(value).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/* One card of the slider — identical for programs, diplomas and courses. */
export function OfferCard({
  icon = 'book',
  image,
  goals,
  badge,
  tag,
  title,
  desc,
  meta = [],
  where,
  onOpen,
  labels,
}) {
  const objectiveItems = toList(goals);
  console.log(objectiveItems)

  return (
    <article className="oc">
      <div className={`oc__media ${image ? 'has-img' : ''}`}>
      
          <img src={image} alt="" loading="lazy" draggable="false" />
       
        {tag && <span className="oc__tag">{tag}</span>}
      </div>

      <div className="oc__body">
        <h3 className="oc__title">{title}</h3>

        {desc && <p className="oc__desc">{desc}</p>}

        {objectiveItems.length > 0 && (
          <ul className="oc__objectives">
            {objectiveItems.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}

        <MetaChips items={meta} />
      </div>

      <button
        type="button"
        className="btn btn--primary oc__btn"
        onClick={onOpen}
      >
        <Icon name="eye" size={16} /> {labels.showDetails}
      </button>
    </article>
  );
}

/*
 * The body of the details window: header, the sections passed as children, the branches where the
 * offering is available, and the call-to-action buttons.
 */
export function OfferDetails({
  icon = 'book',
  image,
  tag,
  title,
  desc,
  meta = [],
  children,
  branchData,
  regions,
  labels,
  registerHref = '/admission',
  pageHref,
}) {
  return (
    <div className="od">
      <header className="od__hero">
        <span className={`od__media ${image ? 'has-img' : ''}`}>
          {image ? (
            <img src={image} alt="" />
          ) : (
            <Icon name={icon} size={34} stroke={1.5} />
          )}
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
        <BranchList
          branches={branchData.branches}
          total={branchData.total}
          all={branchData.all}
          regions={regions}
          labels={labels}
        />
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