import React from 'react';

/**
 * StatCard Component for Dashboard Overview Metrics
 * Accepts Lucide React Icon components directly as icon prop
 */
const StatCard = ({ label, value, icon: IconComponent, badgeText }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {IconComponent ? <IconComponent size={24} color="var(--primary-600)" /> : null}
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {badgeText && <span className="help-text">{badgeText}</span>}
      </div>
    </div>
  );
};

export default StatCard;
