const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/db");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["restaurant", "caterer", "event_planner", "ngo"]],
      },
    },
    roleName: {  // Single column for all role-specific names
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "role_name",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      field: "created_at",
    },
  },
  {
    timestamps: false,
    tableName: "Users",
  }
);

module.exports = Users;


