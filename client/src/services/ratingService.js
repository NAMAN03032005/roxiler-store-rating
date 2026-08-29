import API from './api';

/**
 * Rating Service - Express Backend REST Integration
 */
export const ratingService = {
  // POST /api/stores/:id/rating
  submitRating: async (storeId, ratingValue) => {
    const response = await API.post(`/stores/${storeId}/rating`, { rating: ratingValue });
    return response.data;
  },

  // GET /api/users/me/ratings
  getMyRatings: async () => {
    const response = await API.get('/users/me/ratings');
    return response.data;
  },

  // GET /api/users/me/dashboard
  getUserDashboard: async () => {
    const response = await API.get('/users/me/dashboard');
    return response.data;
  },
};
