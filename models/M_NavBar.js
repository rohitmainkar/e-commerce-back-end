const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

const NavBarItem = sequelize.define('NavBarItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    title: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  produtCatrgory: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  produtsubCatrgory: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  displayImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayIndex: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  link_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const NavBarSubItems = sequelize.define('NavBarSubItems', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    title: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    navBarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    displayImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    displayIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      link_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  });
  
  // This assumes `navBarId` is the foreign key in NavBarSubItems
  NavBarItem.hasMany(NavBarSubItems, { foreignKey: 'navBarId' }); 


module.exports = {
    NavBarItem,
    NavBarSubItems
};
