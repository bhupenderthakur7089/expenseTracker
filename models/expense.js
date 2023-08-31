const sequelize = require('sequelize');
const con = require('../util/database');

const Expense = con.define('expense', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: sequelize.INTEGER,
    description: sequelize.STRING,
    category: sequelize.STRING
})

module.exports = Expense;