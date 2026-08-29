const { User } = require('../models');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new Normal User
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      res.status(400);
      throw new Error('Please provide all required registration fields');
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email address');
    }

    // Role defaults to NORMAL_USER for public registration
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: 'NORMAL_USER',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
          token: generateToken(user.id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password credentials');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
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
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change authenticated user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      res.status(400);
      throw new Error('Please provide current password, new password, and confirmation');
    }

    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error('New password and confirmation password do not match');
    }

    const user = await User.findByPk(req.user.id);

    if (!user || !(await user.matchPassword(oldPassword))) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
};
