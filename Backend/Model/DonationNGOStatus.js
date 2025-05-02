const { DataTypes } =require("sequelize");
const { sequelize } =require("../Config/db");

const DonationNGOStatus = sequelize.define("DonationNGOStatus", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  donationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Donations",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  ngoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "NGOs",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "declined"),
    defaultValue: "pending",
  },
}, {
  timestamps: true,
  tableName: "DonationNGOStatus",
});

module.exports = DonationNGOStatus;
