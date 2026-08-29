import API from './api';

/**
 * Auth Service - Express Backend REST Integration
 */
export const authService = {
  // POST /api/auth/login
  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // POST /api/auth/register
  signup: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // GET /api/auth/me
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // PUT /api/auth/change-password
  changePassword: async (passwordData) => {
    const response = await API.put('/auth/change-password', passwordData);
    return response.data;
  },
};
