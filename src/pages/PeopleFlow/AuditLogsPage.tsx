import { useState } from 'react';
import data from '@/dummyJson/auditLogs/audit-log-list.json';
import type { AuditItem } from '@/types/dummy/peopleflow.types';
import { Drawer } from '@/components/common/primitives';
import { PfBadge, PfPageHeader } from './shared';
const auditRows: AuditItem[] = [
  ...(data.logs.slice(0, 3) as AuditItem[]),
  {
    id: 'PRJ-003',
    date: 'Jul 13, 2025 · 16:22:33',
    user: 'Arjun Kapoor',
    entity: 'Project',
    action: 'Status Change',
    summary: 'Changed project status for HealthBridge Mobile from Active to At Risk',
    reason: 'Resource shortage and timeline slippage',
  },
  {
    id: 'EMP-013',
    date: 'Jul 12, 2025 · 10:00:00',
    user: 'Vikram Sharma',
    entity: 'Employee',
    action: 'Created',
    summary: 'Added new employee Meera Nair to Engineering dept.',
    reason: 'New hire onboarding',
  },
  {
    id: 'ROLE-003',
    date: 'Jul 10, 2025 · 14:55:21',
    user: 'Arjun Kapoor',
    entity: 'Role',
    action: 'Updated',
    summary: 'Updated permission matrix for Resource Manager role — enabled Override permission',
    reason: 'Operational requirement',
  },
];
export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AuditItem | null>(null);
  const rows = auditRows.filter((l) =>
    `${l.user} ${l.entity} ${l.action}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="pf-page">
       <div className="pf-planner-toolbar">
      <PfPageHeader
        title="Audit Logs"
        subtitle="Immutable activity log — all changes are permanently recorded"
      >
        <button className="pf-button pf-button--ghost">⇩ Export CSV</button>
      </PfPageHeader>
      </div>
      <section className="pf-card pf-audit-filters">
        <label className="pf-audit-filters__search">
          <span className="sr-only">Search audit logs</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="⌕  Search by user, entity, action..."
          />
        </label>
        <label>
          <span>Entity Type</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>Action</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>User</span>
          <select>
            <option>All Users</option>
          </select>
        </label>
        <label className="pf-audit-date">
          <span>Date Range</span>
          <span>
            <input aria-label="Audit log start date" defaultValue="01-07-2025" />
            <i aria-hidden="true">▣</i>
          </span>
        </label>
        <button type="button" onClick={() => setSearch('')}>
          Clear
        </button>
      </section>
      <section className="pf-card pf-table-card pf-audit-log-card">
        <div className="pf-table-wrap">
          <table className="pf-table pf-audit-log-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Entity</th>
                <th>Action</th>
                <th>Summary</th>
                <th>Reason</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((log, index) => (
                <tr key={log.id}>
                  <td>
                    <strong>{log.date.split(' · ')[0]}</strong>
                    <small>{log.date.split(' · ')[1]}</small>
                  </td>
                  <td>
                    <span className={`pf-audit-user pf-audit-user--${index % 2}`}>
                      <i>
                        {log.user
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </i>
                      <strong>{log.user}</strong>
                    </span>
                  </td>
                  <td>
                    {log.entity}
                    <small className="block">{log.id}</small>
                  </td>
                  <td>
                    <PfBadge
                      tone={
                        log.action === 'Override'
                          ? 'orange'
                          : log.action === 'Updated'
                            ? 'blue'
                            : log.action === 'Status Change'
                              ? 'red'
                              : 'green'
                      }
                    >
                      {log.action}
                    </PfBadge>
                  </td>
                  <td className="pf-audit-summary">
                    <HighlightedSummary text={log.summary} />
                  </td>
                  <td>{log.reason}</td>
                  <td>
                    <button className="pf-link" onClick={() => setSelected(log)}>
                      View ›
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="data-table-pagination">
          <p>
            Showing <strong>1–{rows.length}</strong> of <strong>1,248</strong> entries
          </p>
          <span />
          <nav aria-label="Audit log pagination">
            <button disabled>‹</button>
            <button aria-current="page">1</button>
            <button>2</button>
            <button>3</button>
            <i>…</i>
            <button>83</button>
            <button>›</button>
          </nav>
        </footer>
      </section>
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Audit Detail"
        subtitle={selected?.date}
      >
        <div className="pf-audit-drawer">
          <dl className="pf-audit-metadata">
            <dt>Entity</dt>
            <dd>{selected?.entity}</dd>
            <dt>Record ID</dt>
            <dd>{selected?.id}</dd>
            <dt>Changed By</dt>
            <dd>{selected?.user}</dd>
            <dt>Timestamp</dt>
            <dd>Jul 15, 2025 · 14:32:08 IST</dd>
            <dt>Action</dt>
            <dd>
              <PfBadge tone="orange">{selected?.action}</PfBadge>
            </dd>
            <dt>IP Address</dt>
            <dd>
              <code>10.0.1.42</code>
            </dd>
            <dt>Correlation ID</dt>
            <dd>
              <code>req_7f8a3c…</code>
            </dd>
          </dl>
          <h3>Override Reason</h3>
          <div className="pf-audit-reason">
            {selected?.reason}.<br />
            Approved by delivery manager.
          </div>
          <h3>Field Changes</h3>
          <div className="pf-field-changes">
            <div className="pf-field-changes__head">
              <span>Field</span>
              <span>Old Value</span>
              <span>New Value</span>
            </div>
            <div>
              <strong>Allocation %</strong>
              <span className="old">30%</span>
              <span className="new">—</span>
            </div>
            <div>
              <strong>Status</strong>
              <span className="old">Active</span>
              <span className="new">None</span>
            </div>
            <div>
              <strong>Total Allocation</strong>
              <span className="old">130% ⚠</span>
              <span className="new">100%</span>
            </div>
          </div>
          <h3>Full Record Snapshot</h3>
          <pre className="pf-audit-snapshot">
            <code>
              {`{
  `}
              <span>"employee_id"</span>
              {`: `}
              <b>"EMP-005"</b>
              {`,
  `}
              <span>"project_id"</span>
              {`: `}
              <b>"PRJ-001"</b>
              {`,
  `}
              <span>"allocation_pct"</span>
              {`: `}
              <em>30</em>
              {`,
  `}
              <span>"billability"</span>
              {`: `}
              <b>"Billable"</b>
              {`,
  `}
              <span>"start_date"</span>
              {`: `}
              <b>"2025-07-15"</b>
              {`,
  `}
              <span>"end_date"</span>
              {`: `}
              <b>"2025-08-15"</b>
              {`,
  `}
              <span>"override"</span>
              {`: `}
              <em>true</em>
              {`,
  `}
              <span>"override_reason"</span>
              {`: `}
              <b>"Deadline critical"</b>
              {`
}`}
            </code>
          </pre>
        </div>
      </Drawer>
    </div>
  );
}

function HighlightedSummary({ text }: { text: string }) {
  const emphasized = [
    'Neha Joshi',
    'NovaBank Portal',
    'Aditi Mehra',
    'Senior React Developer',
    'Meera Nair',
    'HealthBridge Mobile',
    'Resource Manager',
  ];
  const pattern = new RegExp(`(${emphasized.join('|')})`, 'g');
  return (
    <>
      {text
        .split(pattern)
        .map((part, index) =>
          emphasized.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part,
        )}
    </>
  );
}
