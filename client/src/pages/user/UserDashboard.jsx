import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Clock, BarChart3, ArrowRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import RatingStars from '../../components/rating/RatingStars';
import StoreDetailModal from '../../components/modals/StoreDetailModal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Normal User Home Dashboard Page (Dynamic Data Driven with Lucide Icons)
 */
const UserDashboard = () => {
  const { user } = useAuth();
  const { getUserDashboardData } = useData();

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics = getUserDashboardData(user);

  const openRatingModal = (storeObj) => {
    setSelectedStore(storeObj);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gray-900)' }}>
          Welcome back, {user?.name || 'Valued User'}!
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Track your store reviews, submit new ratings, and discover top-rated merchant locations.
        </p>
      </div>

      {/* Dynamically Computed Stat Cards with Lucide Icons */}
      <div className="stats-grid">
        <StatCard
          label="Total Available Stores"
          value={metrics.totalStoresCount}
          icon={Store}
          badgeText="Registered Merchants"
        />
        <StatCard
          label="Stores Rated By You"
          value={metrics.ratedStoresCount}
          icon={Star}
          badgeText={`${metrics.ratedStoresCount} Reviews Submitted`}
        />
        <StatCard
          label="Pending Ratings"
          value={metrics.pendingStoresCount}
          icon={Clock}
          badgeText="Stores Awaiting Your Review"
        />
        <StatCard
          label="Platform Avg Score"
          value={`${metrics.platformAvgRating} / 5`}
          icon={BarChart3}
          badgeText="Cumulative Community Score"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Stores Needing Your Rating Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Stores Needing Your Rating</h3>
            <Link to="/user/stores" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {metrics.unratedStores.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {metrics.unratedStores.slice(0, 3).map((store) => (
                <div
                  key={store.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-900)' }}>
                      {store.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {store.address}
                    </div>
                  </div>
                  <button onClick={() => openRatingModal(store)} className="btn btn-primary btn-sm">
                    Rate Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '1.5rem 0' }}>
              <p>🎉 Awesome! You have submitted ratings for all registered stores.</p>
            </div>
          )}
        </div>

        {/* Recent Activity Log Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Recent Activity</h3>
          </div>

          {metrics.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.recentActivity.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderBottom: '1px solid var(--gray-100)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      You rated <strong>{act.storeName}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {act.date}
                    </div>
                  </div>
                  <RatingStars value={act.rating} readOnly={true} size={16} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '1.5rem 0' }}>
              <p>No rating activity logged yet. Click "Rate Now" to leave your first review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Store Details / Rating Modal */}
      <StoreDetailModal
        store={selectedStore}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;
