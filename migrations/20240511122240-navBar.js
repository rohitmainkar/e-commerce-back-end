// YYYYMMDDHHMMSS-create-nav-bar-item.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NavBarItems', {
      title: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      produtCatrgory: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      produtsubCatrgory: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      displayImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      displayIndex: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      link_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NavBarItems');
  }
};
