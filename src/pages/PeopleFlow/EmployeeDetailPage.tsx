import { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '@/dummyJson/employees/employee-list.json';
import { CapacityBar, PfBadge, Tabs } from './shared';
const tabs = [
  'Overview',
  'Employment',
  'Skills',
  'Current Projects',
  'Allocation History',
  'Documents',
  'Audit History',
];
export default function EmployeeDetailPage() {
  const { employeeId } = useParams();
  const employee = data.employees.find((item) => item.id === employeeId) ?? data.employees[0];
  const [active, setActive] = useState('Overview');
  return (
    <div className="pf-detail">
      <header className="pf-profile">
        <span className="pf-profile__avatar" aria-label={`${employee.name} profile photo`}>
          AM
          <i />
        </span>
        <div className="pf-profile__body">
          <div className="pf-title-line">
            <h1>{employee.name}</h1>
            <PfBadge tone="green">Active</PfBadge>
            <PfBadge>Billable</PfBadge>
            <span>{employee.id}</span>
          </div>
          <div className="pf-profile__metadata">
            <span>▣ {employee.designation}</span>
            <span>♟ {employee.department}</span>
            <span>⌖ Bangalore, India</span>
            <span>✉ {employee.email}</span>
          </div>
          <div className="pf-profile__allocation">
            <b>Allocation: {employee.allocation}%</b>
            <CapacityBar value={employee.allocation} />
            <span className="pf-allocation-legend pf-allocation-legend--primary">NovaBank 70%</span>
            <span className="pf-allocation-legend pf-allocation-legend--secondary">
              Internal 30%
            </span>
          </div>
        </div>
        <div className="pf-actions">
          <button type="button" className="pf-button pf-button--ghost">
            ↗ Allocations
          </button>
          <button type="button" className="pf-button">
            ✎ Edit
          </button>
          <button
            type="button"
            className="pf-button pf-button--icon"
            aria-label="More employee actions"
          >
            ⋮
          </button>
        </div>
      </header>
      <Tabs items={tabs} active={active} setActive={setActive} />
      <div className="pf-tab-content">
        {active === 'Overview' && (
          <div className="pf-employee-overview">
            <div className="pf-employee-overview__main">
              <section className="pf-card pf-overview-card">
                <h2>Employment Summary</h2>
                <dl className="pf-definition">
                  <dt>Employee ID</dt>
                  <dd>{employee.id}</dd>
                  <dt>Department</dt>
                  <dd>{employee.department}</dd>
                  <dt>Designation</dt>
                  <dd>{employee.designation}</dd>
                  <dt>Reporting Manager</dt>
                  <dd>Arjun Kapoor</dd>
                  <dt>Employment Type</dt>
                  <dd>{employee.type}</dd>
                  <dt>Work Mode</dt>
                  <dd>Hybrid</dd>
                  <dt>Joining Date</dt>
                  <dd>{employee.joined}</dd>
                  <dt>Experience</dt>
                  <dd>5 years 2 months</dd>
                </dl>
              </section>
              <section className="pf-card pf-overview-card">
                <div className="pf-overview-card__heading">
                  <h2>Current Allocation</h2>
                  <button type="button" className="pf-text-button">
                    + Add Allocation
                  </button>
                </div>
                <div className="pf-allocation-card">
                  <div>
                    <strong>NovaBank Customer Portal</strong>
                    <p>
                      NovaBank · Senior Developer · <PfBadge>Billable</PfBadge>
                    </p>
                    <small>May 1 – Aug 15, 2025</small>
                  </div>
                  <div className="pf-allocation-card__value">
                    <b>70%</b>
                    <small>Allocation</small>
                  </div>
                </div>
                <div className="pf-allocation-card">
                  <div>
                    <strong>Internal HR Automation</strong>
                    <p>
                      Internal · Tech Lead · <PfBadge tone="neutral">Non-Billable</PfBadge>
                    </p>
                    <small>Jan 1 – Dec 31, 2025</small>
                  </div>
                  <div className="pf-allocation-card__value">
                    <b>30%</b>
                    <small>Allocation</small>
                  </div>
                </div>
              </section>
            </div>
            <aside className="pf-employee-overview__aside">
              <section className="pf-card pf-capacity-ring">
                <h2>Capacity</h2>
                <div className="pf-ring">
                  <strong>{employee.allocation}%</strong>
                  <small>Allocated</small>
                </div>
                <p>{Math.max(0, 100 - employee.allocation)}% available capacity</p>
              </section>
              <section className="pf-card pf-overview-card">
                <h2>Important Dates</h2>
                <dl className="pf-side-definition">
                  <dt>Joined</dt>
                  <dd>{employee.joined}</dd>
                  <dt>Probation End</dt>
                  <dd>Jul 12, 2022</dd>
                  <dt>Next Release</dt>
                  <dd className="pf-text-warning">Aug 15, 2025</dd>
                </dl>
              </section>
              <section className="pf-card pf-overview-card">
                <h2>Contact</h2>
                <div className="pf-contact-list">
                  <a href={`mailto:${employee.email}`}>✉ {employee.email}</a>
                  <a href="tel:+919876543210">☎ +91 98765 43210</a>
                  <a href="https://linkedin.com/in/aditi">▣ linkedin.com/in/aditi</a>
                </div>
              </section>
            </aside>
          </div>
        )}
        {active === 'Employment' && (
          <section className="pf-card pf-narrow">
            <h2>Employment Details</h2>
            <dl className="pf-definition pf-definition--single">
              <dt>Department</dt>
              <dd>{employee.department}</dd>
              <dt>Designation</dt>
              <dd>{employee.designation}</dd>
              <dt>Reporting Manager</dt>
              <dd>Arjun Kapoor</dd>
              <dt>Employment Type</dt>
              <dd>{employee.type}</dd>
              <dt>Work Mode</dt>
              <dd>Hybrid</dd>
              <dt>Notice Period</dt>
              <dd>60 days</dd>
            </dl>
          </section>
        )}
        {active === 'Skills' && (
          <section className="pf-card pf-skills-card">
            <div className="pf-skills-card__header">
              <h2>Skills &amp; Expertise</h2>
              <button type="button" className="pf-text-button">
                + Add Skill
              </button>
            </div>
            <div className="pf-skills-group">
              <h3>Primary Skill</h3>
              <div className="pf-skill-row">
                <PfBadge>React.js</PfBadge>
                <PfBadge>Advanced</PfBadge>
                <span>4 years exp.</span>
                <PfBadge tone="green">✓ Verified</PfBadge>
              </div>
            </div>
            <div className="pf-skills-group">
              <h3>Secondary Skills</h3>
              <div className="pf-secondary-skills">
                {[
                  { name: 'TypeScript', level: 'Advanced', experience: '3 yrs', tone: 'green' },
                  { name: 'Redux', level: 'Intermediate', experience: '2 yrs', tone: 'orange' },
                  { name: 'Tailwind CSS', level: 'Advanced', experience: '2 yrs', tone: 'blue' },
                  { name: 'Node.js', level: 'Intermediate', experience: '1 yr', tone: 'orange' },
                ].map((skill) => (
                  <div className="pf-skill-row pf-skill-row--secondary" key={skill.name}>
                    <PfBadge tone="green">{skill.name}</PfBadge>
                    <PfBadge tone={skill.tone}>{skill.level}</PfBadge>
                    <span>{skill.experience}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {active === 'Current Projects' && (
          <section className="pf-card pf-table-card pf-current-projects">
            <div className="pf-table-wrap">
              <table className="pf-table pf-current-projects__table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Role</th>
                    <th>Allocation</th>
                    <th>Billability</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>NovaBank Customer Portal</td>
                    <td>NovaBank</td>
                    <td>Senior Developer</td>
                    <td className="pf-current-projects__allocation">70%</td>
                    <td>
                      <PfBadge>Billable</PfBadge>
                    </td>
                    <td>May 1, 2025</td>
                    <td className="pf-current-projects__release">Aug 15, 2025</td>
                    <td>
                      <PfBadge tone="green">Active</PfBadge>
                    </td>
                  </tr>
                  <tr>
                    <td>Internal HR Automation</td>
                    <td>Internal</td>
                    <td>Tech Lead</td>
                    <td className="pf-current-projects__allocation">30%</td>
                    <td>
                      <PfBadge tone="slate">Non-Billable</PfBadge>
                    </td>
                    <td>Jan 1, 2025</td>
                    <td>Dec 31, 2025</td>
                    <td>
                      <PfBadge tone="green">Active</PfBadge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}{' '}
        {active === 'Allocation History' && (
          <SimpleRows
            headers={['Project', 'Role', 'Allocation', 'Start', 'End', 'Release Reason']}
            rows={[
              [
                'BrightRetail Commerce',
                'Frontend Dev',
                '80%',
                'Jan 1, 2024',
                'Apr 30, 2025',
                'Project Completed',
              ],
              [
                'UrbanFleet Dashboard',
                'React Developer',
                '100%',
                'Mar 1, 2022',
                'Dec 31, 2023',
                'Contract End',
              ],
            ]}
          />
        )}{' '}
        {active === 'Documents' && (
          <section className="pf-card pf-documents-card">
            <h2>Documents</h2>
            <div className="pf-documents-list">
              <article className="pf-document">
                <span className="pf-document__icon pf-document__icon--pdf">PDF</span>
                <div className="pf-document__details">
                  <strong>Resume_AditiMehra.pdf</strong>
                  <small>Uploaded Jan 12, 2022</small>
                </div>
                <button type="button">Download</button>
              </article>
              <article className="pf-document">
                <span className="pf-document__icon pf-document__icon--word">W</span>
                <div className="pf-document__details">
                  <strong>Offer_Letter.docx</strong>
                  <small>Uploaded Jan 12, 2022</small>
                </div>
                <button type="button">Download</button>
              </article>
            </div>
            <div className="pf-documents-placeholder">
              <span aria-hidden="true">✚</span>
              <p>Full document management will be available in a future update.</p>
            </div>
          </section>
        )}{' '}
        {active === 'Audit History' && (
          <section className="pf-card pf-table-card pf-audit-history">
            <div className="pf-table-wrap">
              <table className="pf-table pf-audit-history__table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Action</th>
                    <th>Field</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                    <th>Changed By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jul 10, 2025 · 14:32</td>
                    <td>
                      <PfBadge>Updated</PfBadge>
                    </td>
                    <td>Designation</td>
                    <td>React Developer</td>
                    <td className="pf-audit-history__new-value">Senior React Developer</td>
                    <td>Arjun Kapoor</td>
                  </tr>
                  <tr>
                    <td>Jan 12, 2022 · 09:00</td>
                    <td>
                      <PfBadge tone="green">Created</PfBadge>
                    </td>
                    <td>Employee Record</td>
                    <td>—</td>
                    <td className="pf-audit-history__created-value">Employee Added</td>
                    <td>HR System</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
function SimpleRows({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <section className="pf-card pf-table-card">
      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
