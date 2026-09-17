import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const items = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Deposit', to: '/deposit' },
  { label: 'Withdraw', to: '/withdraw' },
  { label: 'Transfer', to: '/transfer' },
  { label: 'History', to: '/transactions' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          MB
        </div>
        <div className="sidebar__brandcopy">
          <strong>MyBank</strong>
          <span>{user?.fullName || 'Customer'}</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Sidebar">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar__logout" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
