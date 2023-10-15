const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Expense = sequelize.define('Expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    amount: Sequelize.FLOAT,
    category: Sequelize.STRING,
    description: Sequelize.STRING,
})
module.exports= Expense;