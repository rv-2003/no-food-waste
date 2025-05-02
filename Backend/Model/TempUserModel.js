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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true, // Optional field
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true, // Optional field
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true, // URL for profile picture
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["restaurant", "caterer", "event_planner", "ngo"]],
    },
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
  timestamps: false,
  tableName: "TempUsers",
});

module.exports = TempUsers;
