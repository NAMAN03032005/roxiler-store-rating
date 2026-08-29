import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Star,
  LayoutDashboard,
  Users,
  UserPlus,
  Store,
  PlusCircle,
  Home,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar Navigation Component using Lucide React Icons
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'user';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Star size={18} color="#ffffff" fill="#ffffff" />
        </div>
        <span>Store Rating</span>
      </div>

      <nav className="sidebar-nav">
        {role === 'admin' && (
          <>
            <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/users" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Users size={18} />
              <span>Users List</span>
            </NavLink>
            <NavLink to="/admin/users/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <UserPlus size={18} />
              <span>Add New User</span>
            </NavLink>
            <NavLink to="/admin/stores" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Store size={18} />
              <span>Stores List</span>
            </NavLink>
            <NavLink to="/admin/stores/new" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <PlusCircle size={18} />
              <span>Add New Store</span>
            </NavLink>
          </>
        )}

        {role === 'user' && (
          <>
            <NavLink to="/user" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Home size={18} />
              <span>User Home</span>
            </NavLink>
            <NavLink to="/user/stores" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <Store size={18} />
              <span>Browse Stores</span>
            </NavLink>
            <NavLink to="/user/change-password" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <KeyRound size={18} />
              <span>Change Password</span>
            </NavLink>
          </>
        )}

        {role === 'owner' && (
          <>
            <NavLink to="/owner" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <LayoutDashboard size={18} />
              <span>Owner Dashboard</span>
            </NavLink>
            <NavLink to="/owner/change-password" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
              <KeyRound size={18} />
              <span>Change Password</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div style={{ fontWeight: 600 }}>{user?.name || 'Guest User'}</div>
          <div className="user-role">
            Role: {role === 'admin' ? 'System Administrator' : role === 'owner' ? 'Store Owner' : 'Normal User'}
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
