const Sequelize = require('sequelize');
const config = require('./config.json');


const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]; // Get the configuration for the current environment

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    // You can add additional options here if needed
  }
);

module.exports = sequelize;
