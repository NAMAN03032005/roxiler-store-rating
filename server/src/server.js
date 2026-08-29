const app = require('./app');
const { connectDatabase } = require('./config/database');
const { sequelize } = require('./models');
const { seedDataInternal } = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

// Connect Database, Sync Sequelize Tables, and Boot Server
connectDatabase()
  .then(async () => {
    // Sync Sequelize models with Database
    await sequelize.sync();
    console.log('[Sequelize ORM] Database models & tables synchronized successfully.');

    // Auto-seed demo dataset if database is empty
    await seedDataInternal();

    app.listen(PORT, () => {
      console.log(`[Express Server] API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`[Server Error] Database connection failure: ${err.message}`);
    process.exit(1);
  });
