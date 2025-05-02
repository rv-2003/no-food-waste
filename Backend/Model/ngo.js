// models/NGO.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db');

const NGO = sequelize.define('NGO', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  contactPerson: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
  operatingAreas: {
    type: DataTypes.JSONB, // example: ["Delhi", "Noida"]
  },
  verificationStatus: {
    type: DataTypes.ENUM("Pending", "Verified", "Rejected"),
    defaultValue: "Pending",
  },
  capacityPerDay: DataTypes.INTEGER,
  location: {
    type: DataTypes.STRING, // format: "latitude,longitude"
  },
}, {
  timestamps: true,
  tableName: 'NGOs'
});

module.exports = NGO;
