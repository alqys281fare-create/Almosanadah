import { useMemo, useState } from 'react';
import Icon from './Icons.jsx';
import { groupByRegion } from '../../Utils/branches.js';

/*
 * «Where is it offered?» — the branches of one program / course.
 *   branches  the branch objects where it is offered      total  how many branches exist
 *   all       true when it is offered everywhere          regions  content.branches.regions
 */
export default function BranchList({ branches, total, all, regions, labels }) {
  const [region, setRegion] = useState('all');
  const groups = useMemo(() => groupByRegion(branches, regions), [branches, regions]);
  const shown = region === 'all' ? branches : groups.find((g) => String(g.id) === String(region))?.branches || [];

  return (
    <section className="bl" aria-label={labels.branches}>
      <div className="bl__head">
        <h3 className="bl__title">
          <Icon name="pin" size={20} /> {labels.branches}
        </h3>
        <span className={`bl__badge ${all ? 'is-all' : ''}`}>
          {all ? `${labels.allBranches} (${total})` : `${branches.length} ${labels.branchWord}`}
        </span>
      </div>

      {branches.length === 0 ? (
        <p className="bl__empty">{labels.noBranches}</p>
      ) : (
        <>
          {groups.length > 1 && (
            <div className="bl__chips" role="group" aria-label={labels.branchesHint}>
              <button type="button" className={`bl__chip ${region === 'all' ? 'is-active' : ''}`} onClick={() => setRegion('all')}>
                {labels.allRegions} <b>{branches.length}</b>
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`bl__chip ${String(region) === String(g.id) ? 'is-active' : ''}`}
                  onClick={() => setRegion(g.id)}
                >
                  {g.label || '—'} <b>{g.branches.length}</b>
                </button>
              ))}
            </div>
          )}

          <ul className="bl__grid">
            {shown.map((b) => (
              <li key={b.id} className="bl__card">
                <strong className="bl__name">
                  <Icon name="building" size={16} /> {b.name}
                </strong>
                {b.address && <span className="bl__line">{b.address}</span>}
                {b.hours && (
                  <span className="bl__line">
                    <Icon name="clock" size={13} /> {b.hours}
                  </span>
                )}
                <span className="bl__actions">
                  {b.phone && (
                    <a href={`tel:${b.phone}`} dir="ltr">
                      <Icon name="phone" size={13} /> {b.phone}
                    </a>
                  )}
                  {b.mapUrl && (
                    <a href={b.mapUrl} target="_blank" rel="noreferrer noopener">
                      <Icon name="pin" size={13} /> {labels.openMap}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
