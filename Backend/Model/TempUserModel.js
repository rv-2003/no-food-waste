// TempUserModel.js
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db");

const TempUsers = sequelize.define("TempUsers", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: "created_at",
  },
}, {
  timestamps: false, // Disable Sequelize's automatic timestamps
  tableName: "TempUsers", // Explicitly set the table name
});

module.exports = TempUsers;