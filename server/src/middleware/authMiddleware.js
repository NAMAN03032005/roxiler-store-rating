const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Protect middleware - Verifies JWT Bearer token via Sequelize
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user profile no longer exists');
      }

      next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed or expired'));
    }
  } else {
    res.status(401);
    return next(new Error('Not authorized, authorization token is missing'));
  }
};

/**
 * Authorize middleware - Role-based authorization
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Role '${req.user.role}' is not authorized to access this route`));
    }

    next();
  };
};

module.exports = { protect, authorize };
