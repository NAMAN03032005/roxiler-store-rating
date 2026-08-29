const { Store, Rating, User } = require('../models');

/**
 * @desc    Get store belonging to authenticated Store Owner
 * @route   GET /api/owner/store
 * @access  Private (STORE_OWNER)
 */
const getOwnerStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      res.status(404);
      throw new Error('No store associated with this Store Owner account');
    }

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Store Owner dashboard statistics and reviews
 * @route   GET /api/owner/dashboard
 * @access  Private (STORE_OWNER)
 */
const getOwnerDashboard = async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      res.status(404);
      throw new Error('No store associated with this Store Owner account');
    }

    const storeRatings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['updatedAt', 'DESC']],
    });

    const ratingCount = storeRatings.length;
    const totalSum = storeRatings.reduce((acc, r) => acc + r.rating, 0);
    const overallRating = ratingCount > 0 ? Math.round((totalSum / ratingCount) * 10) / 10 : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    storeRatings.forEach((r) => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating] += 1;
      }
    });

    const recentRatings = storeRatings.slice(0, 10).map((r) => ({
      id: r.id,
      userName: r.user ? r.user.name : 'Customer',
      userEmail: r.user ? r.user.email : 'N/A',
      rating: r.rating,
      date: r.updatedAt.toISOString().split('T')[0],
    }));

    res.json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
        },
        overallRating,
        ratingCount,
        distribution,
        storeRatings: recentRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all ratings submitted for owner's store
 * @route   GET /api/owner/ratings
 * @access  Private (STORE_OWNER)
 */
const getOwnerRatings = async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      res.status(404);
      throw new Error('No store associated with this Store Owner account');
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['updatedAt', 'DESC']],
    });

    const formattedRatings = ratings.map((r) => ({
      id: r.id,
      userName: r.user ? r.user.name : 'Customer',
      userEmail: r.user ? r.user.email : 'N/A',
      rating: r.rating,
      date: r.updatedAt.toISOString().split('T')[0],
    }));

    res.json({
      success: true,
      data: formattedRatings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOwnerStore,
  getOwnerDashboard,
  getOwnerRatings,
};
