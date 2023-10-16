const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Users = sequelize.define('Users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true,
      
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Adding a premium user column too
      ispremiumuser: Sequelize.BOOLEAN
   
  });
  module.exports = Users;