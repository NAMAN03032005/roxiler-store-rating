import API from './api';

/**
 * Store Owner Service - Express Backend REST Integration
 */
export const ownerService = {
  // GET /api/owner/store
  getOwnerStore: async () => {
    const response = await API.get('/owner/store');
    return response.data;
  },

  // GET /api/owner/dashboard
  getOwnerDashboard: async () => {
    const response = await API.get('/owner/dashboard');
    return response.data;
  },

  // GET /api/owner/ratings
  getOwnerRatings: async () => {
    const response = await API.get('/owner/ratings');
    return response.data;
  },
};
