import React from 'react';
import RatingStars from '../rating/RatingStars';

/**
 * Owner Rating Table displaying user ratings for Store Owner Dashboard
 */
const OwnerRatingTable = ({ ratings = [] }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Submitted Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((item, idx) => (
              <tr key={item.id || idx}>
                <td style={{ fontWeight: 600 }}>{item.userName}</td>
                <td>{item.userEmail}</td>
                <td>
                  <RatingStars value={item.rating} readOnly={true} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty-state">
                No user ratings have been submitted for your store yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerRatingTable;
