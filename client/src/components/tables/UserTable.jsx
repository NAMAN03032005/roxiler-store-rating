import React, { useState, useMemo } from 'react';
import EmptyState from '../common/EmptyState';
import UserDetailModal from '../modals/UserDetailModal';

/**
 * Reusable User Table Component with Sorting, Multi-field Filtering, & User Detail Modal
 */
const UserTable = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('ALL');
    setSortField('name');
    setSortDirection('asc');
  };

  const processedUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const query = searchTerm.toLowerCase().trim();
        const matchesQuery =
          !query ||
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.address.toLowerCase().includes(query);
        return matchesRole && matchesQuery;
      })
      .sort((a, b) => {
        let valA = (a[sortField] || '').toString().toLowerCase();
        let valB = (b[sortField] || '').toString().toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, roleFilter, sortField, sortDirection]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const openDetails = (userObj) => {
    setSelectedUser(userObj);
    setIsModalOpen(true);
  };

  const hasActiveFilters = searchTerm !== '' || roleFilter !== 'ALL';

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Role:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
            <option value="admin">System Administrator</option>
          </select>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn btn-secondary btn-sm">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Result Count Indicator */}
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="results-count">
          Showing <strong>{processedUsers.length}</strong> of <strong>{users.length}</strong> registered users
        </span>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Name {renderSortIndicator('name')}
              </th>
              <th className="sortable" onClick={() => handleSort('email')}>
                Email {renderSortIndicator('email')}
              </th>
              <th className="sortable" onClick={() => handleSort('address')}>
                Address {renderSortIndicator('address')}
              </th>
              <th className="sortable" onClick={() => handleSort('role')}>
                Role {renderSortIndicator('role')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedUsers.length > 0 ? (
              processedUsers.map((userObj) => (
                <tr key={userObj.id || userObj.email}>
                  <td style={{ fontWeight: 600 }}>{userObj.name}</td>
                  <td>{userObj.email}</td>
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{userObj.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        userObj.role === 'admin'
                          ? 'badge-admin'
                          : userObj.role === 'owner'
                          ? 'badge-owner'
                          : 'badge-user'
                      }`}
                    >
                      {userObj.role === 'admin'
                        ? 'Admin'
                        : userObj.role === 'owner'
                        ? 'Store Owner'
                        : 'Normal User'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => openDetails(userObj)} className="btn btn-outline btn-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <EmptyState
                    title="No Users Found"
                    message="No user profiles match your search criteria or role filter."
                    onClearFilters={hasActiveFilters ? resetFilters : null}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserTable;
