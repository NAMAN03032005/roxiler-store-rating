const express = require('express');
const router = express.Router();
const {
  getOwnerStore,
  getOwnerDashboard,
  getOwnerRatings,
} = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('STORE_OWNER'));

router.get('/store', getOwnerStore);
router.get('/dashboard', getOwnerDashboard);
router.get('/ratings', getOwnerRatings);

module.exports = router;
