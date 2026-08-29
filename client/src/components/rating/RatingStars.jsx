import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * RatingStars Component using Lucide React Star Icon
 * Supports read-only and interactive hover/selection modes.
 */
const RatingStars = ({ value = 0, onChange, readOnly = false, size = 20 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const currentRating = hoverValue || value;

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= currentRating;
        return (
          <span
            key={starIndex}
            className={`star-wrapper ${isFilled ? 'filled' : ''} ${!readOnly ? 'interactive' : ''}`}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            title={!readOnly ? `Rate ${starIndex} out of 5 stars` : `${value} / 5 stars`}
            aria-label={`Star ${starIndex}`}
            role={!readOnly ? 'button' : 'img'}
            style={{ cursor: readOnly ? 'default' : 'pointer', display: 'inline-flex' }}
          >
            <Star
              size={size}
              color={isFilled ? 'var(--star-gold)' : 'var(--gray-300)'}
              fill={isFilled ? 'var(--star-gold)' : 'none'}
              strokeWidth={1.5}
            />
          </span>
        );
      })}
      {value > 0 && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', marginLeft: '0.375rem' }}>
          ({value})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
