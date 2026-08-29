const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// 1. User Model Definition
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { len: [20, 60] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: { len: [1, 400] },
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'STORE_OWNER', 'NORMAL_USER'),
      defaultValue: 'NORMAL_USER',
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Store Model Definition
const Store = sequelize.define(
  'Store',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: { len: [1, 400] },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'Stores',
  }
);

// 3. Rating Model Definition
const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  {
    timestamps: true,
    tableName: 'Ratings',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'storeId'],
      },
    ],
  }
);

// 4. Establish Associations
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
User.hasOne(Store, { foreignKey: 'ownerId', as: 'store' });

Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });

Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
