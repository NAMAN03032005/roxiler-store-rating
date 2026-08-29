const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

/**
 * Helper to compute average rating and total ratings for a store
 */
const computeStoreMetrics = async (storeId) => {
  const storeRatings = await Rating.findAll({ where: { storeId } });
  const total = storeRatings.length;
  if (total === 0) return { overallRating: 0, totalRatings: 0 };
  const sum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / total) * 10) / 10;
  return { overallRating: avg, totalRatings: total };
};

/**
 * @desc    Get all stores with optional search, filtering, and sorting
 * @route   GET /api/stores
 * @access  Public / Private
 */
const getAllStores = async (req, res, next) => {
  try {
    const { search, field, sortField, sortOrder } = req.query;

    let whereObj = {};

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      if (field === 'name') {
        whereObj.name = { [Op.like]: term };
      } else if (field === 'address') {
        whereObj.address = { [Op.like]: term };
      } else if (field === 'email') {
        whereObj.email = { [Op.like]: term };
      } else {
        whereObj[Op.or] = [
          { name: { [Op.like]: term } },
          { address: { [Op.like]: term } },
          { email: { [Op.like]: term } },
        ];
      }
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

    let userRatingsMap = {};
    if (req.user) {
      const userRatings = await Rating.findAll({ where: { userId: req.user.id } });
      userRatingsMap = userRatings.reduce((acc, r) => {
        acc[r.storeId] = r.rating;
        return acc;
      }, {});
    }

    const formattedStores = stores.map((s) => {
      const ratings = s.ratings || [];
      const totalRatings = ratings.length;
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
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
        myRating: userRatingsMap[s.id] || 0,
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
 * @desc    Get single store details by ID
 * @route   GET /api/stores/:id
 * @access  Public / Private
 */
const getStoreById = async (req, res, next) => {
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

    let myRating = 0;
    if (req.user) {
      const userRating = await Rating.findOne({
        where: { storeId: store.id, userId: req.user.id },
      });
      if (userRating) myRating = userRating.rating;
    }

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
        myRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit or Update rating for a store
 * @route   POST /api/stores/:id/rating
 * @access  Private (NORMAL_USER)
 */
const submitStoreRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const storeId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Rating value must be an integer between 1 and 5');
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }

    let userRating = await Rating.findOne({
      where: { storeId, userId: req.user.id },
    });

    let isNew = false;
    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      isNew = true;
      userRating = await Rating.create({
        storeId,
        userId: req.user.id,
        rating,
      });
    }

    const { overallRating, totalRatings } = await computeStoreMetrics(storeId);

    res.json({
      success: true,
      message: isNew ? 'Rating submitted successfully' : 'Rating updated successfully',
      data: {
        rating: userRating.rating,
        overallRating,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ratings submitted by authenticated user
 * @route   GET /api/users/me/ratings
 * @access  Private (NORMAL_USER)
 */
const getMyRatings = async (req, res, next) => {
  try {
    const userRatings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'address', 'email'] }],
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      success: true,
      data: userRatings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dynamic dashboard metrics for Normal User
 * @route   GET /api/users/me/dashboard
 * @access  Private (NORMAL_USER)
 */
const getUserDashboardData = async (req, res, next) => {
  try {
    const allStores = await Store.findAll();
    const totalStoresCount = allStores.length;

    const userRatings = await Rating.findAll({
      where: { userId: req.user.id },
      include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'address'] }],
      order: [['updatedAt', 'DESC']],
    });

    const ratedStoreIds = new Set(userRatings.map((r) => r.storeId));
    const ratedStoresCount = ratedStoreIds.size;
    const pendingStoresCount = Math.max(0, totalStoresCount - ratedStoresCount);

    const allRatings = await Rating.findAll();
    const totalSum = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const platformAvgRating = allRatings.length > 0 ? (totalSum / allRatings.length).toFixed(1) : '0.0';

    const recentActivity = userRatings.slice(0, 5).map((r) => ({
      id: r.id,
      storeName: r.store ? r.store.name : 'Store',
      rating: r.rating,
      date: r.updatedAt.toISOString().split('T')[0],
    }));

    const unratedStores = allStores
      .filter((s) => !ratedStoreIds.has(s.id))
      .slice(0, 3)
      .map((s) => ({
        id: s.id,
        _id: s.id,
        name: s.name,
        address: s.address,
      }));

    res.json({
      success: true,
      data: {
        totalStoresCount,
        ratedStoresCount,
        pendingStoresCount,
        platformAvgRating,
        recentActivity,
        unratedStores,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  submitStoreRating,
  getMyRatings,
  getUserDashboardData,
};
