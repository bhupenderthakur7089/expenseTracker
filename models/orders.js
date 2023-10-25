const sequelize = require('sequelize');
const con = require('../util/database');

//id, name , password, phone number, role

const Order = con.define('order', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: sequelize.STRING,
    orderid: sequelize.STRING,
    status: sequelize.STRING
})

module.exports = Order;