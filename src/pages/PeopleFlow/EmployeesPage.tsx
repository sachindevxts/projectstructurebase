import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '@/dummyJson/employees/employee-list.json';
import type { EmployeeItem } from '@/types/dummy/peopleflow.types';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { CapacityBar, PfBadge, PfPageHeader } from './shared';

type FilterTuple = [string, string, () => void];

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [designation, setDesignation] = useState('All');
  const [status, setStatus] = useState('Active');
  const [billability, setBillability] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const rows = useMemo(
    () =>
      (data.employees as EmployeeItem[]).filter(
        (employee) =>
          (department === 'All' || employee.department === department) &&
          (designation === 'All' || employee.designation === designation) &&
          (status === 'All' || employee.status === status) &&
          (billability === 'All' || employee.billability === billability) &&
          (employmentType === 'All' || employee.type === employmentType) &&
          `${employee.name} ${employee.email} ${employee.id}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [search, department, designation, status, billability, employmentType],
  );

  const clearFilters = () => {
    setSearch('');
    setDepartment('All');
    setDesignation('All');
    setStatus('All');
    setBillability('All');
    setEmploymentType('All');
  };
  const appliedFilters = [
    department !== 'All' && ['Department', department, () => setDepartment('All')],
    designation !== 'All' && ['Designation', designation, () => setDesignation('All')],
    status !== 'All' && ['Status', status, () => setStatus('All')],
    billability !== 'All' && ['Billability', billability, () => setBillability('All')],
    employmentType !== 'All' && ['Type', employmentType, () => setEmploymentType('All')],
  ].filter(Boolean) as FilterTuple[];
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: DataTableColumn<EmployeeItem>[] = [
    {
      id: 'employee',
      header: 'Employee',
      minWidth: 220,
      render: (employee) => (
        <div className="pf-identity">
          <span className="pf-avatar">{employee.name[0]}</span>
          <span>
            <strong>{employee.name}</strong>
            <small>{employee.email}</small>
          </span>
        </div>
      ),
    },
    { id: 'id', header: 'Emp ID', render: (employee) => employee.id },
    { id: 'department', header: 'Department', render: (employee) => employee.department },
    {
      id: 'designation',
      header: 'Designation',
      minWidth: 150,
      render: (employee) => employee.designation,
    },
    { id: 'manager', header: 'Manager', render: (employee) => employee.manager },
    { id: 'type', header: 'Type', render: (employee) => <PfBadge>{employee.type}</PfBadge> },
    { id: 'joined', header: 'Joined', render: (employee) => employee.joined },
    {
      id: 'allocation',
      header: 'Allocation',
      minWidth: 130,
      render: (employee) => <CapacityBar value={employee.allocation} />,
    },
    {
      id: 'billability',
      header: 'Billability',
      render: (employee) => (
        <PfBadge tone={employee.billability === 'Billable' ? 'green' : 'slate'}>
          {employee.billability}
        </PfBadge>
      ),
    },
  ];

  const completeBulkAction = () => {
    setSelectedIds([]);
    setBulkOpen(false);
  };

  return (
    <div className="pf-page">
      <div className="pf-planner-toolbar">
        <PfPageHeader title="Employees" subtitle="247 employees · 231 active">
          <button className="pf-button pf-button--ghost">⇩ Export</button>
          <div className="pf-bulk-menu">
            <button
              className="pf-button pf-button--ghost"
              disabled={!selectedIds.length}
              onClick={() => setBulkOpen(!bulkOpen)}
            >
              ⋯ Bulk Actions{selectedIds.length ? ` (${selectedIds.length})` : ''}
            </button>
            {bulkOpen && selectedIds.length > 0 && (
              <div role="menu" className="pf-bulk-menu__popover">
                {['Assign Department', 'Change Status', 'Set Billability', 'Export Selected'].map(
                  (action) => (
                    <button key={action} onClick={completeBulkAction}>
                      {action}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
          <button className="pf-button" onClick={() => navigate('/employees/new')}>
            ＋ Add Employee
          </button>
        </PfPageHeader>
      </div>
      <section className="pf-employee-filters">
        <label className="pf-employee-filters__search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search name, email or ID…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <FilterSelect
          label="Department"
          value={department}
          onChange={setDepartment}
          options={['All', 'Engineering', 'QA', 'Design']}
        />
        <FilterSelect
          label="Designation"
          value={designation}
          onChange={setDesignation}
          options={[
            'All',
            'Senior React Developer',
            'Backend Engineer',
            'QA Lead',
            'Java Developer',
            'UI/UX Designer',
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={['All', 'Active', 'Inactive', 'Overallocated', 'Releasing Soon']}
        />
        <FilterSelect
          label="Billability"
          value={billability}
          onChange={setBillability}
          options={['All', 'Billable', 'Non-Billable']}
        />
        <FilterSelect
          label="Employment Type"
          value={employmentType}
          onChange={setEmploymentType}
          options={['All', 'Full-Time', 'Contract']}
        />
        <div className="pf-applied-filters">
          <button type="button" className="pf-link" onClick={clearFilters}>
            Clear all
          </button>
          {appliedFilters.map(([label, value, remove]) => (
            <button type="button" className="pf-filter-chip" key={label} onClick={remove}>
              {value} ×
            </button>
          ))}
        </div>
      </section>

      {selectedIds.length > 0 && (
        <div className="pf-selection-bar">
          <strong>
            {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
          </strong>
          <button className="pf-link" onClick={() => setSelectedIds([])}>
            Clear selection
          </button>
        </div>
      )}
      <section className="pf-card pf-table-card">
        <DataTable
          columns={columns}
          data={visibleRows}
          rowKey="id"
          selectable
          selectedRowIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
          pagination={{ page: currentPage, pageSize, totalItems: rows.length, totalPages }}
          pageSizeOptions={[5, 10, 15, 25]}
          itemLabel="employees"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
