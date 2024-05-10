const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Images extends Model {}

Images.init ({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: { // Change to match the column name in your database
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: { // Change to match the column name in your database
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  view: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
},
{
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'Images',
});

module.exports = Images;
