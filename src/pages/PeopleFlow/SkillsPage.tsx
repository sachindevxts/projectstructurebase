import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import skillData from '@/dummyJson/skills/skill-list.json';
import { PfBadge, PfPageHeader } from './shared';

type Skill = (typeof skillData.skills)[number];
type DialogMode = 'add' | 'edit' | 'view' | null;

function SkillIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

function SkillActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <span className="pf-admin-actions">
      <button aria-label="View skill" onClick={onView}>
        <svg viewBox="0 0 24 24">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      </button>
      <button aria-label="Edit skill" onClick={onEdit}>
        <svg viewBox="0 0 24 24">
          <path d="m14 5 5 5M4 20l3.5-.8L19 7.7a2.1 2.1 0 0 0-3-3L4.8 16.2 4 20Z" />
        </svg>
      </button>
      <button aria-label="Delete skill" onClick={onDelete}>
        <svg viewBox="0 0 24 24">
          <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
        </svg>
      </button>
    </span>
  );
}

function CategoryDonut() {
  const total = skillData.categories.reduce((sum, item) => sum + item.count, 0);
  const [hovered, setHovered] = useState<(typeof skillData.categories)[number] | null>(null);
  let offset = 0;
  return (
    <div className="pf-skill-donut">
      <svg viewBox="0 0 42 42" role="img" aria-label="Skills by category">
        {skillData.categories.map((item) => {
          const length = (item.count / total) * 100;
          const segment = (
            <circle
              key={item.name}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={item.color}
              strokeWidth="8"
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={-offset}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>
                {item.name}: {item.count}
              </title>
            </circle>
          );
          offset += length;
          return segment;
        })}
      </svg>
      {hovered && (
        <span className="pf-chart-tooltip">
          {hovered.name}: {hovered.count}
        </span>
      )}
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(skillData.skills);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [demandFilter, setDemandFilter] = useState('All Demand');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const filtered = useMemo(
    () =>
      skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === 'All' || skill.category === category) &&
          (demandFilter === 'All Demand' ||
            skill.demand === demandFilter.replace(' Demand', '') ||
            (demandFilter === 'Gap' && skill.gap === 'Gap')),
      ),
    [skills, search, category, demandFilter],
  );
  const open = (mode: Exclude<DialogMode, null>, skill?: Skill) => {
    setSelected(skill ?? null);
    setForm(
      skill
        ? Object.fromEntries(Object.entries(skill).map(([key, value]) => [key, String(value)]))
        : {
            category: '',
            proficiency: '1–5 scale',
            demand: 'Medium',
            status: 'Active',
            active: 'true',
          },
    );
    setError('');
    setDialog(mode);
  };
  const close = () => setDialog(null);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name?.trim()) return setError('Skill name is required.');
    if (!form.category) return setError('Category is required.');
    const next = {
      ...(selected ?? skillData.skills[0]),
      id: selected?.id ?? `skill-${Date.now()}`,
      name: form.name.trim(),
      category: form.category || 'Frontend',
      employees: Number(form.employees || 0),
      demand: form.demand || 'Medium',
      coverage: Number(form.coverage || 0),
      gap:
        Number(form.coverage || 0) >= 70
          ? 'Covered'
          : Number(form.coverage || 0) >= 40
            ? 'Partial'
            : 'Gap',
      aliases: form.aliases || '',
      description: form.description || '',
      status: form.status || 'Active',
    } as Skill;
    setSkills((current) =>
      selected
        ? current.map((skill) => (skill.id === selected.id ? next : skill))
        : [next, ...current],
    );
    close();
  };
  const remove = (skill: Skill) => {
    if (window.confirm(`Delete ${skill.name}?`))
      setSkills((current) => current.filter((item) => item.id !== skill.id));
  };
  const exportCsv = () => {
    const csv = [
      'Skill,Category,Employees,Demand,Coverage',
      ...skills.map(
        (skill) =>
          `${skill.name},${skill.category},${skill.employees},${skill.demand},${skill.coverage}`,
      ),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skills.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  const tone = (value: string) =>
    value === 'Covered' ? 'green' : value === 'Gap' ? 'red' : 'orange';
  const coverageChart = ['React.js', 'Node.js', 'TypeScript', 'Figma', 'AWS', 'Java', 'Selenium']
    .map((name) => skills.find((skill) => skill.name === name))
    .filter((skill): skill is Skill => Boolean(skill));
  const categoryFilters = [
    'All',
    'Frontend',
    'Backend',
    'DevOps',
    'Design',
    'QA',
    'Data',
    'Soft Skills',
  ];
  const allVisibleSelected =
    filtered.length > 0 && filtered.every((skill) => selectedRows.includes(skill.id));
  const toggleAll = () =>
    setSelectedRows((current) =>
      allVisibleSelected
        ? current.filter((id) => !filtered.some((skill) => skill.id === id))
        : [...new Set([...current, ...filtered.map((skill) => skill.id)])],
    );
  const statCards = [
    {
      value: 68,
      label: 'Total Skills',
      tone: 'blue',
      icon: (
        <SkillIcon>
          <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-1.1.8-1.5 1.6-1.5 2.5h-4c0-.9-.4-1.7-1.5-2.5Z" />
        </SkillIcon>
      ),
    },
    {
      value: 247,
      label: 'Mapped Employees',
      tone: 'green',
      icon: (
        <SkillIcon>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6M16 9l2 2 3-4" />
        </SkillIcon>
      ),
    },
    {
      value: 8,
      label: 'Gaps Identified',
      tone: 'red',
      icon: (
        <SkillIcon>
          <path d="M12 3 2.8 20h18.4L12 3Z" />
          <path d="M12 9v5M12 17h.01" />
        </SkillIcon>
      ),
    },
    {
      value: 12,
      label: 'High Demand',
      tone: 'purple',
      icon: (
        <SkillIcon>
          <path d="m4 17 5-5 3 3 7-8M15 7h4v4" />
        </SkillIcon>
      ),
    },
    {
      value: 7,
      label: 'Categories',
      tone: 'orange',
      icon: (
        <SkillIcon>
          <path d="M3 6v5l8 8 8-8-8-8H6a3 3 0 0 0-3 3Z" />
          <circle cx="8" cy="8" r="1" />
        </SkillIcon>
      ),
    },
  ];

  return (
    <div className="pf-page pf-skills-page">
      <PfPageHeader
        title="Skills"
        subtitle="Manage the organization's skill taxonomy, track employee coverage and demand gaps."
      >
        <button className="pf-button pf-button--ghost">
          <span aria-hidden="true">↥</span> Import
        </button>
        <button className="pf-button pf-button--ghost" onClick={exportCsv}>
          <span aria-hidden="true">↧</span> Export
        </button>
        <button className="pf-button" onClick={() => open('add')}>
          <span aria-hidden="true">+</span> Add Skill
        </button>
      </PfPageHeader>
      <div className="pf-admin-stats pf-skill-stats">
        {statCards.map((stat) => (
          <article key={stat.label}>
            <i className={`pf-skill-stat-icon pf-skill-stat-icon--${stat.tone}`}>{stat.icon}</i>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
      <section className="pf-skill-charts">
        <article className="pf-card">
          <header>
            <h2>Top Skills by Employee Coverage</h2>
            <select aria-label="Chart department">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Design</option>
            </select>
          </header>
          <div className="pf-horizontal-bars">
            {coverageChart.map((skill) => (
              <div key={skill.id}>
                <span>{skill.name}</span>
                <i
                  style={{ '--skill-width': `${skill.employees * 2}%` } as React.CSSProperties}
                  title={`${skill.name}: ${skill.employees}`}
                />
              </div>
            ))}
          </div>
        </article>
        <article className="pf-card">
          <h2>Skills by Category</h2>
          <CategoryDonut />
          <div className="pf-skill-legend">
            {skillData.categories.map((item) => (
              <span key={item.name}>
                <i style={{ background: item.color }} />
                {item.name}
                <b>{item.count}</b>
              </span>
            ))}
          </div>
        </article>
      </section>
      <aside className="pf-skill-alert">
        <b>
          <span aria-hidden="true">▲</span> Skill Gaps Detected
        </b>
        <span>
          8 skills have high project demand but fewer than 3 employees covered: <b>Kubernetes</b>,{' '}
          <b>Rust</b>, <b>LLM Engineering</b> and 5 more.
        </span>
        <button type="button">View All →</button>
      </aside>
      <section className="pf-card pf-admin-toolbar pf-skill-toolbar">
        <input
          placeholder="Search skill name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div>
          {categoryFilters.map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="pf-skill-toolbar__end">
          <select
            aria-label="Demand filter"
            value={demandFilter}
            onChange={(event) => setDemandFilter(event.target.value)}
          >
            <option>All Demand</option>
            <option>High Demand</option>
            <option>Medium Demand</option>
            <option>Critical Demand</option>
            <option>Gap</option>
          </select>
          <span>{filtered.length} skills</span>
        </div>
      </section>
      <div className="pf-card pf-table-card">
        <div className="pf-table-wrap">
          <table className="pf-table">
            <thead>
              <tr>
                <th className="pf-table__selection">
                  <input
                    type="checkbox"
                    aria-label="Select all skills"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Employees</th>
                <th>Demand Level</th>
                <th>Coverage %</th>
                <th>Gap Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((skill) => (
                <tr key={skill.id}>
                  <td className="pf-table__selection">
                    <input
                      type="checkbox"
                      aria-label={`Select ${skill.name}`}
                      checked={selectedRows.includes(skill.id)}
                      onChange={() =>
                        setSelectedRows((current) =>
                          current.includes(skill.id)
                            ? current.filter((id) => id !== skill.id)
                            : [...current, skill.id],
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="pf-skill-name">
                      <i>{skill.name.slice(0, 2)}</i>
                      <span>
                        <b>{skill.name}</b>
                        <small className="pf-table-subtitle">Updated Jun 2025</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <PfBadge>{skill.category}</PfBadge>
                  </td>
                  <td>
                    <div className="pf-skill-employees">
                      <span>
                        <i />
                        <i />
                        <i />
                      </span>
                      {skill.employees}
                    </div>
                  </td>
                  <td>
                    <b className={`pf-demand pf-demand--${skill.demand.toLowerCase()}`}>
                      <span aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      {skill.demand}
                    </b>
                  </td>
                  <td>
                    <div className="pf-skill-coverage">
                      <i style={{ '--coverage': `${skill.coverage}%` } as React.CSSProperties} />
                      <b>{skill.coverage}%</b>
                    </div>
                  </td>
                  <td>
                    <PfBadge tone={tone(skill.gap)}>{skill.gap}</PfBadge>
                  </td>
                  <td>
                    <SkillActions
                      onView={() => open('view', skill)}
                      onEdit={() => open('edit', skill)}
                      onDelete={() => remove(skill)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={dialog !== null}
        onClose={close}
        title={
          <div className="pf-skill-modal-title">
            <strong>{dialog === 'view' ? 'View' : dialog === 'edit' ? 'Edit' : 'Add'} Skill</strong>
            {dialog !== 'view' && <small>Add a new skill to the organization's taxonomy.</small>}
          </div>
        }
        footer={
          dialog === 'view' ? (
            <button className="pf-button" onClick={close}>
              Close
            </button>
          ) : (
            <>
              <button className="pf-button pf-button--ghost" onClick={close}>
                Cancel
              </button>
              <button className="pf-button" form="skill-form">
                Save Skill
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
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        ) : (
          <form id="skill-form" className="pf-admin-form pf-skill-form" onSubmit={save}>
            <label className="pf-skill-form__full">
              Skill Name *
              <input
                placeholder="e.g. React.js, Docker, Figma..."
                value={form.name ?? ''}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label>
              Category *
              <select
                value={form.category ?? ''}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              >
                <option value="">Select category...</option>
                {skillData.categories.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
                <option>QA</option>
                <option>Data / AI</option>
                <option>Soft Skills</option>
              </select>
            </label>
            <label>
              Proficiency Levels
              <select
                value={form.proficiency ?? '1–5 scale'}
                onChange={(event) => setForm({ ...form, proficiency: event.target.value })}
              >
                {['1–5 scale', 'Beginner / Intermediate / Expert', 'Yes / No only'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <fieldset className="pf-skill-demand pf-skill-form__full">
              <legend>Demand Level</legend>
              {['Low', 'Medium', 'High', 'Critical'].map((item) => (
                <label key={item} className={item === 'Critical' ? 'critical' : ''}>
                  <input
                    type="radio"
                    name="demand"
                    checked={(form.demand ?? 'Medium') === item}
                    onChange={() => setForm({ ...form, demand: item })}
                  />
                  {item}
                </label>
              ))}
            </fieldset>
            <label className="pf-skill-form__full">
              Related Skills / Aliases
              <input
                placeholder="e.g. React, ReactJS (comma-separated)"
                value={form.aliases ?? ''}
                onChange={(event) => setForm({ ...form, aliases: event.target.value })}
              />
            </label>
            <label className="pf-skill-form__full">
              Description
              <textarea
                placeholder="Brief description of this skill..."
                value={form.description ?? ''}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>
            <label className="pf-skill-form__full">
              Applicable Designations
              <select
                multiple
                size={4}
                value={(form.designations ?? 'Senior React Developer').split('|')}
                onChange={(event) =>
                  setForm({
                    ...form,
                    designations: Array.from(event.target.selectedOptions)
                      .map((option) => option.value)
                      .join('|'),
                  })
                }
              >
                {[
                  'Senior React Developer',
                  'Tech Lead',
                  'Junior Developer',
                  'Full Stack Developer',
                  'QA Engineer',
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <small>Hold Ctrl / ⌘ to select multiple</small>
            </label>
            <label className="pf-skill-active pf-skill-form__full">
              <input
                type="checkbox"
                checked={(form.active ?? 'true') === 'true'}
                onChange={(event) =>
                  setForm({
                    ...form,
                    active: String(event.target.checked),
                    status: event.target.checked ? 'Active' : 'Inactive',
                  })
                }
              />
              Mark as Active
            </label>
            {error && <p className="pf-admin-error">{error}</p>}
          </form>
        )}
      </Modal>
    </div>
  );
}
