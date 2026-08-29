import React from 'react';
import { Link } from 'react-router-dom';
import StoreTable from '../../components/tables/StoreTable';

/**
 * Admin Stores Management Page
 */
const AdminStoresPage = () => {
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
            Merchant Store Management
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Search, sort, filter, and inspect registered stores and customer rating performance.
          </p>
        </div>

        <Link to="/admin/stores/new" className="btn btn-primary">
          ➕ Add New Store
        </Link>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <StoreTable isNormalUser={false} />
      </div>
    </div>
  );
};

export default AdminStoresPage;
