const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs-course', 'root', 'ayush', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
