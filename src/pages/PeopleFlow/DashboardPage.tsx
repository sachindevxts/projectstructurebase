import dashboard from '@/dummyJson/dashboard/dashboard.json';
import employees from '@/dummyJson/employees/employee-list.json';
import { PfBadge, PfPageHeader } from './shared';
export default function DashboardPage() {
  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
        <PfPageHeader title="Dashboard" subtitle="Organization overview · July 15, 2025">
          <button className="pf-button">Export report</button>
        </PfPageHeader>
      </div>
      <div className="pf-stat-grid">
        {dashboard.stats.map((stat) => (
          <article className="pf-stat" key={stat.label}>
            <span className={`pf-stat__icon pf-stat__icon--${stat.tone}`}>↗</span>
            <strong>{stat.value}</strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>
      <div className="pf-dashboard-grid">
        <section className="pf-card pf-chart">
          <h2>Billable vs Non-Billable</h2>
          <div className="pf-donut">
            <span>
              73%<small>Billable</small>
            </span>
          </div>
        </section>
        <section className="pf-card">
          <h2>Employees by Department</h2>
          {[
            ['Engineering', 82],
            ['Delivery', 68],
            ['QA', 34],
            ['Design', 24],
            ['HR', 18],
          ].map(([label, value]) => (
            <div className="pf-bar" key={label}>
              <label>{label}</label>
              <span>
                <i style={{ width: `${value}%` }} />
              </span>
            </div>
          ))}
        </section>
        <section className="pf-card pf-chart">
          <h2>Allocation Distribution</h2>
          <div className="pf-donut pf-donut--green">
            <span>
              231<small>Active</small>
            </span>
          </div>
        </section>
        <section className="pf-card pf-span-2">
          <h2>Upcoming Releases</h2>
          {employees.employees.slice(0, 4).map((employee) => (
            <div className="pf-list-row" key={employee.id}>
              <span className="pf-avatar">{employee.name.slice(0, 1)}</span>
              <strong>{employee.name}</strong>
              <span>{employee.designation}</span>
              <PfBadge tone="orange">Aug 15</PfBadge>
            </div>
          ))}
        </section>
        <section className="pf-card">
          <h2>Overallocated Employees</h2>
          {employees.employees
            .filter((e) => e.allocation > 100)
            .map((employee) => (
              <div className="pf-list-row" key={employee.id}>
                <strong>{employee.name}</strong>
                <PfBadge tone="red">{employee.allocation}%</PfBadge>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}
