const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/db');

const Pickup = sequelize.define('Pickup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING, // Removed ENUM
    defaultValue: 'Pending', // You can still default to a known value
  },
  actualPickupTime: DataTypes.DATE,
  pickedUp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  delivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ngoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'NGOs',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  donationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Donations',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  donorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
}, {
  timestamps: true,
});

module.exports = Pickup;



