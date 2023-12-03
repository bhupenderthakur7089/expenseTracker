const dotenv = require('dotenv').config();
const sequelize = require('sequelize');

const con = new sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
})

module.exports = con;