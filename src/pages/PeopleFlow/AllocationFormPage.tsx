import { useState } from 'react';
import employees from '@/dummyJson/employees/employee-list.json';
import { PfBadge, PfPageHeader } from './shared';
export default function AllocationFormPage() {
  const [selected, setSelected] = useState(employees.employees[0]);
  const [percentage, setPercentage] = useState(30);
  const total = selected.allocation + percentage;
  return (
    <div className="pf-page pf-page--with-footer">
      <PfPageHeader
        title="Create Allocation"
        subtitle="Assign an employee to a project with capacity and billability configuration."
      />
      {total > 100 && (
        <section className="pf-overallocation">
          <strong>▲　Over-allocation Detected</strong>
          <p>
            This allocation will result in <b>{total}% total allocation</b> for {selected.name}.
            Authorized users may override with a mandatory reason.
          </p>
          <label>
            <input type="checkbox" /> I understand and want to override this allocation
          </label>
        </section>
      )}
      <div className="pf-two-column">
        <section className="pf-card pf-employee-selector">
          <h2>Select Employee</h2>
          <input
            className="pf-employee-selector__search"
            placeholder="⌕  Search by name, skill, designation…"
          />
          <div className="pf-employee-selector__filters">
            <select>
              <option>All Skills</option>
            </select>
            <select>
              <option>All Dept.</option>
            </select>
            <select>
              <option>Availability</option>
            </select>
          </div>
          <div className="pf-employee-selector__list">
            {employees.employees
              .filter((e) => ['Aditi Mehra', 'Meera Nair', 'Amit Dubey'].includes(e.name))
              .map((e, index) => (
                <button
                  className={`pf-employee-option ${selected.id === e.id ? 'active' : ''}`}
                  key={e.id}
                  onClick={() => setSelected(e)}
                >
                  <span className={`pf-avatar pf-avatar--${index}`}>
                    {e.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  <span className="pf-employee-option__body">
                    <span className="pf-employee-option__title">
                      <strong>{e.name}</strong>
                      <PfBadge tone={index === 2 ? 'slate' : 'blue'}>
                        {index === 2 ? 'Non-Billable' : 'Billable'}
                      </PfBadge>
                      <b>
                        {Math.max(0, 100 - e.allocation)}%<small>Available</small>
                      </b>
                    </span>
                    <small>
                      {e.designation} · {e.department}
                    </small>
                    <span className="pf-employee-option__skills">
                      <PfBadge>{index === 2 ? 'Java' : 'React.js'}</PfBadge>
                      <PfBadge>
                        {index === 0 ? 'TypeScript' : index === 1 ? 'Next.js' : 'Spring Boot'}
                      </PfBadge>
                    </span>
                    <span className="pf-employee-option__bar">
                      <i style={{ width: `${e.allocation}%` }} />
                    </span>
                    <small>
                      {index === 0
                        ? 'NovaBank 70% · Internal 30% = 100% allocated'
                        : index === 1
                          ? 'HealthBridge 50% · Available 50%'
                          : 'No active allocation'}
                    </small>
                  </span>
                </button>
              ))}
          </div>
        </section>
        <div className="pf-allocation-form__right">
          <section className="pf-card">
            <h2>Project</h2>
            <div className="pf-selected-project">
              <div>
                <strong>NovaBank Customer Portal</strong>
                <p>NovaBank · PM: Arjun Kapoor · Active</p>
                <small>May 1 – Aug 15, 2025 · 12 members</small>
              </div>
              <b>✓</b>
            </div>
          </section>
          <section className="pf-card">
            <h2>Allocation Details</h2>
            <div className="pf-form-grid">
              <label>
                Project Role *
                <select>
                  <option>Senior Developer</option>
                </select>
              </label>
              <label>
                Allocation % *
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                />
              </label>
              <label>
                Start Date *<input type="date" defaultValue="2025-07-15" />
              </label>
              <label>
                End Date *<input type="date" defaultValue="2025-08-15" />
              </label>
              <label>
                Billability
                <select>
                  <option>Billable</option>
                </select>
              </label>
              <label>
                Hours/Week
                <input value={Math.round(percentage * 0.8)} readOnly />
              </label>
              <label className="wide">
                Notes
                <textarea placeholder="Optional allocation notes…" />
              </label>
            </div>
          </section>
          {total > 100 && (
            <section className="pf-card pf-overallocation pf-override-panel">
              <h2>▲　Override Required</h2>
              <p>
                This employee will be at {total}% allocation. Please provide a mandatory reason to
                proceed.
              </p>
              <label>
                Override Reason *
                <textarea placeholder="Explain why over-allocation is necessary…" />
              </label>
              <small>ⓘ This override will be recorded in the audit log.</small>
            </section>
          )}
        </div>
      </div>
      <section className="pf-card pf-capacity-preview">
        <h2>Live Capacity Preview — {selected.name}</h2>
        <div>
          <strong>
            {selected.allocation}%<small>Current Alloc.</small>
          </strong>
          <strong>
            {percentage}%<small>Requested</small>
          </strong>
          <strong className="danger">
            {total}%<small>Resulting Alloc.</small>
          </strong>
          <strong className="danger">
            {100 - total}%<small>Over Capacity</small>
          </strong>
        </div>
        <div className="pf-capacity-preview__bar">
          <i />
          <i />
          <i />
        </div>
        <div className="pf-capacity-preview__legend">
          <span>NovaBank 70%</span>
          <span>Internal 30%</span>
          <span>New NovaBank Portal 30%</span>
        </div>
      </section>
      <footer className="pf-sticky-footer">
        <span className={total > 100 ? 'danger' : ''}>
          ⚠{' '}
          {total > 100
            ? `Over-allocation: ${total}% — Override required to save.`
            : 'Allocation is within capacity.'}
        </span>
        <button className="pf-button pf-button--ghost">Cancel</button>
        <button className="pf-button pf-button--ghost">Validate Only</button>
        <button className="pf-button">Create Allocation</button>
      </footer>
    </div>
  );
}
