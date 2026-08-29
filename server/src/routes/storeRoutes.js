const express = require('express');
const router = express.Router();
const {
  getAllStores,
  getStoreById,
  submitStoreRating,
  getMyRatings,
  getUserDashboardData,
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public / Protected store browsing
router.get('/', protect, getAllStores);
router.get('/:id', protect, getStoreById);
router.post('/:id/rating', protect, authorize('NORMAL_USER'), submitStoreRating);

module.exports = router;
