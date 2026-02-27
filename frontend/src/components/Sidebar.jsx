import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/enlarged_full_logo.svg';

const navItems = [
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Bookings', path: '/admin/bookings' },
  { label: 'Inventory', path: '/admin/inventory' },
  { label: 'Calendar', path: '/admin/calendar' },
];

export default function Sidebar({ isOpen = true }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen shrink-0 overflow-hidden"
      style={{
        width: isOpen ? '220px' : '0px',
        transition: 'width 300ms ease-in-out',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: isOpen ? '1px solid var(--color-border-subtle)' : 'none',
      }}
    >
      {/* Brand */}
      <div
        className="flex justify-center px-5 py-5"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        <img src={logo} alt="Every Milestone Rentals" className="w-36 h-36 object-contain" />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
              backgroundColor: isActive ? 'var(--color-border-subtle)' : 'transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        {confirming ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
              Are you sure?
            </p>
            <div className="flex gap-2">
              <Button variant="success" onClick={() => navigate('/login')} className="flex-1">
                Yes
              </Button>
              <Button variant="danger" onClick={() => setConfirming(false)} className="flex-1">
                No
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setConfirming(true)} className="w-full">
            Logout
          </Button>
        )}
      </div>
    </aside>
  );
}
