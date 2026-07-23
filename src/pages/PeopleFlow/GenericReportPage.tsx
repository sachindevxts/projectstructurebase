import { useLocation } from 'react-router-dom';
import { PfFilterBar, PfPageHeader } from './shared';
import { useState } from 'react';
export default function GenericReportPage() {
  const [search, setSearch] = useState('');
  const part = useLocation().pathname.split('/').filter(Boolean).pop() ?? 'employees';
  const title = part
    .split('-')
    .map((v) => v[0].toUpperCase() + v.slice(1))
    .join(' ');
  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
      <PfPageHeader
        title={`${title} Report`}
        subtitle="Workforce insight and operational reporting"
      >
        <button className="pf-button pf-button--ghost">⇩ Export</button>
      </PfPageHeader>
      </div>
      <PfFilterBar search={search} setSearch={setSearch}>
        <input type="date" />
        <select>
          <option>All Departments</option>
        </select>
      </PfFilterBar>
      <div className="pf-stat-grid">
        {[
          ['247', 'Employees'],
          ['84%', 'Utilization'],
          ['18', 'Active Projects'],
          ['33', 'Available'],
        ].map(([v, l]) => (
          <article className="pf-stat">
            <strong>{v}</strong>
            <p>{l}</p>
          </article>
        ))}
      </div>
      <section className="pf-card pf-report-chart">
        <h2>{title} Overview</h2>
        {[82, 68, 45, 74, 56, 90, 61].map((v, i) => (
          <i style={{ height: `${v * 2.4}px` }} key={i} />
        ))}
      </section>
    </div>
  );
}
