const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Customer extends Model {}

Customer.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Customer',
});

module.exports = Customer;
