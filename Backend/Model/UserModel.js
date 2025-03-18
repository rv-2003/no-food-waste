const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db");
const bcrypt = require("bcryptjs");

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID, // Use UUID for the id column
    defaultValue: Sequelize.UUIDV4, // Automatically generate UUIDs
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING(255), // Match VARCHAR(255)
    allowNull: false, // NOT NULL
  },
  email: {
    type: DataTypes.STRING(255), // Match VARCHAR(255)
    allowNull: false, // NOT NULL
    unique: true, // UNIQUE constraint
    validate: {
      isEmail: true, // Validate email format
    },
  },
  password: {
    type: DataTypes.STRING(255), // Match VARCHAR(255)
    allowNull: false, // NOT NULL
  },
  role: {
    type: DataTypes.STRING(50), // Match VARCHAR(50)
    allowNull: false, // NOT NULL
    validate: {
      isIn: [["restaurant", "caterer", "event_planner", "ngo"]], // CHECK constraint
    },
  },
  createdAt: {
    type: DataTypes.DATE, // Match TIMESTAMP
    defaultValue: Sequelize.NOW, // DEFAULT CURRENT_TIMESTAMP
    field: "created_at", // Map to the database column name
  },
}, {
  timestamps: false, // Disable Sequelize's automatic `createdAt` and `updatedAt`
  tableName: "Users", // Explicitly set the table name
});
module.exports = Users;

