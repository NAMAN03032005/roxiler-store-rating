import React from 'react';
import { Wrench, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Top Navigation Bar Header Component using Lucide React Icons
 */
const Header = ({ title = 'Dashboard', onToggleMobileMenu }) => {
  const { user, switchRole, logout } = useAuth();

  return (
    <div>
      {/* Dev Mode Role Switcher Banner */}
      <div className="dev-role-bar">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Wrench size={14} color="#b45309" />
          <strong>Dev Preview Mode:</strong> Switch active user role to preview UI screens:
        </span>
        <select
          className="dev-role-select"
          value={user?.role || 'user'}
          onChange={(e) => switchRole(e.target.value)}
        >
          <option value="admin">System Administrator</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>

      <header className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-menu-btn" onClick={onToggleMobileMenu} title="Toggle Sidebar Navigation">
            <Menu size={20} />
          </button>
          <h1 className="page-title">{title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            <User size={16} color="var(--primary-600)" />
            <span>{user?.name}</span>
          </div>

          <button onClick={logout} className="btn btn-outline btn-sm">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
