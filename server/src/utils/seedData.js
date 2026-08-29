const dotenv = require('dotenv');
const { connectDatabase } = require('../config/database');
const { sequelize, User, Store, Rating } = require('../models');

dotenv.config();

const seedDataInternal = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      return;
    }

    console.log('[Seed Script] Populating initial demo dataset into database via Sequelize...');

    // 1. Create System Administrator
    const admin = await User.create({
      name: 'Christopher David Sterling',
      email: 'admin.sterling@roxiler.com',
      password: 'Admin@Password123',
      address: '1 System Admin Way, Central Hub Suite 400',
      role: 'ADMIN',
    });

    // 2. Create Store Owners
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

    // 3. Create Normal Users
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

    // 4. Create Merchant Stores
    const store1 = await Store.create({
      name: 'Apex Electronics MegaStore',
      email: 'contact@apexelectronics.com',
      address: '404 Silicon Plaza, Technology District, Sector 5',
      ownerId: owner1.id,
    });

    const store2 = await Store.create({
      name: 'Fresh Harvest Organic Market',
      email: 'info@freshharvest.org',
      address: '12 Green Valley Highway, Suburbia North',
      ownerId: owner2.id,
    });

    const store3 = await Store.create({
      name: 'Urban Books & Crafts Emporium',
      email: 'support@urbanbooks.com',
      address: '88 Heritage Lane, Cultural Square, Downtown',
      ownerId: owner3.id,
    });

    const store4 = await Store.create({
      name: 'Starlight Coffee Roasters',
      email: 'hello@starlightcoffee.co',
      address: '15 Promenade Avenue, Oceanfront Boulevard',
      ownerId: null,
    });

    const store5 = await Store.create({
      name: 'Velocity Fitness & Apparel',
      email: 'contact@velocityfitness.io',
      address: '300 Stadium Road, Sports Complex Gate 2',
      ownerId: null,
    });

    const store6 = await Store.create({
      name: 'Artisan Bakery & Patisserie',
      email: 'orders@artisanbakery.com',
      address: '77 Bakers Row, Old Town Square',
      ownerId: null,
    });

    // 5. Submit Initial Store Ratings
    await Rating.create({ userId: user1.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user1.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store1.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store3.id, rating: 3 });
    await Rating.create({ userId: user3.id, storeId: store1.id, rating: 5 });

    console.log('✅ [Seed Script] Demo dataset seeded successfully!');
  } catch (error) {
    console.error(`❌ [Seed Script Error] ${error.message}`);
  }
};

const runStandaloneSeed = async () => {
  try {
    await connectDatabase();
    await sequelize.sync({ force: true });
    await seedDataInternal();

    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👑 ADMIN:        admin.sterling@roxiler.com  / Admin@Password123');
    console.log('💼 STORE OWNER: beatrice.vance@apexelectronics.com / Owner@Password123');
    console.log('👤 NORMAL USER: alexander.harrison@example.com / User@Password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Command Error] ${err.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}

module.exports = { seedDataInternal };
