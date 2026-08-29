import React from 'react';
import { User, Mail, MapPin, ShieldCheck, Store, Star } from 'lucide-react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

/**
 * User Details View Modal for Admin Management using Lucide Icons
 */
const UserDetailModal = ({ user, isOpen, onClose }) => {
  const { stores, ratings } = useData();

  if (!user) return null;

  const ownedStore = user.role === 'owner' ? stores.find((s) => s.ownerId === user.id || s.email === user.email) : null;
  const submittedRatingsCount = user.role === 'user' ? ratings.filter((r) => r.userId === user.id || r.userEmail === user.email).length : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div style={{ fontSize: '0.9rem', color: 'var(--gray-800)' }}>
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)' }}>{user.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Role:</label>
          <span
            className={`badge ${
              user.role === 'admin' ? 'badge-admin' : user.role === 'owner' ? 'badge-owner' : 'badge-user'
            }`}
          >
            {user.role === 'admin' ? 'System Administrator' : user.role === 'owner' ? 'Store Owner' : 'Normal User'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Address:</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', color: 'var(--gray-700)' }}>
            <MapPin size={16} color="var(--primary-600)" style={{ marginTop: '2px' }} />
            <span style={{ wordBreak: 'break-word' }}>{user.address}</span>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
          <label className="form-label" style={{ marginBottom: '0.375rem' }}>Role Metadata:</label>
          {user.role === 'admin' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
              <ShieldCheck size={16} color="var(--danger-700)" />
              <span>Full administrative privileges (User & Store Management).</span>
            </div>
          )}

          {user.role === 'owner' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
              <Store size={16} color="var(--warning-600)" />
              <span><strong>Assigned Store:</strong> {ownedStore ? ownedStore.name : 'No store linked yet'}</span>
            </div>
          )}

          {user.role === 'user' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
              <Star size={16} color="var(--star-gold)" />
              <span><strong>Submitted Ratings:</strong> {submittedRatingsCount} reviews submitted</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailModal;
