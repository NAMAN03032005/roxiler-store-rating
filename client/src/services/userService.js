import API from './api';

/**
 * User Service - Express Backend REST Integration
 */
export const userService = {
  // GET /api/admin/users
  getAllUsers: async (params) => {
    const response = await API.get('/admin/users', { params });
    return response.data;
  },

  // GET /api/admin/users/:id
  getUserById: async (id) => {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  },

  // POST /api/admin/users
  createUser: async (userData) => {
    const response = await API.post('/admin/users', userData);
    return response.data;
  },
};
