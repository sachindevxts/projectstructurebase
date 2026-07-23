import { useState } from 'react';
import data from '@/dummyJson/employees/employee-list.json';
import { CapacityBar, PfBadge, PfFilterBar, PfPageHeader } from './shared';
export default function BenchPage() {
  const [search, setSearch] = useState('');
  const rows = data.employees.filter(
    (e) => e.allocation < 100 && e.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
        <PfPageHeader
          title="Bench & Availability"
          subtitle="Monitor available capacity, bench strength, and upcoming releases"
        >
          <button className="pf-button">＋ Create Allocation</button>
        </PfPageHeader>
      </div>
      <div className="pf-stat-grid pf-stat-grid--six">
        {[
          ['12', 'Fully Available'],
          ['18', 'Partially Available'],
          ['14', 'Releasing Soon'],
          ['8', 'Bench >15 Days'],
          ['5', 'Bench >30 Days'],
          ['3', 'Bench >60 Days'],
        ].map(([v, l]) => (
          <article className="pf-stat" key={l}>
            <strong>{v}</strong>
            <p>{l}</p>
          </article>
        ))}
      </div>
      <div className="pf-bench-grid">
        <div>
          <PfFilterBar search={search} setSearch={setSearch}>
            <select>
              <option>All Departments</option>
            </select>
            <select>
              <option>All Skills</option>
            </select>
          </PfFilterBar>
          <section className="pf-card pf-table-card">
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Primary Skills</th>
                    <th>Current Alloc.</th>
                    <th>Available Capacity</th>
                    <th>Bench Days</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr>
                      <td>
                        <strong>{e.name}</strong>
                        <small className="block">{e.id}</small>
                      </td>
                      <td>{e.department}</td>
                      <td>{e.designation}</td>
                      <td>
                        <PfBadge>React.js</PfBadge>
                      </td>
                      <td>
                        <CapacityBar value={e.allocation} />
                      </td>
                      <td className="success">{100 - e.allocation}%</td>
                      <td>{e.allocation === 0 ? '68 days' : '—'}</td>
                      <td>
                        <PfBadge tone={e.allocation === 0 ? 'red' : 'blue'}>
                          {e.allocation === 0 ? 'High Risk' : 'Partially Available'}
                        </PfBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <section className="pf-card pf-bench-chart">
          <h2>Bench by Skills</h2>
          {[
            ['React', 8],
            ['Node', 5],
            ['Java', 4],
            ['Python', 6],
            ['QA', 7],
            ['DevOps', 3],
          ].map(([name, value]) => (
            <div>
              <i style={{ height: `${Number(value) * 28}px` }} />
              <span>{name}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
