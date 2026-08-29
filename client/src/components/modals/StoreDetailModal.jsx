import React, { useState, useEffect } from 'react';
import { Store, Mail, MapPin, Star, X } from 'lucide-react';
import Modal from '../common/Modal';
import RatingStars from '../rating/RatingStars';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/**
 * Store Detail & Interactive Rating Modal using Lucide Icons
 */
const StoreDetailModal = ({ store, isOpen, onClose }) => {
  const { getStoreStats, submitOrUpdateRating, ratings } = useData();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [selectedRating, setSelectedRating] = useState(0);

  const storeStats = store ? getStoreStats(store.id) : { overallRating: 0, ratingCount: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

  const userRatingObj = user && store
    ? ratings.find((r) => r.storeId === store.id && (r.userId === user.id || r.userEmail === user.email))
    : null;

  const existingRating = userRatingObj ? userRatingObj.rating : 0;

  useEffect(() => {
    if (existingRating > 0) {
      setSelectedRating(existingRating);
    } else {
      setSelectedRating(0);
    }
  }, [existingRating, isOpen, store]);

  if (!store) return null;

  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      addToast('error', 'Please select a star rating from 1 to 5 before submitting.');
      return;
    }

    submitOrUpdateRating(store.id, selectedRating, user);

    if (existingRating > 0) {
      addToast('success', `Updated your rating for ${store.name} to ${selectedRating} stars!`);
    } else {
      addToast('success', `Submitted ${selectedRating}-star rating for ${store.name}!`);
    }
    onClose();
  };

  const total = storeStats.ratingCount || 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={store.name}>
      <div>
        {/* Store Profile Information */}
        <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={16} color="var(--primary-600)" />
            <span><strong>Email:</strong> {store.email || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--primary-600)" style={{ marginTop: '3px' }} />
            <span><strong>Address:</strong> {store.address}</span>
          </div>
        </div>

        {/* Rating Summary Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>
              {storeStats.overallRating > 0 ? storeStats.overallRating.toFixed(1) : 'N/A'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {storeStats.ratingCount} {storeStats.ratingCount === 1 ? 'Rating' : 'Total Ratings'}
            </div>
          </div>
          <div>
            <RatingStars value={Math.round(storeStats.overallRating)} readOnly={true} size={22} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Overall Customer Score
            </div>
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Rating Breakdown
          </h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = storeStats.distribution[star] || 0;
            const pct = Math.round((count / total) * 100);
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

        {/* User Interactive Rating Form (For Normal Users) */}
        {user?.role === 'user' && (
          <div
            style={{
              borderTop: '1px solid var(--gray-200)',
              paddingTop: '1.25rem',
              marginTop: '1rem',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {existingRating > 0 ? 'Your Current Rating' : 'Rate This Store'}
            </h4>

            {existingRating > 0 && (
              <div className="alert alert-success" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                You previously rated this store {existingRating} out of 5 stars.
              </div>
            )}

            <form onSubmit={handleSubmitRating}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>
                  Select Rating (1 to 5 Stars):
                </label>
                <RatingStars
                  value={selectedRating}
                  onChange={(rating) => setSelectedRating(rating)}
                  readOnly={false}
                  size={28}
                />
                {selectedRating > 0 && (
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)', marginTop: '0.375rem' }}>
                    You selected {selectedRating} / 5 stars
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                {existingRating > 0 ? 'Update Rating' : 'Submit Rating'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreDetailModal;
