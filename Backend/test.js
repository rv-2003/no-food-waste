const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('feedingforward', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err));
