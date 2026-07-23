import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '@/dummyJson/projects/project-list.json';
import type { ProjectItem } from '@/types/dummy/peopleflow.types';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { PfBadge, PfPageHeader } from './shared';
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const rows = useMemo(
    () =>
      (data.projects as ProjectItem[]).filter((p) =>
        `${p.name} ${p.client}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  const columns: DataTableColumn<ProjectItem>[] = [
    {
      id: 'project',
      header: 'Project',
      minWidth: 190,
      render: (p) => (
        <div>
          <strong>{p.name}</strong>
          <small className="block">{p.id}</small>
        </div>
      ),
    },
    { id: 'client', header: 'Client', render: (p) => p.client },
    {
      id: 'manager',
      header: 'Project Manager',
      render: (p) => (
        <span className="pf-project-manager">
          <i>
            {p.manager
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </i>
          <span>{p.manager}</span>
        </span>
      ),
    },
    { id: 'start', header: 'Start Date', render: (p) => p.start },
    { id: 'end', header: 'End Date', render: (p) => p.end },
    { id: 'team', header: 'Team', render: (p) => <b>{p.team}</b> },
    {
      id: 'billable',
      header: 'Billable',
      render: (p) => <b className="success">{p.billable || '—'}</b>,
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (p) => (
        <span className="pf-project-actions">
          <button type="button" onClick={() => navigate(`/projects/${p.id}`)}>
            View
          </button>
          <button type="button" aria-label={`More actions for ${p.name}`}>
            ⋮
          </button>
        </span>
      ),
    },
    { id: 'billing', header: 'Billing', render: (p) => <PfBadge>{p.billing}</PfBadge> },
    {
      id: 'status',
      header: 'Status',
      render: (p) => (
        <PfBadge tone={p.status === 'At Risk' ? 'red' : p.status === 'Active' ? 'green' : 'slate'}>
          {p.status}
        </PfBadge>
      ),
    },
  ];
  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
        <PfPageHeader title="Projects" subtitle="18 active · 24 total">
          <button className="pf-button pf-button--ghost">⇩ Export</button>
          <button className="pf-button">＋ Add Project</button>
        </PfPageHeader>
      </div>
      <section className="pf-card pf-project-filters">
        <label className="pf-project-filters__search">
          <span className="sr-only">Search projects</span>
          <input
            placeholder="⌕  Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          <span>Client</span>
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
        <label>
          <span>Billing Model</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select>
            <option>All</option>
          </select>
        </label>
        <button type="button" className="pf-project-filters__clear" onClick={() => setSearch('')}>
          Clear
        </button>
      </section>
      <section className="pf-card pf-table-card pf-projects-table-card">
        <DataTable
          columns={columns}
          data={rows}
          rowKey="id"
          onRowClick={(row) => navigate(`/projects/${row.id}`)}
        />
        <footer className="pf-table-footer">Showing 1–{rows.length} of 24 projects</footer>
      </section>
    </div>
  );
}
