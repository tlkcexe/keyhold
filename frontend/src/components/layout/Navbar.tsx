import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { IconGithub } from '../ui/icons';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${
    isActive
      ? 'text-brand-600 dark:text-brand-400 font-medium'
      : 'text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100'
  }`;

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-ink-100 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-mono font-semibold text-ink-950 dark:text-white">
          <span className="grid h-7 w-7 grid-cols-3 gap-[1.5px] rounded-md bg-gradient-to-br from-brand-300 to-brand-500 p-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="rounded-[1px] bg-ink-950/40" />
            ))}
          </span>
          keyhold
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white transition-colors"
          >
            <IconGithub className="h-[18px] w-[18px]" />
          </a>

          <ThemeToggle />

          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-secondary py-1.5">
              Log out
            </button>
          ) : (
            <Link to="/login" className="btn-primary w-auto px-4 py-1.5">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
