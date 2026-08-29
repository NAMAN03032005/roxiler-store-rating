import React, { useState, useMemo } from 'react';
import RatingStars from '../rating/RatingStars';
import EmptyState from '../common/EmptyState';
import StoreDetailModal from '../modals/StoreDetailModal';
import { useData } from '../../context/DataContext';

/**
 * Store Table Component supporting view for Admin and Normal User with Rating actions & Store Details Modal
 */
const StoreTable = ({ isNormalUser = false }) => {
  const { stores, getStoreStats, getUserDashboardData } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('ALL'); // 'ALL', 'name', 'address', 'email'
  const [ratingFilter, setRatingFilter] = useState('ALL'); // 'ALL', '5', '4_PLUS', '3_PLUS', 'BELOW_3'
  const [ratedFilter, setRatedFilter] = useState('ALL'); // 'ALL', 'RATED', 'UNRATED'
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = getUserDashboardData(null);
  const userRatingsMap = userData.userSubmittedRatingsMap || {};

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
    setSearchField('ALL');
    setRatingFilter('ALL');
    setRatedFilter('ALL');
    setSortField('name');
    setSortDirection('asc');
  };

  const processedStores = useMemo(() => {
    return stores
      .map((store) => {
        const stats = getStoreStats(store.id);
        const myRating = userRatingsMap[store.id] || 0;
        return {
          ...store,
          overallRating: stats.overallRating,
          ratingCount: stats.ratingCount,
          myRating,
        };
      })
      .filter((store) => {
        // Search Filter
        const query = searchTerm.toLowerCase().trim();
        if (query) {
          if (searchField === 'name' && !store.name.toLowerCase().includes(query)) return false;
          if (searchField === 'address' && !store.address.toLowerCase().includes(query)) return false;
          if (searchField === 'email' && store.email && !store.email.toLowerCase().includes(query)) return false;
          if (
            searchField === 'ALL' &&
            !store.name.toLowerCase().includes(query) &&
            !store.address.toLowerCase().includes(query) &&
            (!store.email || !store.email.toLowerCase().includes(query))
          ) {
            return false;
          }
        }

        // Rating Filter
        if (ratingFilter === '5' && store.overallRating !== 5) return false;
        if (ratingFilter === '4_PLUS' && store.overallRating < 4) return false;
        if (ratingFilter === '3_PLUS' && store.overallRating < 3) return false;
        if (ratingFilter === 'BELOW_3' && store.overallRating >= 3 && store.overallRating > 0) return false;

        // Rated Filter for Normal User
        if (isNormalUser) {
          if (ratedFilter === 'RATED' && store.myRating === 0) return false;
          if (ratedFilter === 'UNRATED' && store.myRating > 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [stores, searchTerm, searchField, ratingFilter, ratedFilter, sortField, sortDirection, getStoreStats, userRatingsMap, isNormalUser]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const openStoreDetail = (storeObj) => {
    setSelectedStore(storeObj);
    setIsModalOpen(true);
  };

  const hasActiveFilters = searchTerm !== '' || searchField !== 'ALL' || ratingFilter !== 'ALL' || ratedFilter !== 'ALL';

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <div className="toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="form-control"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Field:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="ALL">All Fields</option>
            <option value="name">Store Name</option>
            <option value="address">Address</option>
            {!isNormalUser && <option value="email">Email</option>}
          </select>

          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rating:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4_PLUS">4+ Stars</option>
            <option value="3_PLUS">3+ Stars</option>
            <option value="BELOW_3">Below 3 Stars</option>
          </select>

          {isNormalUser && (
            <>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</label>
              <select
                className="form-control"
                style={{ width: 'auto' }}
                value={ratedFilter}
                onChange={(e) => setRatedFilter(e.target.value)}
              >
                <option value="ALL">All Stores</option>
                <option value="RATED">Rated by Me</option>
                <option value="UNRATED">Not Rated Yet</option>
              </select>
            </>
          )}

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
          Showing <strong>{processedStores.length}</strong> of <strong>{stores.length}</strong> registered stores
        </span>
      </div>

      {/* Stores Data Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Store Name {renderSortIndicator('name')}
              </th>
              {!isNormalUser && (
                <th className="sortable" onClick={() => handleSort('email')}>
                  Email {renderSortIndicator('email')}
                </th>
              )}
              <th className="sortable" onClick={() => handleSort('address')}>
                Address {renderSortIndicator('address')}
              </th>
              <th className="sortable" onClick={() => handleSort('overallRating')}>
                Overall Rating {renderSortIndicator('overallRating')}
              </th>
              <th className="sortable" onClick={() => handleSort('ratingCount')}>
                Ratings Count {renderSortIndicator('ratingCount')}
              </th>
              {isNormalUser && <th>My Rating</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedStores.length > 0 ? (
              processedStores.map((store) => (
                <tr key={store.id}>
                  <td style={{ fontWeight: 600 }}>
                    <button
                      onClick={() => openStoreDetail(store)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-600)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: 0,
                      }}
                    >
                      {store.name}
                    </button>
                  </td>
                  {!isNormalUser && <td>{store.email}</td>}
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{store.address}</td>
                  <td>
                    <RatingStars value={Math.round(store.overallRating)} readOnly={true} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                      ({store.overallRating > 0 ? store.overallRating.toFixed(1) : 'Unrated'})
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{store.ratingCount}</td>
                  {isNormalUser && (
                    <td>
                      {store.myRating > 0 ? (
                        <RatingStars value={store.myRating} readOnly={true} />
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unrated</span>
                      )}
                    </td>
                  )}
                  <td>
                    <button onClick={() => openStoreDetail(store)} className="btn btn-outline btn-sm">
                      {isNormalUser ? (store.myRating > 0 ? 'Update Rating' : 'Rate Now') : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isNormalUser ? 6 : 6}>
                  <EmptyState
                    title="No Stores Found"
                    message="No registered stores match your search query or selected rating filters."
                    onClearFilters={hasActiveFilters ? resetFilters : null}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Store Details Modal */}
      <StoreDetailModal
        store={selectedStore}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StoreTable;
