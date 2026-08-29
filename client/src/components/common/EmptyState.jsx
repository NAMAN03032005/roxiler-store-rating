import React from 'react';
import { SearchX } from 'lucide-react';

/**
 * Reusable EmptyState Component using Lucide Icons
 */
const EmptyState = ({
  icon: IconComponent = SearchX,
  title = 'No Records Found',
  message = 'Try adjusting your search criteria or clearing filters.',
  onClearFilters,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <IconComponent size={40} color="var(--gray-400)" />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: onClearFilters ? '1rem' : 0 }}>
        {message}
      </p>
      {onClearFilters && (
        <button onClick={onClearFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
          Reset All Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
