const sequelize = require('sequelize');
const con = require('../util/database');

const ForgotPassword = con.define('ForgotPassword', {
    id: {
        type: sequelize.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
    },
    isActive: sequelize.BOOLEAN
})

module.exports = ForgotPassword;