const sequelize = require('sequelize');
const con = require('../util/database');

const User = con.define('user', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: sequelize.STRING,
    email: {
       type:  sequelize.STRING,
       allowNull: false,
       unique: true
    },
    password: sequelize.STRING,
    ispremiumuser: sequelize.BOOLEAN
});

module.exports = User;