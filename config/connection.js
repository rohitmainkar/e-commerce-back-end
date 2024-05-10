require('dotenv').config();

const Sequelize = require('sequelize');

// Define your configuration options
const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
  },
  production: {
    use_env_variable: 'JAWSDB_URL', // This will use the JAWSDB_URL environment variable for production
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
  },
};

// Initialize Sequelize with the config based on the environment
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

module.exports = sequelize;
