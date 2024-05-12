const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    displayIndex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'category',
  }
);
class SubCategory extends Model {}

SubCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    displayIndex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,

    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'subCategory',
  }
);



SubCategory.belongsTo(Category, {
  foreignKey: 'categoryId',
});

// Categories have many SubCategories
Category.hasMany(SubCategory, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
});
module.exports = {Category,SubCategory};
