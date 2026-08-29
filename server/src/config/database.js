const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbName = process.env.DB_NAME || 'roxiler_store_rating';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';

let activeSequelize = null;

const createSequelizeInstance = () => {
  if (process.env.USE_MYSQL === 'true') {
    return new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 5000, idle: 10000 },
    });
  }
  return new Sequelize({
    dialect: 'sqlite',
    storage: './roxiler_store_rating.sqlite',
    logging: false,
  });
};

activeSequelize = createSequelizeInstance();

const connectDatabase = async () => {
  try {
    await activeSequelize.authenticate();
    console.log(`[Sequelize ORM] Connected successfully using ${activeSequelize.getDialect().toUpperCase()} dialect.`);
  } catch (error) {
    console.warn(`[Sequelize Notice] Initial connection failed (${error.message}). Falling back to SQLite dialect...`);
    activeSequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './roxiler_store_rating.sqlite',
      logging: false,
    });
    await activeSequelize.authenticate();
    console.log('[Sequelize SQLite] Successfully authenticated via SQLite storage engine.');
  }
  return activeSequelize;
};

module.exports = {
  get sequelize() {
    return activeSequelize;
  },
  connectDatabase,
};
