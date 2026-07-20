import { NavLink } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '@/routes/routeConfig';
import { useAppSelector } from '@/hooks';
import { CanAccess } from '@/components/common/CanAccess/CanAccess';

export function Sidebar() {
  const user = useAppSelector((state) => state.auth?.user ?? null);

  const currentRole = user?.role ?? 'user';

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <nav>
        {SIDEBAR_ITEMS.filter((item) => !item.roles || item.roles.includes(currentRole)).map(
          (item) => (
            <CanAccess
              key={item.id}
              roles={item.roles}
              permissions={item.permissions}
              fallback={null}
            >
              <NavLink className="sidebar__link" to={item.path}>
                {item.title}
              </NavLink>
            </CanAccess>
          ),
        )}
      </nav>
    </aside>
  );
}
