import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Accounts', to: '/accounts' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="navbar">
      <Link to="/dashboard" className="navbar-brand" aria-label="MyBank home">
        <span className="navbar-brand__mark" aria-hidden="true">
          MB
        </span>
        <span className="navbar-brand__text">
          <strong>MyBank</strong>
          <small>{user?.fullName || 'Customer'}</small>
        </span>
      </Link>

      <nav className="navbar-links" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `navbar-link${isActive ? ' navbar-link--active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="navbar-logout" onClick={logout}>
        Logout
      </button>
    </header>
  );
}
