/*
 * Branch availability helpers (shared by the courses page and the programs catalog).
 *
 * Every offering (a course in content.courses.items, or a diploma / course type in content.catalog) may carry:
 *   branchMode: 'all' | 'selected'     (missing → 'all', so content saved by older versions keeps working)
 *   branchIds : [branch id, …]          (only read when branchMode === 'selected')
 *
 * Branch ids come from content.branches.items. Ids that no longer exist (a deleted branch) are ignored.
 */
import { sameId } from './catalog.js';

export const isAllBranches = (item) => (item?.branchMode || 'all') !== 'selected';

/** The branch objects where `item` is offered, in the order of the branches page. */
export function branchesFor(item, branches = []) {
  if (isAllBranches(item)) return branches;
  const ids = Array.isArray(item?.branchIds) ? item.branchIds : [];
  return branches.filter((b) => ids.some((id) => sameId(id, b.id)));
}

/** Groups branches by region → [{ id, label, branches }] (regions without branches are dropped). */
export function groupByRegion(branches = [], regions = []) {
  const known = new Set(regions.map((r) => String(r.id)));
  const groups = regions
    .map((r) => ({ id: r.id, label: r.label, branches: branches.filter((b) => sameId(b.region, r.id)) }))
    .filter((g) => g.branches.length);
  const rest = branches.filter((b) => !known.has(String(b.region)));
  if (rest.length) groups.push({ id: '__other', label: '', branches: rest });
  return groups;
}

/** Copies the availability of `from` items onto `to` items with the same id (keeps both languages in sync). */
export function syncAvailability(from = [], to = []) {
  const byId = new Map(from.map((x) => [String(x.id), x]));
  return to.map((x) => {
    const src = byId.get(String(x.id));
    if (!src) return x;
    return { ...x, branchMode: src.branchMode || 'all', branchIds: Array.isArray(src.branchIds) ? src.branchIds : [] };
  });
}
