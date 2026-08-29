const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  getAdminStores,
  createAdminStore,
  getAdminStoreById,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserById);
router.post('/users', createAdminUser);
router.get('/stores', getAdminStores);
router.get('/stores/:id', getAdminStoreById);
router.post('/stores', createAdminStore);

module.exports = router;
