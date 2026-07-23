import { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '@/dummyJson/projects/project-list.json';
import { PfBadge, Tabs } from './shared';
const items = ['Overview', 'Team', 'Allocations', 'Required Skills', 'Activity History'];
export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const project = data.projects.find((p) => p.id === projectId) ?? data.projects[0];
  const [active, setActive] = useState('Overview');
  return (
    <div className="pf-detail">
      <header className="pf-project-header">
        <div className="pf-project-header__identity">
          <div className="pf-title-line">
            <h1>{project.name}</h1>
            <PfBadge tone="green">{project.status}</PfBadge>
            <span>{project.id}</span>
          </div>
          <div className="pf-project-header__metadata">
            <span>▦ {project.client}</span>
            <span>♟ {project.manager}</span>
            <span>
              ▣ {project.start} – {project.end}
            </span>
            <span>♟ {project.team} members</span>
          </div>
        </div>
        <div className="pf-actions">
          <button type="button" className="pf-button">
            ＋ Add Allocation
          </button>
          <button type="button" className="pf-button pf-button--ghost">
            ✎ Edit
          </button>
          <button
            type="button"
            className="pf-button pf-button--icon"
            aria-label="More project actions"
          >
            ⋮
          </button>
        </div>
      </header>
      <div className="pf-project-kpis">
        {[
          [project.team, 'Team Size'],
          [project.billable, 'Billable'],
          [project.team - project.billable, 'Non-Billable'],
          ['840%', 'Total Alloc.'],
          ['May 1', 'Start Date'],
          ['Aug 15', 'End Date'],
          [12, 'Days Left'],
        ].map(([v, l], index) => (
          <article key={l} className={`pf-project-kpi pf-project-kpi--${index}`}>
            <strong>{v}</strong>
            <span>{l}</span>
          </article>
        ))}
      </div>
      <Tabs items={items} active={active} setActive={setActive} />
      <div className="pf-tab-content">
        {active === 'Overview' && (
          <div className="pf-project-overview">
            <section className="pf-card pf-project-details-card">
              <h2>Project Details</h2>
              <dl className="pf-definition pf-definition--single">
                <dt>Client</dt>
                <dd>NovaBank</dd>
                <dt>Project Manager</dt>
                <dd>Arjun Kapoor</dd>
                <dt>Delivery Manager</dt>
                <dd>Vikram Sharma</dd>
                <dt>Department</dt>
                <dd>Engineering</dd>
                <dt>Billing Model</dt>
                <dd>Time & Materials (T&M)</dd>
                <dt>Priority</dt>
                <dd>
                  <PfBadge tone="red">High</PfBadge>
                </dd>
                <dt>Technology Stack</dt>
                <dd className="pf-project-tags">
                  <PfBadge>React.js</PfBadge>
                  <PfBadge>Node.js</PfBadge>
                  <PfBadge>PostgreSQL</PfBadge>
                  <PfBadge>AWS</PfBadge>
                </dd>
                <dt>Required Skills</dt>
                <dd className="pf-project-tags">
                  <PfBadge>TypeScript</PfBadge>
                  <PfBadge>REST API</PfBadge>
                  <PfBadge>Microservices</PfBadge>
                </dd>
                <dt>Description</dt>
                <dd>
                  Customer-facing banking portal with real-time transaction monitoring, account
                  management, and KYC compliance integration.
                </dd>
              </dl>
            </section>
            <aside className="pf-project-overview__aside">
              <section className="pf-card pf-warning">
                <h2>🔒 Commercial Details</h2>
                <p>You don't have permission to view financial information for this project.</p>
                <a>Request Access</a>
              </section>
              <section className="pf-card">
                <h2>Timeline</h2>
                <dl className="pf-timeline-details">
                  <dt>Started</dt>
                  <dd>May 1, 2025</dd>
                  <dt>Expected End</dt>
                  <dd className="pf-text-warning">Aug 15, 2025</dd>
                  <dt>Duration</dt>
                  <dd>105 days</dd>
                  <dt>Progress</dt>
                  <dd>88%</dd>
                </dl>
                <div className="pf-progress">
                  <i style={{ width: '88%' }} />
                </div>
              </section>
            </aside>
          </div>
        )}
        {active === 'Team' && (
          <section className="pf-card pf-table-card pf-project-team">
            <header className="pf-project-team__header">
              <h2>Team Members (12)</h2>
              <button type="button" className="pf-text-button">
                + Add Member
              </button>
            </header>
            <div className="pf-table-wrap">
              <table className="pf-table pf-project-team__table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Designation</th>
                    <th>Project Role</th>
                    <th>Allocation</th>
                    <th>Billability</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'AM',
                      'Aditi Mehra',
                      'aditi.mehra@acmecorp.com',
                      'Sr. React Dev',
                      'Senior Developer',
                      '70%',
                      'May 1',
                      'Aug 15',
                    ],
                    [
                      'RV',
                      'Rahul Verma',
                      'rahul.verma@acmecorp.com',
                      'Backend Eng.',
                      'Backend Lead',
                      '80%',
                      'May 1',
                      'Aug 15',
                    ],
                    [
                      'PS',
                      'Priya Singh',
                      'priya.singh@acmecorp.com',
                      'QA Lead',
                      'QA Engineer',
                      '60%',
                      'May 15',
                      'Aug 15',
                    ],
                  ].map((member, index) => (
                    <tr key={member[1]}>
                      <td>
                        <span className={`pf-team-member pf-team-member--${index}`}>
                          <i>{member[0]}</i>
                          <span>
                            <strong>{member[1]}</strong>
                            <small>{member[2]}</small>
                          </span>
                        </span>
                      </td>
                      <td>{member[3]}</td>
                      <td>{member[4]}</td>
                      <td className="pf-project-team__allocation">{member[5]}</td>
                      <td>
                        <PfBadge>Billable</PfBadge>
                      </td>
                      <td>{member[6]}</td>
                      <td className={index === 0 ? 'pf-text-warning' : ''}>{member[7]}</td>
                      <td>
                        <PfBadge tone="green">Active</PfBadge>
                      </td>
                      <td>
                        <span className="pf-team-actions">
                          <button aria-label={`Transfer ${member[1]}`}>↔</button>
                          <button className="warning" aria-label={`Review ${member[1]}`}>
                            ⓘ
                          </button>
                          <button aria-label={`More actions for ${member[1]}`}>⋮</button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}{' '}
        {active === 'Allocations' && (
          <section className="pf-card pf-table-card pf-skill-coverage">
            <div className="pf-table-wrap">
              <table className="pf-table pf-skill-coverage__table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Required Level</th>
                    <th>Resources Needed</th>
                    <th>Filled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      skill: 'React.js',
                      level: 'Advanced',
                      needed: 3,
                      filled: '3 / 3',
                      status: 'Filled',
                      tone: 'green',
                    },
                    {
                      skill: 'Node.js',
                      level: 'Intermediate',
                      needed: 2,
                      filled: '2 / 2',
                      status: 'Filled',
                      tone: 'green',
                    },
                    {
                      skill: 'QA / Automation',
                      level: 'Intermediate',
                      needed: 2,
                      filled: '1 / 2',
                      status: 'Partial',
                      tone: 'orange',
                    },
                    {
                      skill: 'DevOps / AWS',
                      level: 'Advanced',
                      needed: 1,
                      filled: '0 / 1',
                      status: 'Unfilled',
                      tone: 'red',
                    },
                  ].map((item) => (
                    <tr key={item.skill}>
                      <td>{item.skill}</td>
                      <td>
                        <PfBadge tone={item.level === 'Advanced' ? 'blue' : 'orange'}>
                          {item.level}
                        </PfBadge>
                      </td>
                      <td>{item.needed}</td>
                      <td
                        className={`pf-skill-coverage__filled pf-skill-coverage__filled--${item.tone}`}
                      >
                        {item.filled}
                      </td>
                      <td>
                        <PfBadge tone={item.tone}>{item.status}</PfBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}{' '}
        {active === 'Required Skills' && (
          <p className="pf-empty-copy">
            Allocation history timeline — switch to Team tab to see current allocations.
          </p>
        )}
        {active === 'Activity History' && (
          <p className="pf-empty-copy">Activity history for this project will appear here.</p>
        )}
      </div>
    </div>
  );
}
function ProjectTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
                {row.map((c) => (
                  <td key={c}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
