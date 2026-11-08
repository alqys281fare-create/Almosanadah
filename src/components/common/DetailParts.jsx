import Icon from './Icons.jsx';

export const MetaChips = ({ items }) => {
  const list = items.filter((x) => x && x.text);
  if (!list.length) return null;
  return (
    <ul className="dp-meta">
      {list.map((m, i) => (
        <li key={i}>
          <Icon name={m.icon} size={14} /> {m.text}
        </li>
      ))}
    </ul>
  );
};

export function Block({ icon, title, children }) {
  return (
    <section className="dp-block">
      <h3 className="dp-block__title">
        <Icon name={icon} size={18} /> {title}
      </h3>
      {children}
    </section>
  );
}

export const Bullets = ({ items }) => (
  <ul className="dp-list">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);

export const Tags = ({ items }) => (
  <ul className="dp-tags">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
);

export const uniq = (arr) => [...new Set(arr.filter(Boolean))];
