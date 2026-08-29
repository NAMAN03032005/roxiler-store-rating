import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from '../../utils/validation';

/**
 * Admin Add User Form Page with Live Character Counters & Password Requirement Checklist
 */
const AdminAddUserPage = () => {
  const navigate = useNavigate();
  const { addUser } = useData();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user', // Default to Normal User
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Live Password Criteria Verification
  const passLength = formData.password.length >= 8 && formData.password.length <= 16;
  const passUpper = /[A-Z]/.test(formData.password);
  const passSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const addressErr = validateAddress(formData.address);
    const passwordErr = validatePassword(formData.password);

    if (nameErr || emailErr || addressErr || passwordErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        address: addressErr,
        password: passwordErr,
      });
      addToast('error', 'Please fix form validation errors before submitting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      addUser(formData);
      addToast('success', `User account for "${formData.name}" added successfully!`);
      setIsLoading(false);
      navigate('/admin/users');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Add New System User</h2>
          <Link to="/admin/users" className="btn btn-outline btn-sm">
            ← Back to Users List
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field with Character Counter */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <span className={`char-counter ${formData.name.length > 60 ? 'over-limit' : formData.name.length < 20 ? 'near-limit' : ''}`}>
                {formData.name.length} / 60 chars (min 20)
              </span>
            </div>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Jonathan Alexander Sterling (20 to 60 chars)"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. user@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password Field with Live Checklist */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Set initial user password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

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
            </div>
          </div>

          {/* Address Field with Character Counter */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="address">
                Physical Address *
              </label>
              <span className={`char-counter ${formData.address.length > 400 ? 'over-limit' : ''}`}>
                {formData.address.length} / 400 chars
              </span>
            </div>
            <textarea
              id="address"
              name="address"
              rows="3"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="Enter complete physical address (max 400 characters)"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Assign User Role *
            </label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Adding User...' : 'Create User'}
            </button>
            <Link to="/admin/users" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUserPage;
