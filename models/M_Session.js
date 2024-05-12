const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_active_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

class UserActivityLog extends Model {}

UserActivityLog.init(
  {
    log_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING, // Adjust the data type according to your requirements
      allowNull: true // Update to false if client_id is required
    },
    ip_address: {
      type: DataTypes.STRING, // Adjust the data type according to your requirements
      allowNull: true // Update to false if ip_address is required
    },
    request_body: {
      type: DataTypes.TEXT, // Adjust the data type according to your requirements
      allowNull: true // Update to false if request_body is required
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'UserActivityLog',
    tableName: 'user_activity_logs',
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    createdAt: 'createdAt', // Rename createdAt column
    updatedAt: 'updatedAt' // Rename updatedAt column
  }
);

module.exports = {
  Session,
  UserActivityLog
};
