import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
} from '../../utils/validation';

/**
 * Normal User Registration Signup Page with Database Integration
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    // Perform comprehensive field validation
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
      return;
    }

    setIsLoading(true);

    try {
      // Register Normal User via Express Backend REST API
      const registeredUser = await signup(formData);

      if (registeredUser) {
        setSuccessMsg('Account registered successfully! Redirecting to user portal...');
        setTimeout(() => {
          navigate('/user');
        }, 1200);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <h1 className="auth-title">User Registration</h1>
          <p className="auth-subtitle">Create a Normal User account on Store Rating</p>
        </div>

        {apiError && <div className="alert alert-danger">{apiError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
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
            <div className="help-text">Must be between 20 and 60 characters.</div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. johnathan.sterling@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="Enter your complete residential address (max 400 chars)"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="help-text">Maximum 400 characters allowed.</div>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="help-text">
              8–16 characters, at least 1 uppercase letter & 1 special character.
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Registering Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
