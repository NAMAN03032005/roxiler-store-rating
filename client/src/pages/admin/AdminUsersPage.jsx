import React from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../../components/tables/UserTable';
import { useData } from '../../context/DataContext';

/**
 * Admin Users Management Page
 */
const AdminUsersPage = () => {
  const { users } = useData();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gray-900)' }}>
            User Account Management
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Search, sort, filter, and inspect registered System Administrators, Store Owners, and Normal Users.
          </p>
        </div>

        <Link to="/admin/users/new" className="btn btn-primary">
          ➕ Add New User
        </Link>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <UserTable users={users} />
      </div>
    </div>
  );
};

export default AdminUsersPage;
