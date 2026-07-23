import { useState } from 'react';
import { PfBadge, PfPageHeader } from './shared';

type PermissionRow = {
  name: string;
  description: string;
  checked: number[];
  warning?: boolean;
  sensitive?: boolean;
};

type PermissionGroup = {
  name: string;
  icon: string;
  rows: PermissionRow[];
};

const roleRows = [
  {
    name: 'Super Admin',
    type: 'System',
    tone: 'purple',
    description: 'Full platform access including org setup, audit logs',
    users: 2,
    permissions: 'All (48)',
  },
  {
    name: 'HR Admin',
    type: 'Custom',
    tone: 'blue',
    description: 'Manage employees, departments, designations',
    users: 5,
    permissions: '32',
  },
  {
    name: 'Resource Manager',
    type: 'Custom',
    tone: 'blue',
    description: 'Manage allocations, capacity, bench, releases',
    users: 8,
    permissions: '28',
  },
  {
    name: 'Project Manager',
    type: 'Custom',
    tone: 'blue',
    description: 'View assigned projects, team, request resources',
    users: 14,
    permissions: '18',
  },
  {
    name: 'Management Viewer',
    type: 'Custom',
    tone: 'blue',
    description: 'Read-only access to dashboard, reports, insights',
    users: 6,
    permissions: '12',
  },
  {
    name: 'Employee',
    type: 'Custom',
    tone: 'slate',
    description: 'Limited Phase 1 access — self-service ready',
    users: 198,
    permissions: '4',
  },
];

const permissionGroups: PermissionGroup[] = [
  {
    name: 'Dashboard',
    icon: '◉',
    rows: [
      { name: 'Organization Dashboard', description: 'View KPIs, charts, widgets', checked: [0] },
    ],
  },
  {
    name: 'Employees',
    icon: '♟',
    rows: [
      { name: 'View Employees', description: 'List and detail view', checked: [0, 4] },
      { name: 'Manage Employees', description: 'Create, update, status change', checked: [0] },
    ],
  },
  {
    name: 'Allocations',
    icon: '↗',
    rows: [
      { name: 'View Allocations', description: 'List and details', checked: [0, 4] },
      {
        name: 'Create Allocations',
        description: 'Assign employees to projects',
        checked: [0, 1, 2],
      },
      {
        name: 'Override Overallocation',
        description: '⚠ Requires override permission',
        checked: [0, 1, 2, 5],
        warning: true,
      },
      { name: 'Release Allocations', description: '', checked: [0, 2] },
      { name: 'Extend Allocations', description: '', checked: [0, 2] },
    ],
  },
  {
    name: 'Reports',
    icon: '▤',
    rows: [
      { name: 'Allocation Reports', description: '', checked: [0, 4] },
      { name: 'Bench & Availability Reports', description: '', checked: [0, 4] },
      {
        name: 'Financial Reports',
        description: '🔒 Sensitive access required',
        checked: [],
        sensitive: true,
      },
    ],
  },
];

export default function RolesPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const toggle = (key: string, fallback: boolean) =>
    setChecks((current) => ({ ...current, [key]: !(current[key] ?? fallback) }));
  return (
    <div className="pf-page pf-roles-page">
       <div className="pf-planner-toolbar">
      <PfPageHeader
        title="Roles & Permissions"
        subtitle="Manage role-based access control across the platform"
      >
        <button className="pf-button">＋ Create Role</button>
      </PfPageHeader>
      </div>
      <section className="pf-card pf-table-card pf-roles-table-card">
        <div className="pf-table-wrap">
          <table className="pf-table pf-roles-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Users</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map((role) => (
                <tr key={role.name}>
                  <td>
                    <strong>{role.name}</strong>
                    <PfBadge tone={role.tone}>{role.type}</PfBadge>
                  </td>
                  <td>{role.description}</td>
                  <td>
                    <b>{role.users}</b>
                  </td>
                  <td>
                    <b>{role.permissions}</b>
                  </td>
                  <td>
                    <span className="pf-role-actions">
                      <button>Edit</button>
                      <button>Assign Users</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pf-card pf-role-summary">
        <div className="pf-role-summary__heading">
          <div>
            <h2>
              Resource Manager <PfBadge>Custom Role</PfBadge> <PfBadge tone="green">Active</PfBadge>
            </h2>
            <p>
              Manage allocations, capacity planning, bench employees, upcoming releases, and
              overallocations.
            </p>
          </div>
          <div className="pf-actions">
            <button className="pf-button">Edit</button>
            <button className="pf-button pf-button--ghost">Duplicate</button>
          </div>
        </div>
        <div className="pf-role-summary__search">
          <input placeholder="⌕  Search permissions..." />
          <span>28 permissions enabled</span>
        </div>
      </section>

      <section className="pf-card pf-permissions">
        <div className="pf-permission-head">
          <strong>Permission</strong>
          <div>
            {['View', 'Create', 'Update', 'Delete', 'Export', 'Override'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        {permissionGroups.map((group) => (
          <details open key={group.name}>
            <summary>
              <span>
                <i>{group.icon}</i>
                {group.name}
              </span>
              <span>Select all　⌄</span>
            </summary>
            {group.rows.map((permission) => (
              <label className={permission.warning ? 'warning' : ''} key={permission.name}>
                <span>
                  <strong>{permission.name}</strong>
                  {permission.description && (
                    <small className={permission.sensitive ? 'sensitive' : ''}>
                      {permission.description}
                    </small>
                  )}
                </span>
                <span className="pf-permission-checks">
                  {Array.from({ length: 6 }, (_, index) => {
                    const key = `${permission.name}-${index}`;
                    const fallback = permission.checked.includes(index);
                    return (
                      <input
                        key={key}
                        type="checkbox"
                        aria-label={`${permission.name}: ${['View', 'Create', 'Update', 'Delete', 'Export', 'Override'][index]}`}
                        checked={checks[key] ?? fallback}
                        onChange={() => toggle(key, fallback)}
                      />
                    );
                  })}
                </span>
              </label>
            ))}
          </details>
        ))}
      </section>
      <footer className="pf-card pf-savebar">
        <span>
          ⓘ　Changes will affect all users assigned to the Resource Manager role (8 users).
        </span>
        <button className="pf-button pf-button--ghost">Cancel</button>
        <button className="pf-button">Save Permissions</button>
      </footer>
    </div>
  );
}
