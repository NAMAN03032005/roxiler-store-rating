import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, BarChart3, Store, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { validateEmail } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';

/**
 * Enhanced Login Page Component with Database Authentication
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Inline Form Validation
    const emailErr = validateEmail(formData.email);
    const passErr = formData.password ? '' : 'Password is required.';

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate against Express Backend REST API
      const userObj = await login(formData);

      if (userObj) {
        setIsLoading(false);
        if (userObj.role === 'admin') navigate('/admin');
        else if (userObj.role === 'owner') navigate('/owner');
        else navigate('/user');
      }
    } catch (err) {
      setIsLoading(false);
      setApiError(
        err.response?.data?.message || 'Invalid email or password credentials. Please check your inputs.'
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-wrapper">
        {/* Left / Top Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <div className="brand-icon-box">
              <Star size={24} color="#ffffff" fill="#ffffff" />
            </div>
            <span className="brand-title">Roxiler Store Rating</span>
          </div>
          <h2 className="brand-headline">Discover stores. Share experiences. Make better choices.</h2>
          <p className="brand-description">
            An enterprise Store Rating & Feedback platform designed for System Administrators, Store Owners, and Normal Users.
          </p>

          <div className="brand-features">
            <div className="feature-item">
              <Star className="feature-icon" size={18} />
              <span>Rate registered merchant stores from 1 to 5 stars</span>
            </div>
            <div className="feature-item">
              <BarChart3 className="feature-icon" size={18} />
              <span>Track rating trends, reviews, and customer feedback</span>
            </div>
            <div className="feature-item">
              <Store className="feature-icon" size={18} />
              <span>Discover top-rated stores by name or physical location</span>
            </div>
          </div>
        </div>

        {/* Right / Main Login Form */}
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to access your account</p>
          </div>

          {apiError && <div className="alert alert-danger">{apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="e.g. admin.sterling@roxiler.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password Input with Lucide Show/Hide Toggle */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Submit Button with Loading Spinner */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner-icon" size={18} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 600 }}>
              Register as Normal User
            </Link>
          </div>

          <div className="login-hint-box">
            <ShieldCheck size={16} color="var(--primary-600)" />
            <span>
              <strong>Demo Credentials:</strong><br />
              👑 Admin: <code>admin.sterling@roxiler.com</code> / <code>Admin@Password123</code><br />
              💼 Owner: <code>beatrice.vance@apexelectronics.com</code> / <code>Owner@Password12</code><br />
              👤 User: <code>alexander.harrison@example.com</code> / <code>User@Password123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
