import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, KeyRound } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import OwnerRatingTable from '../../components/tables/OwnerRatingTable';
import { useData } from '../../context/DataContext';

/**
 * Store Owner Dashboard View using Lucide React Icons
 */
const OwnerDashboard = () => {
  const { getOwnerDashboardData } = useData();

  const data = getOwnerDashboardData('str_101');
  const { store, overallRating, ratingCount, distribution, storeRatings } = data;

  const totalRatings = ratingCount || 1;

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
            Store Owner Dashboard
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Performance analytics and customer ratings for <strong>{store?.name}</strong>.
          </p>
        </div>

        <Link to="/owner/change-password" className="btn btn-outline">
          <KeyRound size={15} />
          <span>Change Password</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Average Store Rating"
          value={overallRating > 0 ? `${overallRating.toFixed(1)} / 5` : 'N/A'}
          icon={Star}
          badgeText="Cumulative Customer Score"
        />
        <StatCard
          label="Ratings Received"
          value={ratingCount}
          icon={Users}
          badgeText="Total Reviews Submitted"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Rating Breakdown & Store Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Rating Distribution Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Rating Distribution</h3>
            </div>
            <div>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const pct = Math.round((count / totalRatings) * 100);
                return (
                  <div key={star} className="rating-bar-row">
                    <span className="rating-bar-label">{star} ★</span>
                    <div className="rating-bar-track">
                      <div className="rating-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="rating-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store Info Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Store Summary</h3>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Store Name:</strong> {store?.name}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Email:</strong> {store?.email}
              </p>
              <p>
                <strong>Address:</strong> {store?.address}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Customer Reviews & Ratings Log</h3>
          </div>
          <OwnerRatingTable ratings={storeRatings} />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
