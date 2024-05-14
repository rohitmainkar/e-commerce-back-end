const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');
const SaleOrder = require('./M_SalesOrder'); // Import the SaleOrder model

class SaleOrderItem extends Model {}

SaleOrderItem.init({
  saleOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2),
  discountAmount: DataTypes.DECIMAL(10, 2),
  taxAmount: DataTypes.DECIMAL(10, 2),
  totalAmount: DataTypes.DECIMAL(10, 2)
}, {
  sequelize,
  modelName: 'SaleOrderItem',
  tableName: 'SaleOrderItems', // Adjust table name as needed
});

SaleOrderItem.belongsTo(SaleOrder, {
  foreignKey: 'saleOrderId',
});

// Categories have many SubCategories
SaleOrder.hasMany(SaleOrderItem, {
  foreignKey: 'saleOrderId',
  onDelete: 'CASCADE'
});

module.exports = SaleOrderItem;
