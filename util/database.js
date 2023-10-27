const sequelize = require('sequelize');
const con = new sequelize('expense_tracker', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = con;