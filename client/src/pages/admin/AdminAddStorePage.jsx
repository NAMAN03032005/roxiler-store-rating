import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { validateStoreName, validateEmail, validateAddress } from '../../utils/validation';

/**
 * Admin Add Store Form Page
 */
const AdminAddStorePage = () => {
  const navigate = useNavigate();
  const { addStore } = useData();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateStoreName(formData.name);
    const emailErr = validateEmail(formData.email);
    const addressErr = validateAddress(formData.address);

    if (nameErr || emailErr || addressErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        address: addressErr,
      });
      addToast('error', 'Please fix validation errors before registering store.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      addStore(formData);
      addToast('success', `Store "${formData.name}" registered successfully!`);
      setIsLoading(false);
      navigate('/admin/stores');
    }, 400);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Add New Merchant Store</h2>
          <Link to="/admin/stores" className="btn btn-outline btn-sm">
            ← Back to Stores List
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Store Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Store Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Apex Electronics Emporium"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Store Contact Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. store@apex.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Address Field with Character Counter */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="address">
                Store Physical Address *
              </label>
              <span className={`char-counter ${formData.address.length > 400 ? 'over-limit' : ''}`}>
                {formData.address.length} / 400 chars
              </span>
            </div>
            <textarea
              id="address"
              name="address"
              rows="4"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="Enter complete store physical location (max 400 characters)"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Registering Store...' : 'Register Store'}
            </button>
            <Link to="/admin/stores" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddStorePage;
