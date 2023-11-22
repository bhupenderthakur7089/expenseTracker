const Razorpay = require('razorpay');
const User = require('../models/user');
const Order = require('../models/orders');
const Expense = require('../models/expense');
const expense = require('./expense');
const sequelize = require('../util/database');
const dotenv = require('dotenv').config();

exports.buyPremium = (req, res) => {
    console.log('razorpay credentials are:', process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)
    var rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" })
        .then((order) => {
            console.log(order);
            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    res.json({ order, key_id: rzp.key_id });
                })
                .catch(err => console.log(err));
        })
        .catch((err) => console.log(err));
}

exports.updateTransactionStatus = (req, res) => {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    Order
        .findOne({ where: { orderid: order_id } })
        .then(order => {
            console.log(order);
            const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            const promise2 = req.user.update({ ispremiumuser: true });
            Promise.all([promise1, promise2])
                .then(() => {
                    return res.json({ sucess: true, message: "Transaction Successful", token: expense.generateAccessToken(userId, req.user.name, true) });
                }).catch((error) => {
                    throw new Error(error)
                })
        })
        .catch(err => console.log(err));
}

exports.checkPremium = (req, res) => {
    // console.log('User ID is:', req.user.id);
    res.json({ data: req.user });
}

exports.getUserLeaderBoard = (req, res) => {
    console.log('user id is: ', req.user.id);
    User.findAll()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            console.error('Error fetching expenses:', error);
        });
}