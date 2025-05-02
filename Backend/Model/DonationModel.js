const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require ("../Config/db.js");
const Users=require("./UserModel");
const Donations = sequelize.define("Donations", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  foodType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending", // Default status for donations
  },
  ngo_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",  // Default status for NGO (Pending, Accepted, etc.)
  },
  donor_status: {
    type: DataTypes.STRING,
    defaultValue: "pending", // Default status for donor (Pending, Delivered, etc.)
  },
  acceptedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});


module.exports = Donations; 