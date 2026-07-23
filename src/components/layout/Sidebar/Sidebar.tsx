import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_LABELS, SIDEBAR_ITEMS } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setSidebarOpen } from '@/redux/actions';

const icons: Record<string, string> = {
  dashboard: '◉',
  employees: '♟',
  bench: '▰',
  clients: '▪',
  projects: '⚭',
  allocations: '↪',
  planner: '▣',
  reports: '▤',
  departments: '♟',
  designations: '▣',
  skills: '♟',
  roles: '⬟',
  audit: '⟳',
};

export function Sidebar() {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch(setSidebarOpen(false));
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dispatch, mobileOpen]);

  const closeMobileSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <>
      <button
        className={`sidebar-backdrop${mobileOpen ? ' is-visible' : ''}`}
        type="button"
        aria-label={NAVIGATION_LABELS.CLOSE_MENU}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={closeMobileSidebar}
      />
      <aside
        id="primary-navigation"
        className={`sidebar pf-sidebar${mobileOpen ? ' sidebar--mobile-open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="pf-sidebar__brand">
          <span>♟</span>
          <strong>{NAVIGATION_LABELS.APP_NAME}</strong>
          <button
            ref={closeButtonRef}
            type="button"
            className="pf-sidebar__close"
            aria-label={NAVIGATION_LABELS.CLOSE_MENU}
            onClick={closeMobileSidebar}
          >
            ×
          </button>
        </div>
        <button className="pf-company" type="button">
          <b>AC</b>
          <span>{NAVIGATION_LABELS.COMPANY}</span>
          <i>⌄</i>
        </button>
        <nav>
          {SIDEBAR_ITEMS.map((group) => (
            <section key={group.section}>
              <h3>{group.section}</h3>
              {group.items.map(([id, title, path]) => (
                <NavLink key={id} to={path} onClick={closeMobileSidebar}>
                  <span>{icons[id]}</span>
                  <b>{title}</b>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className="pf-sidebar__user">
          <span className="pf-avatar">A</span>
          <span>
            <b>Arjun Kapoor</b>
            <small>Super Admin</small>
          </span>
        </div>
      </aside>
    </>
  );
}
