import React, { useState } from 'react';
import StoreTable from '../../components/tables/StoreTable';
import { ratingService } from '../../services/ratingService';

/**
 * Normal User Stores Listing Page
 * Allows searching by Name and Address, viewing overall rating, submitting and modifying star ratings.
 */
const UserStoresPage = () => {
  // Sample stores dataset with user ratings for Phase 1 frontend preview
  const [stores, setStores] = useState([
    {
      id: '101',
      name: 'Apex Electronics MegaStore',
      address: '404 Silicon Plaza, Technology District, Sector 5',
      overallRating: 4,
      userRating: 4,
    },
    {
      id: '102',
      name: 'Fresh Harvest Organic Market',
      address: '12 Green Valley Highway, Suburbia North',
      overallRating: 5,
      userRating: 5,
    },
    {
      id: '103',
      name: 'Urban Books & Crafts Emporium',
      address: '88 Heritage Lane, Cultural Square, Downtown',
      overallRating: 3,
      userRating: 0,
    },
    {
      id: '104',
      name: 'Starlight Coffee Roasters',
      address: '15 Promenade Avenue, Oceanfront Boulevard',
      overallRating: 4,
      userRating: 3,
    },
  ]);

  const handleRatingSubmit = async (storeId, newRating) => {
    // Update local state for immediate Phase 1 UI feedback
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, userRating: newRating } : store
      )
    );

    // Prepared function call structure for Express API in Phase 2
    try {
      // await ratingService.submitRating(storeId, newRating);
    } catch (err) {
      console.error('Failed to submit rating placeholder call:', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gray-900)' }}>
          Registered Stores & Ratings
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Search stores by Name or Address and click stars to submit or modify your ratings.
        </p>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <StoreTable stores={stores} isNormalUser={true} onRatingSubmit={handleRatingSubmit} />
      </div>
    </div>
  );
};

export default UserStoresPage;
