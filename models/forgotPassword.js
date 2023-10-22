const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgotPassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = forgotPassword;