import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PfBadge, PfPageHeader } from './shared';
import allocationData from '@/dummyJson/allocations/allocation-list.json';

const allocationRows = allocationData.allocations;

export default function AllocationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const rows = useMemo(
    () =>
      allocationRows.filter((row) =>
        `${row.employee} ${row.project}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="pf-page ">
    <div className="pf-planner-toolbar">
      <PfPageHeader
        title="Resource Allocations"
        subtitle="Manage all active and planned employee project assignments"
      >
        <button
          className="pf-button pf-button--ghost"
          onClick={() => navigate('/resource-planner')}
        >
          ▣ Planner
        </button>
        <button className="pf-button pf-button--ghost">⇩ Export</button>
        <button className="pf-button" onClick={() => navigate('/allocations/new')}>
          ＋ Add Allocation
        </button>
      </PfPageHeader>
</div>
      <section className="pf-card pf-allocation-filters">
        <label className="pf-allocation-filters__search">
          <span className="sr-only">Search employee or project</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="⌕  Employee or project..."
          />
        </label>
        <label>
          <span>Project</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>Billability</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <button type="button" onClick={() => setSearch('')}>
          Clear
        </button>
      </section>

      <section className="pf-card pf-table-card pf-allocations-table-card">
        <div className="pf-table-wrap">
          <table className="pf-table pf-allocations-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Project</th>
                <th>Role</th>
                <th>Start</th>
                <th>End</th>
                <th>Alloc %</th>
                <th>Capacity</th>
                <th>Billability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const danger = row.status === 'Overallocated';
                return (
                  <tr key={`${row.employee}-${row.project}`}>
                    <td>
                      <span className="pf-allocation-person">
                        <i>
                          {row.employee
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </i>
                        <strong>{row.employee}</strong>
                      </span>
                    </td>
                    <td>{row.project}</td>
                    <td>{row.role}</td>
                    <td>{row.start}</td>
                    <td
                      className={
                        row.status === 'Releasing Soon' || index === 0 ? 'pf-text-warning' : ''
                      }
                    >
                      {row.end}
                    </td>
                    <td>
                      <div className={`pf-allocation-meter${danger ? ' danger' : ''}`}>
                        <b>
                          {row.allocation}%{danger ? ' ⚠' : ''}
                        </b>
                        <span>
                          <i style={{ width: `${Math.min(row.allocation, 100)}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className={danger ? 'danger' : ''}>{row.capacity}</td>
                    <td>
                      <PfBadge tone={row.billability === 'Billable' ? 'blue' : 'slate'}>
                        {row.billability}
                      </PfBadge>
                    </td>
                    <td>
                      <PfBadge
                        tone={danger ? 'red' : row.status === 'Releasing Soon' ? 'orange' : 'green'}
                      >
                        {row.status}
                      </PfBadge>
                    </td>
                    <td>
                      <span className="pf-allocation-actions">
                        <button>Edit</button>
                        <button>Extend</button>
                        <button className="release">Release</button>
                        <button aria-label={`More actions for ${row.employee}`}>⋮</button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer className="data-table-pagination">
          <p>
            Showing <strong>1–{rows.length}</strong> of <strong>84</strong> allocations
          </p>
          <label>
            Rows:
            <select defaultValue="5">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </label>
          <nav aria-label="Table pagination">
            <button disabled>‹</button>
            <button aria-current="page">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </nav>
        </footer>
      </section>
    </div>
  );
}
