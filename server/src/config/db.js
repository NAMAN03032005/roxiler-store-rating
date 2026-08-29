const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const seedDatabaseInternal = async () => {
  const User = require('../models/User');
  const Store = require('../models/Store');
  const Rating = require('../models/Rating');

  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('[MongoDB DB Init] Populating initial seed database records...');

  // 1. Admin
  await User.create({
    name: 'Christopher David Sterling',
    email: 'admin.sterling@roxiler.com',
    password: 'Admin@Password123',
    address: '1 System Admin Way, Central Hub Suite 400',
    role: 'ADMIN',
  });

  // 2. Owners
  const owner1 = await User.create({
    name: 'Beatrice Eleanor Vance',
    email: 'beatrice.vance@apexelectronics.com',
    password: 'Owner@Password123',
    address: '1088 Innovation Boulevard, Tech Park West',
    role: 'STORE_OWNER',
  });

  const owner2 = await User.create({
    name: 'Edward Francis O\'Connor',
    email: 'edward.oconnor@freshharvest.org',
    password: 'Owner@Password123',
    address: '99 Market Street, Financial Plaza Block B',
    role: 'STORE_OWNER',
  });

  const owner3 = await User.create({
    name: 'George Benjamin Miller',
    email: 'george.miller@urbanbooks.com',
    password: 'Owner@Password123',
    address: '55 Library Lane, Downtown Cultural District',
    role: 'STORE_OWNER',
  });

  // 3. Normal Users
  const user1 = await User.create({
    name: 'Alexander Montgomery Harrison',
    email: 'alexander.harrison@example.com',
    password: 'User@Password123',
    address: '742 Evergreen Terrace, Sector 14, Metro City',
    role: 'NORMAL_USER',
  });

  const user2 = await User.create({
    name: 'Deborah Rosalind Jenkins',
    email: 'deborah.jenkins@example.org',
    password: 'User@Password123',
    address: '456 Oakridge Avenue, Sunset Valley Heights',
    role: 'NORMAL_USER',
  });

  const user3 = await User.create({
    name: 'Fiona Genevieve Campbell',
    email: 'fiona.campbell@example.com',
    password: 'User@Password123',
    address: '23 Palm Grove Avenue, Suite 101, Coastal City',
    role: 'NORMAL_USER',
  });

  // 4. Stores
  const store1 = await Store.create({
    name: 'Apex Electronics MegaStore',
    email: 'contact@apexelectronics.com',
    address: '404 Silicon Plaza, Technology District, Sector 5',
    owner: owner1._id,
  });

  const store2 = await Store.create({
    name: 'Fresh Harvest Organic Market',
    email: 'info@freshharvest.org',
    address: '12 Green Valley Highway, Suburbia North',
    owner: owner2._id,
  });

  const store3 = await Store.create({
    name: 'Urban Books & Crafts Emporium',
    email: 'support@urbanbooks.com',
    address: '88 Heritage Lane, Cultural Square, Downtown',
    owner: owner3._id,
  });

  await Store.create({
    name: 'Starlight Coffee Roasters',
    email: 'hello@starlightcoffee.co',
    address: '15 Promenade Avenue, Oceanfront Boulevard',
    owner: null,
  });

  await Store.create({
    name: 'Velocity Fitness & Apparel',
    email: 'contact@velocityfitness.io',
    address: '300 Stadium Road, Sports Complex Gate 2',
    owner: null,
  });

  await Store.create({
    name: 'Artisan Bakery & Patisserie',
    email: 'orders@artisanbakery.com',
    address: '77 Bakers Row, Old Town Square',
    owner: null,
  });

  // 5. Ratings
  await Rating.create({ user: user1._id, store: store1._id, rating: 5 });
  await Rating.create({ user: user1._id, store: store2._id, rating: 4 });
  await Rating.create({ user: user2._id, store: store1._id, rating: 4 });
  await Rating.create({ user: user2._id, store: store3._id, rating: 3 });
  await Rating.create({ user: user3._id, store: store1._id, rating: 5 });

  await Rating.calculateAverageRating(store1._id);
  await Rating.calculateAverageRating(store2._id);
  await Rating.calculateAverageRating(store3._id);

  console.log('✅ [MongoDB DB Init] Seed records populated successfully!');
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roxiler_store_rating';
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    await seedDatabaseInternal();
  } catch (error) {
    console.log('[MongoDB] Local instance unavailable. Initializing MongoMemoryServer fallback...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB Memory Server] Running and connected at ${uri}`);
    await seedDatabaseInternal();
  }
};

module.exports = connectDB;
