const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

class SaleOrder extends Model {}

SaleOrder.init({
  customerId: DataTypes.INTEGER,
  totalAmount: DataTypes.DECIMAL(10, 2),
  discountAmount: DataTypes.DECIMAL(10, 2),
  taxAmount: DataTypes.DECIMAL(10, 2),
  finalAmount: DataTypes.DECIMAL(10, 2),
  shippingAddress: DataTypes.TEXT,
  status: DataTypes.ENUM('pending', 'shipped', 'delivered')
}, {
  sequelize,
  modelName: 'SaleOrder',
  tableName: 'SaleOrders', // Adjust table name as needed
});

module.exports = SaleOrder;
