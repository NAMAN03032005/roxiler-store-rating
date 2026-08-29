import API from './api';

/**
 * Store Service - Express Backend REST Integration
 */
export const storeService = {
  // GET /api/stores
  getAllStores: async (params) => {
    const response = await API.get('/stores', { params });
    return response.data;
  },

  // GET /api/stores/:id
  getStoreById: async (id) => {
    const response = await API.get(`/stores/${id}`);
    return response.data;
  },

  // POST /api/admin/stores
  createStore: async (storeData) => {
    const response = await API.post('/admin/stores', storeData);
    return response.data;
  },
};
