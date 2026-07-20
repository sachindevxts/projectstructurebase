import { useAppDispatch, useAppSelector } from '@/hooks';
import { Switch } from '@/components/common';
import { setSidebarOpen, setTheme } from '@/redux/actions';
import { selectSidebarOpen, selectTheme } from '@/redux/selectors';

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

export function Topbar() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const darkModeEnabled =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="topbar">
      <button
        className="topbar__menu-toggle"
        type="button"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={sidebarOpen}
        onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="topbar__brand">Dashboard</div>
      <div className="topbar__actions">
        <Switch
          aria-label="Use dark theme"
          checked={darkModeEnabled}
          uncheckedIcon={<SunIcon />}
          checkedIcon={<MoonIcon />}
          onChange={(event) => dispatch(setTheme(event.target.checked ? 'dark' : 'light'))}
        />
      </div>
    </header>
  );
}
