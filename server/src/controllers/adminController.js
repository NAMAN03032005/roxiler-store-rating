const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');

/**
 * @desc    Get System Administrator dashboard analytics & chart datasets via Sequelize
 * @route   GET /api/admin/dashboard
 * @access  Private (ADMIN)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    const stores = await Store.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });
    const ratings = await Rating.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Store, as: 'store', attributes: ['id', 'name'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const totalUsers = users.length;
    const normalUsers = users.filter((u) => u.role === 'NORMAL_USER').length;
    const storeOwners = users.filter((u) => u.role === 'STORE_OWNER').length;
    const admins = users.filter((u) => u.role === 'ADMIN').length;

    const totalStores = stores.length;
    const totalRatings = ratings.length;

    const totalSum = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRatings > 0 ? (totalSum / totalRatings).toFixed(1) : '0.0';

    // 1. Recent Ratings List
    const recentRatingsList = ratings.slice(0, 5).map((r) => ({
      id: r.id,
      userName: r.user ? r.user.name : 'User',
      userEmail: r.user ? r.user.email : 'N/A',
      storeName: r.store ? r.store.name : 'Store',
      rating: r.rating,
      date: r.updatedAt.toISOString().split('T')[0],
    }));

    // 2. Ratings Over Time Data (Grouped by date)
    const countsByDate = {};
    ratings.forEach((r) => {
      const dateKey = r.createdAt ? r.createdAt.toISOString().split('T')[0] : '2026-08-29';
      countsByDate[dateKey] = (countsByDate[dateKey] || 0) + 1;
    });
    const sortedDates = Object.keys(countsByDate).sort();
    const timeSeriesData = sortedDates.map((date) => ({
      date,
      ratingsCount: countsByDate[date],
    }));

    // 3. Users by Role Donut Chart Data
    const roleChartData = [
      { name: 'Normal Users', value: normalUsers, color: '#4f46e5' },
      { name: 'Store Owners', value: storeOwners, color: '#f59e0b' },
      { name: 'Administrators', value: admins, color: '#ef4444' },
    ];

    // 4. Rating Distribution Bar Chart Data
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((r) => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating] += 1;
      }
    });
    const ratingDistributionData = [
      { ratingLabel: '5 Stars', count: dist[5], fill: '#22c55e' },
      { ratingLabel: '4 Stars', count: dist[4], fill: '#6366f1' },
      { ratingLabel: '3 Stars', count: dist[3], fill: '#f59e0b' },
      { ratingLabel: '2 Stars', count: dist[2], fill: '#f97316' },
      { ratingLabel: '1 Star', count: dist[1], fill: '#ef4444' },
    ];

    res.json({
      success: true,
      data: {
        totalUsers,
        normalUsers,
        storeOwners,
        admins,
        totalStores,
        totalRatings,
        avgRating,
        recentRatingsList,
        timeSeriesData,
        roleChartData,
        ratingDistributionData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (search, role filter, sorting)
 * @route   GET /api/admin/users
 * @access  Private (ADMIN)
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, sortField, sortOrder } = req.query;

    let whereObj = {};

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      whereObj[Op.or] = [
        { name: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { address: { [Op.like]: term } },
      ];
    }

    if (role && role !== 'ALL') {
      const roleUpper = role.toUpperCase();
      if (roleUpper === 'USER' || roleUpper === 'NORMAL_USER') whereObj.role = 'NORMAL_USER';
      else if (roleUpper === 'OWNER' || roleUpper === 'STORE_OWNER') whereObj.role = 'STORE_OWNER';
      else if (roleUpper === 'ADMIN') whereObj.role = 'ADMIN';
    }

    let orderArr = [['name', 'ASC']];
    if (sortField) {
      const dir = sortOrder === 'desc' ? 'DESC' : 'ASC';
      orderArr = [[sortField, dir]];
    }

    const users = await User.findAll({
      where: whereObj,
      attributes: { exclude: ['password'] },
      order: orderArr,
    });

    const formattedUsers = users.map((u) => ({
      _id: u.id,
      id: u.id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role === 'ADMIN' ? 'admin' : u.role === 'STORE_OWNER' ? 'owner' : 'user',
      createdAt: u.createdAt,
    }));

    res.json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user details by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (ADMIN)
 */
const getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role === 'ADMIN' ? 'admin' : user.role === 'STORE_OWNER' ? 'owner' : 'user',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new user (Normal User, Store Owner, or Admin)
 * @route   POST /api/admin/users
 * @access  Private (ADMIN)
 */
const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address) {
      res.status(400);
      throw new Error('Please enter all required fields');
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email address already exists');
    }

    let assignedRole = 'NORMAL_USER';
    if (role === 'admin' || role === 'ADMIN') assignedRole = 'ADMIN';
    else if (role === 'owner' || role === 'STORE_OWNER') assignedRole = 'STORE_OWNER';

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: assignedRole,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role === 'ADMIN' ? 'admin' : user.role === 'STORE_OWNER' ? 'owner' : 'user',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all stores for admin management
 * @route   GET /api/admin/stores
 * @access  Private (ADMIN)
 */
const getAdminStores = async (req, res, next) => {
  try {
    const { search, sortField, sortOrder } = req.query;

    let whereObj = {};
    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      whereObj[Op.or] = [
        { name: { [Op.like]: term } },
        { address: { [Op.like]: term } },
        { email: { [Op.like]: term } },
      ];
    }

    let orderArr = [['name', 'ASC']];
    if (sortField) {
      const dir = sortOrder === 'desc' ? 'DESC' : 'ASC';
      orderArr = [[sortField, dir]];
    }

    const stores = await Store.findAll({
      where: whereObj,
      order: orderArr,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Rating, as: 'ratings' },
      ],
    });

    const formattedStores = stores.map((s) => {
      const storeRatings = s.ratings || [];
      const totalRatings = storeRatings.length;
      const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
      const overallRating = totalRatings > 0 ? Math.round((sum / totalRatings) * 10) / 10 : 0;

      return {
        _id: s.id,
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        owner: s.owner,
        overallRating,
        totalRatings,
        createdAt: s.createdAt,
      };
    });

    res.json({
      success: true,
      count: formattedStores.length,
      data: formattedStores,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new merchant store
 * @route   POST /api/admin/stores
 * @access  Private (ADMIN)
 */
const createAdminStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      res.status(400);
      throw new Error('Please enter store name, email, and address');
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: store.id,
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        overallRating: 0,
        totalRatings: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get store details by ID for Admin
 * @route   GET /api/admin/stores/:id
 * @access  Private (ADMIN)
 */
const getAdminStoreById = async (req, res, next) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Rating, as: 'ratings' },
      ],
    });
    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }

    const storeRatings = store.ratings || [];
    const totalRatings = storeRatings.length;
    const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
    const overallRating = totalRatings > 0 ? Math.round((sum / totalRatings) * 10) / 10 : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    storeRatings.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    res.json({
      success: true,
      data: {
        _id: store.id,
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        overallRating,
        totalRatings,
        distribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  getAdminStores,
  createAdminStore,
  getAdminStoreById,
};
