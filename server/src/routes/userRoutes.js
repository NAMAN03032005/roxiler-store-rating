const express = require('express');
const router = express.Router();
const { getMyRatings, getUserDashboardData } = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me/ratings', protect, authorize('NORMAL_USER'), getMyRatings);
router.get('/me/dashboard', protect, authorize('NORMAL_USER'), getUserDashboardData);

module.exports = router;
