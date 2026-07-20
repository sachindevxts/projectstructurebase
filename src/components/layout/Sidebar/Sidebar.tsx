import { NavLink, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '@/routes/routeConfig';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { CanAccess } from '@/components/common/CanAccess/CanAccess';
import { logout } from '@/redux/actions';
import { ROUTES } from '@/constants';

function NavIcon({ name }: { name: string }) {
  if (name === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19v-2.2A4.8 4.8 0 0 1 8.3 12h1.4a4.8 4.8 0 0 1 4.8 4.8V19M15 5.5a3 3 0 0 1 0 5.8M17 12.5a4.5 4.5 0 0 1 3.5 4.3V19" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v9M7.1 5.7a8 8 0 1 0 9.8 0" />
    </svg>
  );
}

export function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth?.user ?? null);
  const collapsed = useAppSelector((state) => !state.ui.sidebarOpen);
  const currentRole = user?.role ?? 'user';
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside
      className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar__brand" title="Project Structure">
        <span className="sidebar__brand-full">Project Structure</span>
        <span className="sidebar__brand-short">P</span>
      </div>

      <div className="sidebar__profile">
        <span className="sidebar__avatar" aria-hidden="true">
          {initials || 'PS'}
        </span>
        <span className="sidebar__profile-copy">
          <strong>{user?.name ?? 'Guest User'}</strong>
          <small>My Account</small>
        </span>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__section-label">Menu</span>
        {SIDEBAR_ITEMS.filter((item) => !item.roles || item.roles.includes(currentRole)).map(
          (item) => (
            <CanAccess
              key={item.id}
              roles={item.roles}
              permissions={item.permissions}
              fallback={null}
            >
              <NavLink className="sidebar__link" to={item.path} title={item.title}>
                <span className="sidebar__icon">
                  <NavIcon name={item.id} />
                </span>
                <span className="sidebar__link-label">{item.title}</span>
              </NavLink>
            </CanAccess>
          ),
        )}
      </nav>

      <button className="sidebar__logout" type="button" onClick={handleLogout} title="Log out">
        <span className="sidebar__icon">
          <LogoutIcon />
        </span>
        <span className="sidebar__link-label">Log Out</span>
      </button>
    </aside>
  );
}
