import { useMemo, useState, type FormEvent } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import departmentData from '@/dummyJson/departments/department-list.json';
import designationData from '@/dummyJson/designations/designation-list.json';
import { CapacityBar, PfBadge, PfPageHeader } from './shared';

type Department = (typeof departmentData.departments)[number];
type Designation = (typeof designationData.designations)[number];
type RecordItem = Department | Designation;
type DialogMode = 'add' | 'edit' | 'view' | null;

const isDepartment = (item: RecordItem): item is Department => 'head' in item;

export default function AdminDirectoryPage({ type }: { type: 'departments' | 'designations' }) {
  const departments = type === 'departments';
  const initialData = departments ? departmentData.departments : designationData.designations;
  const [records, setRecords] = useState<RecordItem[]>(initialData);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>(departments ? 'grid' : 'list');
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const title = departments ? 'Departments' : 'Designations';
  const singular = departments ? 'Department' : 'Designation';
  const filtered = useMemo(
    () =>
      records.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          (status === 'All' || item.status === status),
      ),
    [records, search, status],
  );
  const openDialog = (mode: Exclude<DialogMode, null>, item?: RecordItem) => {
    setSelected(item ?? null);
    setForm(
      item
        ? Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(', ') : String(value),
            ]),
          )
        : { status: 'Active' },
    );
    setError('');
    setDialog(mode);
  };
  const closeDialog = () => setDialog(null);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name?.trim()) return setError(`${singular} name is required.`);
    if (departments && !form.code?.trim()) return setError('Department code is required.');
    const base = selected ?? initialData[0];
    const next = {
      ...base,
      id: selected?.id ?? `${departments ? 'dep' : 'des'}-${Date.now()}`,
      name: form.name.trim(),
      status: form.status ?? 'Active',
      description: form.description ?? '',
      skills: (form.skills ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      ...(departments
        ? {
            code: form.code,
            head: form.head || 'Unassigned',
            employees: Number(form.employees || 0),
            billable: Number(form.billable || 0),
            bench: Number(form.bench || 0),
            billability: Number(form.billability || 0),
          }
        : {
            department: form.department || 'Engineering',
            level: form.level || 'Mid-level',
            employees: Number(form.employees || 0),
          }),
    } as RecordItem;
    setRecords((current) =>
      selected
        ? current.map((item) => (item.id === selected.id ? next : item))
        : [next, ...current],
    );
    closeDialog();
  };
  const remove = (item: RecordItem) => {
    if (window.confirm(`Delete ${item.name}?`))
      setRecords((current) => current.filter((record) => record.id !== item.id));
  };

  const actions = (item: RecordItem) => (
    <span className="pf-admin-actions">
      <button
        type="button"
        aria-label={`View ${item.name}`}
        onClick={() => openDialog('view', item)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        ◉
      </button>
      <button
        type="button"
        aria-label={`Edit ${item.name}`}
        onClick={() => openDialog('edit', item)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14 5 5 5M4 20l3.5-.8L19 7.7a2.1 2.1 0 0 0-3-3L4.8 16.2 4 20Z" />
          <path d="M13 6H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
        </svg>
        ✎
      </button>
      <button type="button" aria-label={`Delete ${item.name}`} onClick={() => remove(item)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
        </svg>
        ♲
      </button>
    </span>
  );

  return (
    <div className="pf-page pf-admin-directory">
      <PfPageHeader
        title={title}
        subtitle={
          departments
            ? 'Organize your workforce structure and manage department heads.'
            : 'Manage job titles and seniority levels across your organization.'
        }
      >
        {departments && (
          <div className="pf-segmented">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
              Grid
            </button>
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
              List
            </button>
          </div>
        )}
        <button className="pf-button" onClick={() => openDialog('add')}>
          ＋ Add {singular}
        </button>
      </PfPageHeader>
      <div className="pf-admin-stats">
        <article>
          <b>{records.length}</b>
          <span>Total {title}</span>
        </article>
        <article>
          <b>{departments ? 247 : 6}</b>
          <span>{departments ? 'Total Employees' : 'Seniority Levels'}</span>
        </article>
        <article>
          <b>{departments ? 23 : 247}</b>
          <span>{departments ? 'On Bench' : 'Employees Mapped'}</span>
        </article>
        <article>
          <b>{departments ? '78%' : records.filter((item) => item.employees === 0).length}</b>
          <span>{departments ? 'Avg Billability' : 'Unmapped'}</span>
        </article>
      </div>
      {departments && (
        <section className="pf-admin-charts">
          <article className="pf-card">
            <h2>Headcount by Department</h2>
            <div className="pf-admin-bars">
              {records.filter(isDepartment).map((item) => (
                <span
                  key={item.id}
                  style={
                    { '--bar-height': `${Math.max(8, item.employees)}px` } as React.CSSProperties
                  }
                >
                  <i />
                  <small>{item.name}</small>
                </span>
              ))}
            </div>
          </article>
          <article className="pf-card pf-admin-donut-card">
            <h2>Billability Split</h2>
            <div className="pf-admin-donut" />
            <p>
              <span>■ Billable</span>
              <b>181</b>
              <span>■ Non-Billable</span>
              <b>66</b>
            </p>
          </article>
        </section>
      )}
      <section className="pf-card pf-admin-toolbar">
        <input
          aria-label={`Search ${title}`}
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <span>
          {filtered.length} {title.toLowerCase()}
        </span>
      </section>
      {departments && view === 'grid' ? (
        <div className="pf-department-grid">
          {filtered.filter(isDepartment).map((item) => (
            <article className="pf-card pf-department-card" key={item.id}>
              <header>
                <div>
                  <h2>{item.name}</h2>
                  <small>Head: {item.head}</small>
                </div>
                {actions(item)}
              </header>
              <div className="pf-department-metrics">
                <span>
                  <b>{item.employees}</b>Employees
                </span>
                <span>
                  <b>{item.billability}%</b>Billable
                </span>
                <span>
                  <b>{item.bench}</b>On Bench
                </span>
              </div>
              <label>
                Billability <b>{item.billability}%</b>
              </label>
              <CapacityBar value={item.billability} />
              <p>
                Top skills:{' '}
                {item.skills.map((skill) => (
                  <PfBadge key={skill}>{skill}</PfBadge>
                ))}
              </p>
              <footer>
                <PfBadge tone={item.status === 'Active' ? 'green' : 'slate'}>{item.status}</PfBadge>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="pf-card pf-table-card">
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>{singular}</th>
                  <th>{departments ? 'Head' : 'Department'}</th>
                  <th>Employees</th>
                  <th>{departments ? 'Billability' : 'Level'}</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td>{isDepartment(item) ? item.head : item.department}</td>
                    <td>{item.employees}</td>
                    <td>{isDepartment(item) ? `${item.billability}%` : item.level}</td>
                    <td>
                      {item.skills.map((skill) => (
                        <PfBadge key={skill}>{skill}</PfBadge>
                      ))}
                    </td>
                    <td>
                      <PfBadge tone={item.status === 'Active' ? 'green' : 'slate'}>
                        {item.status}
                      </PfBadge>
                    </td>
                    <td>{actions(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Modal
        isOpen={dialog !== null}
        onClose={closeDialog}
        title={`${dialog === 'view' ? 'View' : dialog === 'edit' ? 'Edit' : 'Add'} ${singular}`}
        footer={
          dialog === 'view' ? (
            <button className="pf-button" onClick={closeDialog}>
              Close
            </button>
          ) : (
            <>
              <button className="pf-button pf-button--ghost" onClick={closeDialog}>
                Cancel
              </button>
              <button className="pf-button" form="admin-record-form">
                Save {singular}
              </button>
            </>
          )
        }
      >
        {dialog === 'view' && selected ? (
          <dl className="pf-admin-detail">
            {Object.entries(selected)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd>
                </div>
              ))}
          </dl>
        ) : (
          <form id="admin-record-form" className="pf-admin-form" onSubmit={save}>
            <label>
              {singular} Name *
              <input
                value={form.name ?? ''}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            {departments ? (
              <>
                <label>
                  Department Code *
                  <input
                    value={form.code ?? ''}
                    onChange={(event) => setForm({ ...form, code: event.target.value })}
                  />
                </label>
                <label>
                  Department Head
                  <input
                    value={form.head ?? ''}
                    onChange={(event) => setForm({ ...form, head: event.target.value })}
                  />
                </label>
                <label>
                  Billability %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.billability ?? ''}
                    onChange={(event) => setForm({ ...form, billability: event.target.value })}
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Department
                  <select
                    value={form.department ?? 'Engineering'}
                    onChange={(event) => setForm({ ...form, department: event.target.value })}
                  >
                    {departmentData.departments.map((item) => (
                      <option key={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Seniority Level
                  <select
                    value={form.level ?? 'Mid-level'}
                    onChange={(event) => setForm({ ...form, level: event.target.value })}
                  >
                    {['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'].map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <label>
              Typical Skills
              <input
                placeholder="Comma-separated skills"
                value={form.skills ?? ''}
                onChange={(event) => setForm({ ...form, skills: event.target.value })}
              />
            </label>
            <label>
              Description
              <textarea
                value={form.description ?? ''}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={form.status ?? 'Active'}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            {error && <p className="pf-admin-error">{error}</p>}
          </form>
        )}
      </Modal>
    </div>
  );
}
