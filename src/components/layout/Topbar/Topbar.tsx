import { useAppDispatch, useAppSelector } from '@/hooks';
import { Switch } from '@/components/common';
import { setSidebarOpen, setTheme } from '@/redux/actions';
import { selectSidebarOpen, selectTheme } from '@/redux/selectors';
import { NAVIGATION_LABELS } from '@/constants';
import { useLocation } from 'react-router-dom';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

export function Topbar() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const darkModeEnabled =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isEmployeeDetail = /^\/employees\/[^/]+$/.test(pathname);
  const isProjectDetail = /^\/projects\/[^/]+$/.test(pathname);
  const isAllocationsPage = pathname.startsWith('/allocations');
  const isCreateAllocation = pathname === '/allocations/new';
  const isResourcePlanner = pathname === '/resource-planner';
  const isRolesPage = pathname === '/settings/roles';
  const isAuditLogsPage = pathname === '/settings/audit-logs';
  const isDepartmentsPage = pathname === '/departments';
  const isDesignationsPage = pathname === '/designations';
  const isSkillsPage = pathname === '/skills';

  return (
    <header className="topbar">
      <button
        className="topbar__menu-toggle"
        type="button"
        aria-label={sidebarOpen ? NAVIGATION_LABELS.CLOSE_MENU : NAVIGATION_LABELS.OPEN_MENU}
        aria-expanded={sidebarOpen}
        aria-controls="primary-navigation"
        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className="topbar__breadcrumbs" aria-label="Breadcrumb">
        <span>Dashboard</span>
        {pathname.startsWith('/employees') && (
          <>
            <i>›</i>
            <span>Employees</span>
          </>
        )}
        {pathname.startsWith('/projects') && (
          <>
            <i>›</i>
            {isProjectDetail ? <span>Projects</span> : <strong>Projects</strong>}
          </>
        )}
        {isProjectDetail && (
          <>
            <i>›</i>
            <strong>NovaBank Customer Portal</strong>
          </>
        )}
        {isAllocationsPage && (
          <>
            <i>›</i>
            {isCreateAllocation ? (
              <span>Resource Allocations</span>
            ) : (
              <strong>Resource Allocations</strong>
            )}
          </>
        )}
        {isCreateAllocation && (
          <>
            <i>›</i>
            <strong>Create Allocation</strong>
          </>
        )}
        {isResourcePlanner && (
          <>
            <i>›</i>
            <strong>Resource Planner</strong>
          </>
        )}
        {isRolesPage && (
          <>
            <i>›</i>
            <strong>Roles & Permissions</strong>
          </>
        )}
        {isAuditLogsPage && (
          <>
            <i>›</i>
            <strong>Audit Logs</strong>
          </>
        )}
        {isDepartmentsPage && (
          <>
            <i>›</i>
            <strong>Departments</strong>
          </>
        )}
        {isDesignationsPage && (
          <>
            <i>›</i>
            <strong>Designations</strong>
          </>
        )}
        {isSkillsPage && (
          <>
            <i>›</i>
            <strong>Skills</strong>
          </>
        )}
        {isEmployeeDetail && (
          <>
            <i>›</i>
            <strong>Aditi Mehra</strong>
          </>
        )}
      </nav>
      <div className="topbar__actions">
        {!isEmployeeDetail &&
          !isProjectDetail &&
          !isAllocationsPage &&
          !isResourcePlanner &&
          !isRolesPage &&
          !isAuditLogsPage && (
            <input
              className="pf-global-search"
              placeholder={isSkillsPage ? '⌕  Search skills...' : '⌕  Global search...'}
            />
          )}
        <span className="pf-notification">
          <BellIcon />
          <b>5</b>
        </span>
        <Switch
          aria-label="Use dark theme"
          checked={darkModeEnabled}
          uncheckedIcon={<SunIcon />}
          checkedIcon={<MoonIcon />}
          onChange={(event) => dispatch(setTheme(event.target.checked ? 'dark' : 'light'))}
        />
        <span className="topbar__avatar" aria-label="Signed in as Arjun Kapoor">
          AK
        </span>
      </div>
    </header>
  );
}
