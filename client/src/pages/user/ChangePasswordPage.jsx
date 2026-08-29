import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { validatePassword } from '../../utils/validation';

/**
 * Reusable Change Password Page with Database Integration
 */
const ChangePasswordPage = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const passLength = formData.newPassword.length >= 8 && formData.newPassword.length <= 16;
  const passUpper = /[A-Z]/.test(formData.newPassword);
  const passSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword);
  const passMatch = formData.newPassword.length > 0 && formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oldErr = formData.oldPassword ? '' : 'Current password is required.';
    const newErr = validatePassword(formData.newPassword);
    let confirmErr = '';

    if (formData.newPassword !== formData.confirmPassword) {
      confirmErr = 'New password and confirmation password do not match.';
    }

    if (oldErr || newErr || confirmErr) {
      setErrors({
        oldPassword: oldErr,
        newPassword: newErr,
        confirmPassword: confirmErr,
      });
      addToast('error', 'Please ensure all password criteria are satisfied.');
      return;
    }

    setIsLoading(true);

    try {
      // Call PUT /api/auth/change-password
      const res = await authService.changePassword(formData);
      if (res.success) {
        addToast('success', 'Your password has been updated in the database!');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Failed to update password. Verify your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} color="var(--primary-600)" />
            Change Account Password
          </h2>
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="btn btn-outline btn-sm"
          >
            {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Old Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="oldPassword">
              Current Password *
            </label>
            <input
              id="oldPassword"
              type={showPasswords ? 'text' : 'password'}
              name="oldPassword"
              className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
              placeholder="Enter current password"
              value={formData.oldPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.oldPassword && <span className="error-message">{errors.oldPassword}</span>}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              New Password *
            </label>
            <input
              id="newPassword"
              type={showPasswords ? 'text' : 'password'}
              name="newPassword"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}

            {/* Live Criteria Checklist */}
            <div className="checklist">
              <div className={`checklist-item ${passLength ? 'checklist-pass' : 'checklist-fail'}`}>
                {passLength ? '✓' : '○'} 8–16 characters long
              </div>
              <div className={`checklist-item ${passUpper ? 'checklist-pass' : 'checklist-fail'}`}>
                {passUpper ? '✓' : '○'} At least one uppercase letter (A-Z)
              </div>
              <div className={`checklist-item ${passSpecial ? 'checklist-pass' : 'checklist-fail'}`}>
                {passSpecial ? '✓' : '○'} At least one special character (!@#$%^&*)
              </div>
              <div className={`checklist-item ${passMatch ? 'checklist-pass' : 'checklist-fail'}`}>
                {passMatch ? '✓' : '○'} New password and confirmation match
              </div>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm New Password *
            </label>
            <input
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner-icon" size={16} />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
