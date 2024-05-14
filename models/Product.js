const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const {Category,SubCategory} = require('./category');

const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const Images = require('./Images');

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'id'
      }
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: SubCategory,
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    originPrice: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discountPrice: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discountPercentage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: {
        isNumeric: true
      }
    },
    stars: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descr: {
      type: DataTypes.STRING,
      allowNull: true
    },

    isNew: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isBestSaller: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isFreeShipping: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    
  },
  {
    sequelize,
    timestamps: true, // Enable timestamps
    createdAt: 'createdAt', // Define createdAt field
    updatedAt: 'updatedAt', // Define updatedAt field
    freezeTableName: true,
    modelName: 'product'
  }
);

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
});

Product.hasMany(Images, { onDelete: 'CASCADE' });
Images.belongsTo(Product);

module.exports = Product;
