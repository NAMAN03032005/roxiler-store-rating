import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';

// Common & Layout
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAddUserPage from './pages/admin/AdminAddUserPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminAddStorePage from './pages/admin/AdminAddStorePage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserStoresPage from './pages/user/UserStoresPage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

/**
 * Root Redirect Handler for "/" route
 */
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* System Administrator Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<MainLayout pageTitle="System Administration" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/new" element={<AdminAddUserPage />} />
                  <Route path="/admin/stores" element={<AdminStoresPage />} />
                  <Route path="/admin/stores/new" element={<AdminAddStorePage />} />
                </Route>
              </Route>

              {/* Normal User Routes */}
              <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route element={<MainLayout pageTitle="User Portal" />}>
                  <Route path="/user" element={<UserDashboard />} />
                  <Route path="/user/stores" element={<UserStoresPage />} />
                  <Route path="/user/change-password" element={<ChangePasswordPage />} />
                </Route>
              </Route>

              {/* Store Owner Routes */}
              <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                <Route element={<MainLayout pageTitle="Store Owner Portal" />}>
                  <Route path="/owner" element={<OwnerDashboard />} />
                  <Route path="/owner/change-password" element={<ChangePasswordPage />} />
                </Route>
              </Route>

              {/* Default Fallback Redirect */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
