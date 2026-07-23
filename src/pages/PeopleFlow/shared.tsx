import type { ReactNode } from 'react';

export function PfPageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="pf-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="pf-actions">{children}</div>
    </header>
  );
}
export function PfBadge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return <span className={`pf-badge pf-badge--${tone}`}>{children}</span>;
}
export function PfFilterBar({
  search,
  setSearch,
  children,
}: {
  search: string;
  setSearch: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <section className="pf-filter">
      <input
        aria-label="Search"
        placeholder="Search name, project or ID…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {children}
      <button type="button" className="pf-link" onClick={() => setSearch('')}>
        Clear
      </button>
    </section>
  );
}
export function CapacityBar({ value }: { value: number }) {
  return (
    <div className="pf-capacity">
      {/* <strong className={value > 100 ? 'danger' : ''}>{value}%</strong> */}
      <span>
        <i style={{ width: `${Math.min(value, 100)}%` }} className={value > 100 ? 'danger' : ''} />
      </span>
    </div>
  );
}
export function Tabs({
  items,
  active,
  setActive,
}: {
  items: string[];
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <div className="pf-tabs">
      {items.map((item) => (
        <button
          key={item}
          className={active === item ? 'active' : ''}
          onClick={() => setActive(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
